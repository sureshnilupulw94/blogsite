"use client";

import { useState, type FormEvent } from "react";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { MiniCapture } from "./forms";
import { Badge, Btn, cx } from "./ui";

type Finding = { label: string; severity: "pass" | "warn" | "fail"; note: string };
type Report = { overall: number; scores: { seo: number; content: number; ux: number; conversion: number }; findings: Finding[]; stats: { words: number; images: number; scripts: number; htmlKb: number; title: string } };

export default function WebsiteAudit({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/audit/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!data.ok) {
        setState("error");
        setError(data.error ?? dict.common.error);
        return;
      }
      setReport(data as Report);
      setState("done");
    } catch {
      setState("error");
      setError(dict.common.error);
    }
  }

  const dims = report
    ? [
        { label: "SEO", pct: report.scores.seo },
        { label: "Content", pct: report.scores.content },
        { label: "UX & design", pct: report.scores.ux },
        { label: "Conversion", pct: report.scores.conversion },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-line bg-coal p-6 sm:p-8">
        <Badge accent>Live audit — we actually fetch the page</Badge>
        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourcompany.com"
            inputMode="url"
            required
            className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
          />
          <button type="submit" disabled={state === "loading"} className="whitespace-nowrap rounded-full bg-accent px-7 py-3 font-display text-sm font-semibold text-accent-ink disabled:opacity-60">
            {state === "loading" ? "Auditing…" : "Run audit"}
          </button>
        </form>
        <p className="mt-3 font-mono text-[11px] text-mute/70">14 checks across SEO, content, UX and conversion. One request, one page, no follow-up crawling.</p>
        {state === "error" ? <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-300">{error}</p> : null}
      </div>

      {state === "done" && report ? (
        <div className="rounded-2xl border border-accent/30 bg-coal p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">{url}</p>
              <p className="mt-2 font-display text-6xl font-bold text-accent">{report.overall}<span className="text-2xl text-mute">/100</span></p>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px] text-mute">
              <span className="rounded-full border border-line px-3 py-1.5">{report.stats.words} words</span>
              <span className="rounded-full border border-line px-3 py-1.5">{report.stats.images} images</span>
              <span className="rounded-full border border-line px-3 py-1.5">{report.stats.scripts} scripts</span>
              <span className="rounded-full border border-line px-3 py-1.5">{report.stats.htmlKb} KB html</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {dims.map((d) => (
              <div key={d.label}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="font-display text-sm font-semibold">{d.label}</span>
                  <span className="font-mono text-xs text-accent">{d.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="kicker mb-4">All 14 checks</p>
            <ul className="space-y-2.5">
              {report.findings.map((f) => (
                <li key={f.label} className="flex items-start gap-3 rounded-xl border border-line/60 bg-carbon p-4">
                  <span className={cx("mt-0.5 font-mono text-sm", f.severity === "pass" ? "text-accent" : f.severity === "warn" ? "text-yellow-300/90" : "text-red-400/90")}>
                    {f.severity === "pass" ? "✓" : f.severity === "warn" ? "!" : "✕"}
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold">{f.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-mute">{f.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <MiniCapture dict={dict} cta="Fix these with us" payload={{ type: "audit", tool: "website-audit", url, score: report.overall }} />
          </div>
          <div className="mt-5">
            <Btn href={localePath(locale, "contact")} variant="ghost">{dict.common.contactUs}</Btn>
          </div>
        </div>
      ) : null}
    </div>
  );
}
