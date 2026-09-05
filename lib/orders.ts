import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type OrderStatus = "reserved" | "paid" | "fulfilled" | "cancelled";

export type OrderItem = {
  kind: "product" | "membership";
  slug: string;
  title: string;
  priceUsd: number;
  recurring?: string; // e.g. "/mo"
};

export type Order = {
  id: string;
  ref: string; // short human reference, e.g. FS-7K2Q
  at: string;
  item: OrderItem;
  name: string;
  email: string;
  company?: string;
  note?: string;
  status: OrderStatus;
};

const dataDir = path.join(process.cwd(), ".data");

function ref(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 4; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `FS-${out}`;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path.join(dataDir, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(path.join(dataDir, file), JSON.stringify(data, null, 2), "utf8");
}

export async function listOrders(): Promise<Order[]> {
  return readJson<Order[]>("orders.json", []);
}

export async function saveOrder(order: Order) {
  const orders = await listOrders();
  const i = orders.findIndex((o) => o.id === order.id);
  if (i >= 0) orders[i] = order;
  else orders.unshift(order);
  await writeJson("orders.json", orders);
}

export async function createOrder(input: {
  item: OrderItem;
  name: string;
  email: string;
  company?: string;
  note?: string;
}): Promise<Order> {
  const order: Order = {
    id: randomUUID(),
    ref: ref(),
    at: new Date().toISOString(),
    item: input.item,
    name: input.name.trim().slice(0, 120),
    email: input.email.trim().toLowerCase().slice(0, 160),
    company: input.company?.trim().slice(0, 120) || undefined,
    note: input.note?.trim().slice(0, 600) || undefined,
    status: "reserved",
  };
  await saveOrder(order);
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  return (await listOrders()).find((o) => o.id === id) ?? null;
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const order = await getOrder(id);
  if (!order) return;
  order.status = status;
  await saveOrder(order);
}
