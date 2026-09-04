import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/leads";

const UA = "FlagshipAuditBot/1.0 (+https://theflagship.example)";
const TIMEOUT_MS = 8_000;
const MAX_BYTES = 2_500_000;

type Finding = { label: string; severity: "pass" | "warn" | "fail"; note: string };

function isBlockedHost(hostname: string) {
  const h = hostname.toLowerCase();
  return (
    h === "localhost" ||
    h === "0.0.0.0" ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    /^127\./.test(h) ||
    /^10\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
    /^169\.254\./.test(h)
  );
}

function analyze(url: string, html: string) {
  const findings: Finding[] = [];
  const add = (label: string, ok: boolean | "warn", note: string) =>
    findings.push({ label, severity: ok === true ? "pass" : ok === "warn" ? "warn" : "fail", note });

  const secure = url.startsWith("https://");
  add("Uses HTTPS", secure, secure ? "Secure connection — trust signal intact." : "No HTTPS: browsers flag the site as 'not secure'.");

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
  const titleLen = title.length;
  add("Page title", titleLen >= 20 && titleLen <= 65 ? true : titleLen ? "warn" : false,
    titleLen ? `"${title.slice(0, 60)}" (${titleLen} chars — ideal 20–65).` : "Missing <title> — the single cheapest SEO fix.");

  const desc = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1]
    ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1] ?? "";
  add("Meta description", desc.length >= 50 && desc.length <= 160 ? true : desc ? "warn" : false,
    desc ? `${desc.length} chars — aim 50–160.` : "Missing meta description: search engines improvise your pitch.");

  const h1s = html.match(/<h1[\s>]/gi)?.length ?? 0;
  add("Exactly one H1", h1s === 1, h1s === 1 ? "Clear page headline." : `${h1s} H1 tags — search engines and screen readers expect exactly one.`);

  const h2s = html.match(/<h2[\s>]/gi)?.length ?? 0;
  add("Content structure (H2s)", h2s >= 2 ? true : "warn", h2s >= 2 ? `${h2s} sections — scannable.` : "Few or no H2s — the page is hard to scan.");

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  add("Substantive content", words >= 300 ? true : words >= 120 ? "warn" : false,
    `${words} words — ${words >= 300 ? "enough to argue your case." : "thin content struggles to rank or convince."}`);

  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const withAlt = imgs.filter((tag) => /\balt\s*=\s*["'][^"']+["']/i.test(tag)).length;
  const altPct = imgs.length ? Math.round((withAlt / imgs.length) * 100) : 100;
  add("Image accessibility", altPct >= 90 ? true : altPct >= 60 ? "warn" : false,
    imgs.length ? `${withAlt}/${imgs.length} images have alt text (${altPct}%).` : "No images found.");

  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  add("Mobile viewport", viewport, viewport ? "Mobile rendering configured." : "No viewport meta — the site is broken on phones.");

  const lang = html.match(/<html[^>]+lang=["']([a-z-]+)["']/i)?.[1];
  add("Language declared", Boolean(lang), lang ? `lang="${lang}" — screen readers thank you.` : "No lang attribute on <html>.");

  const og = /<meta[^>]+property=["']og:/i.test(html);
  add("Social preview (og tags)", og ? true : "warn", og ? "Link previews will look intentional." : "No og: tags — shared links render bare.");

  const scripts = html.match(/<script\b[^>]*src=/gi)?.length ?? 0;
  add("Script weight", scripts <= 8 ? true : scripts <= 15 ? "warn" : false,
    `${scripts} external scripts — ${scripts <= 8 ? "restrained." : "every script taxes load time on real networks."}`);

  const htmlKb = Math.round(html.length / 1024);
  const textRatio = html.length ? Math.round((text.length / html.length) * 100) : 0;
  add("Text-to-code ratio", textRatio >= 10 ? true : textRatio >= 5 ? "warn" : false,
    `${textRatio}% text vs code (${htmlKb} KB HTML) — ${textRatio >= 10 ? "healthy." : "mostly scaffolding; content is an afterthought."}`);

  const ctaHits = (text.match(/\b(contact|get started|book|demo|quote|call|sign\s?up|subscribe|enquire|inquire)\b/gi) ?? []).length;
  add("Calls to action", ctaHits >= 3 ? true : ctaHits >= 1 ? "warn" : false,
    ctaHits ? `${ctaHits} action phrases found.` : "No clear call to action — visitors drift without a next step.");

  const contactInfo = /[\w.+-]+@[\w-]+\.[\w.]+|\+?\d[\d\s().-]{7,}\d/.test(text);
  add("Contact discoverability", contactInfo ? true : "warn",
    contactInfo ? "Email or phone findable." : "No email/phone in the page — friction for high-intent visitors.");

  const dim = (keys: string[]) => {
    const rel = findings.filter((f) => keys.includes(f.label));
    if (!rel.length) return 0;
    const pts = rel.reduce((a, f) => a + (f.severity === "pass" ? 1 : f.severity === "warn" ? 0.5 : 0), 0);
    return Math.round((pts / rel.length) * 100);
  };

  const scores = {
    seo: dim(["Page title", "Meta description", "Exactly one H1", "Content structure (H2s)", "Language declared", "Social preview (og tags)", "Substantive content"]),
    content: dim(["Substantive content", "Text-to-code ratio", "Content structure (H2s)"]),
    ux: dim(["Mobile viewport", "Image accessibility", "Script weight", "Uses HTTPS"]),
    conversion: dim(["Calls to action", "Contact discoverability"]),
  };
  const overall = Math.round((scores.seo + scores.content + scores.ux + scores.conversion) / 4);

  return {
    overall,
    scores,
    findings,
    stats: { words, images: imgs.length, scripts, htmlKb, title: title.slice(0, 100) },
  };
}

export async function POST(request: Request) {
  let target: URL;
  try {
    const body = (await request.json()) as { url?: string };
    const raw = String(body.url ?? "").trim().slice(0, 300);
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    target = new URL(withProto);
    if (!["http:", "https:"].includes(target.protocol)) throw new Error("bad protocol");
    if (isBlockedHost(target.hostname)) throw new Error("blocked host");
  } catch {
    return NextResponse.json({ ok: false, error: "Enter a valid public URL (e.g. example.com)." }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `The site responded with ${res.status}. Try the homepage URL.` }, { status: 200 });
    }
    const html = (await res.text()).slice(0, MAX_BYTES);
    const result = analyze(target.toString(), html);
    await recordEvent({ type: "event", name: "website_audit", host: target.hostname, score: result.overall });
    return NextResponse.json({ ok: true, url: target.toString(), ...result });
  } catch (err) {
    const reason = (err as Error).name === "AbortError" ? "timed out" : "couldn't be reached from the server";
    return NextResponse.json({ ok: false, error: `${target.hostname} ${reason}. If the site is live, run this audit from a deployed environment or check the URL.` }, { status: 200 });
  } finally {
    clearTimeout(timer);
  }
}
