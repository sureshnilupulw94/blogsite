import { NextResponse } from "next/server";
import { recordLead } from "@/lib/leads";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") sanitized[key] = value.slice(0, 5000);
      else if (typeof value === "number" || typeof value === "boolean") sanitized[key] = value;
      else if (value && typeof value === "object") sanitized[key] = JSON.stringify(value).slice(0, 5000);
    }
    await recordLead("leads", sanitized);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
