import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/config";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 64 * 1024;

export function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export function enforceRateLimit(request: Request, route: string, limit: number, windowMs = 60_000) {
  const result = rateLimit(`${route}:${clientKey(request)}`, limit, windowMs);
  if (result.allowed) return null;
  return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(result.retryAfter) } });
}

export function enforceOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  try {
    if (new URL(origin).origin !== new URL(siteUrl()).origin) {
      return NextResponse.json({ ok: false, error: "Invalid request origin" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request origin" }, { status: 403 });
  }
  return null;
}

export async function readJson<T>(request: Request): Promise<T> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) throw new Error("request too large");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) throw new Error("request too large");
  return JSON.parse(text) as T;
}
