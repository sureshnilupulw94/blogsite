/** SMTP email via nodemailer — configured through env. Failures never break flows. */

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

export async function sendMail(opts: { to: string; subject: string; text: string; html: string }): Promise<boolean> {
  if (!smtpConfigured()) return false;
  try {
    const nodemailer = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" } : undefined,
      connectionTimeout: 6_000,
      greetingTimeout: 6_000,
    });
    await transporter.sendMail({ from: process.env.SMTP_FROM, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html });
    return true;
  } catch {
    return false;
  }
}

export function magicLinkEmail(link: string) {
  const html = `<!doctype html><html><body style="margin:0;background:#0a0b0e;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b0e;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:440px;background:#101218;border:1px solid #232838;border-radius:16px">
        <tr><td style="padding:32px 32px 8px">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;color:#9aa1b2">THE FLAGSHIP · CLIENT PORTAL</p>
          <h1 style="margin:0 0 16px;font-size:22px;color:#edeff4">Your login link</h1>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#9aa1b2">Click below to open your workspace. The link works once and expires in 30 minutes.</p>
          <a href="${link}" style="display:inline-block;background:#d6ff3f;color:#10130a;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:999px;text-decoration:none">Open the portal</a>
          <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#6b7280">Didn't request this? Ignore the email — nothing changes.</p>
          <hr style="border:none;border-top:1px solid #232838;margin:24px 0">
          <p style="margin:0;font-size:11px;color:#6b7280;word-break:break-all">${link}</p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#6b7280">The Flagship — we make complex things clear.</p>
    </td></tr>
  </table>
</body></html>`;
  return {
    subject: "Your Flagship portal login link",
    html,
    text: `Your Flagship portal login link (single use, expires in 30 minutes):\n\n${link}\n`,
  };
}
