import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/leads";
import { enforceOrigin, enforceRateLimit, readJson } from "@/lib/request-guard";

const ALLOWED_EVENT_NAMES = new Set([
  "pageview",
  "discovery_goal",
  "concierge_complete",
  "assessment_complete",
  "audit_complete",
  "calculator_use",
  "brief_submit",
  "lead_submit",
  "website_audit",
]);

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "events", 60);
  if (limited) return limited;
  const origin = enforceOrigin(request);
  if (origin) return origin;
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const type = String(body.type ?? "event");
    const name = String(body.name ?? body.type ?? "");

    if (type === "pageview") {
      await recordEvent({
        type: "pageview",
        path: String(body.path ?? "").slice(0, 200),
        locale: String(body.locale ?? "").slice(0, 8),
        ref: body.ref ? String(body.ref).slice(0, 300) : null,
      });
      return NextResponse.json({ ok: true });
    }

    if (!ALLOWED_EVENT_NAMES.has(name)) {
      return NextResponse.json({ ok: false, error: "unknown event" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(body)) {
      if (k === "type" || k === "name") continue;
      if (typeof v === "string") data[k] = v.slice(0, 200);
      else if (typeof v === "number" || typeof v === "boolean") data[k] = v;
    }
    await recordEvent({ type: "event", name, ...data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
