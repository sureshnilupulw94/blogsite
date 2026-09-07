import { NextResponse } from "next/server";
import { recordLead } from "@/lib/leads";
import { enforceOrigin, enforceRateLimit, readJson } from "@/lib/request-guard";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "subscribe", 5);
  if (limited) return limited;
  const origin = enforceOrigin(request);
  if (origin) return origin;
  try {
    const body = await readJson<{ email?: string }>(request);
    const email = String(body.email ?? "").slice(0, 200);
    if (!email.includes("@")) {
      return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
    }
    await recordLead("subscribers", { email });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
