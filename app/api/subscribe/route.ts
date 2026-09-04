import { NextResponse } from "next/server";
import { recordLead } from "@/lib/leads";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
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
