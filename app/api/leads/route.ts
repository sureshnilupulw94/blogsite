import { NextResponse } from "next/server";
import { recordLead } from "@/lib/leads";
import { smtpConfigured, sendMail } from "@/lib/mailer";
import { enforceOrigin, enforceRateLimit, readJson } from "@/lib/request-guard";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "leads", 20);
  if (limited) return limited;
  const origin = enforceOrigin(request);
  if (origin) return origin;
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") sanitized[key] = value.slice(0, 5000);
      else if (typeof value === "number" || typeof value === "boolean") sanitized[key] = value;
      else if (value && typeof value === "object") sanitized[key] = JSON.stringify(value).slice(0, 5000);
    }
    await recordLead("leads", sanitized);

    // optional studio notification
    const notify = process.env.MAILER_NOTIFY_EMAIL;
    if (smtpConfigured() && notify) {
      void sendMail({
        to: notify,
        subject: `New lead — ${String(sanitized.type ?? "contact")}${sanitized.tool ? ` (${sanitized.tool})` : ""}`,
        text: JSON.stringify(sanitized, null, 2),
        html: `<pre style="font-size:12px">${JSON.stringify(sanitized, null, 2).replace(/</g, "&lt;")}</pre>`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
