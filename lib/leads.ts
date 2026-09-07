import { mkdir, appendFile, readFile, writeFile } from "fs/promises";
import path from "path";
import { assertStorageReady } from "./storage.ts";

const dataDir = path.join(process.cwd(), ".data");

export type LeadRecord = { id: string; at: string; status?: string; note?: string } & Record<string, unknown>;
export type EventRecord = { at: string; type: string; name?: string; path?: string; locale?: string } & Record<string, unknown>;

async function ensureDir() {
  assertStorageReady();
  await mkdir(dataDir, { recursive: true });
}

async function append(file: string, payload: Record<string, unknown>) {
  await ensureDir();
  await appendFile(path.join(dataDir, file), JSON.stringify(payload) + "\n", "utf8");
}

export async function recordLead(kind: "leads" | "subscribers", payload: Record<string, unknown>) {
  await append(`${kind}.jsonl`, { at: new Date().toISOString(), ...payload });
}

export async function recordEvent(payload: Record<string, unknown>) {
  await append("events.jsonl", { at: new Date().toISOString(), ...payload });
}

/* ---------- generic json store (admin-side collections) ---------- */

export async function readJsonStore<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path.join(dataDir, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonStore(file: string, data: unknown) {
  await ensureDir();
  await writeFile(path.join(dataDir, file), JSON.stringify(data, null, 2), "utf8");
}

export async function readLeadById(id: string): Promise<LeadRecord | null> {
  const all = await readAll<LeadRecord>("leads.jsonl");
  return all.find((l) => l.id === id) ?? null;
}

export async function readAll<T>(file: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(dataDir, file), "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line, i) => {
        try {
          return { id: `${file}-${i}`, ...JSON.parse(line) } as T;
        } catch {
          return { id: `${file}-${i}`, at: "", raw: line } as unknown as T;
        }
      });
  } catch {
    return [];
  }
}

export async function updateLeadStatus(id: string, status: string, note?: string) {
  const file = path.join(dataDir, "leads.jsonl");
  let lines: string[] = [];
  try {
    lines = (await readFile(file, "utf8")).split("\n").filter(Boolean);
  } catch {
    return;
  }
  // id format: "leads.jsonl-<index>"
  const idx = Number(id.split("-").pop());
  if (Number.isNaN(idx) || idx < 0 || idx >= lines.length) return;
  try {
    const entry = JSON.parse(lines[idx]);
    entry.status = status;
    if (note !== undefined) entry.note = note;
    entry.updatedAt = new Date().toISOString();
    lines[idx] = JSON.stringify(entry);
    await writeFile(file, lines.join("\n") + "\n", "utf8");
  } catch {
    /* skip malformed line */
  }
}
