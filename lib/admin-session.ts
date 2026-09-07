import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { adminSecret } from "./config.ts";

const TTL_MS = 12 * 60 * 60 * 1000;

type AdminSession = { id: string; exp: number };

export function signAdminSession() {
  const payload = Buffer.from(JSON.stringify({ id: randomBytes(24).toString("hex"), exp: Date.now() + TTL_MS })).toString("base64url");
  const signature = createHmac("sha256", adminSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminSession(value: string | undefined | null) {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = createHmac("sha256", adminSecret()).update(payload).digest();
  const received = Buffer.from(signature, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    return Boolean(session.id && session.exp > Date.now());
  } catch {
    return false;
  }
}
