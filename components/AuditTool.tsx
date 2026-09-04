"use client";

import { useMemo, useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import type { AuditConfig } from "@/lib/data/tools";
import { track } from "@/lib/analytics";
import { MiniCapture } from "./forms";
import { Badge, Btn, cx } from "./ui";
import { localePath, type Locale } from "@/lib/i18n";

export default function AuditTool({ locale, dict, config }: { locale: Locale; dict: Dict; config: AuditConfig }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = config.questions.length;
  const answered = Object.keys(answers).length;

  const report = useMemo(() => {
    const dimScores: Record<string, { sum: number; max: number }> = {};
    for (const q of config.questions) {
      dimScores[q.dim] ??= { sum: 0, max: 0 };
      dimScores[q.dim].max += 4;
    }
    for (const [idx, points] of Object.entries(answers)) {
      const dim = config.questions[Number(idx)].dim;
      dimScores[dim].sum += points;
    }
    const dims = config.dimensions.map((d) => ({
      ...d,
      pct: dimScores[d.key] && dimScores[d.key].max ? Math.round((dimScores[d.key].sum / dimScores[d.key].max) * 100) : 0,
    }));
    const overall = dims.length ? Math.round(dims.reduce((a, d) => a + d.pct, 0) / dims.length) : 0;
    const findings = config.dimensions.map((d) => {
      const pct = dims.find((x) => x.key === d.key)?.pct ?? 0;
      const rule = config.findings.find((f) => f.dim === d.key && pct <= f.max) ?? { severity: "pass" as const, text: "" };
      return { ...d, pct, ...rule };
    });
    const recs = dims.filter((d) => d.pct < 70).map((d) => config.recommendations.find((r) => r.dim === d.key)).filter(Boolean);
    const weakest = [...dims].sort((a, b) => a.pct - b.pct)[0];
    return { dims, overall, findings, recs, weakest };
  }, [answers, config]);

  function answer(points: number) {
    setAnswers((a) => ({ ...a, [current]: points }));
    if (current + 1 < total) setCurrent(current + 1);
    else {
      setFinished(true);
      track("audit_complete", { audit: config.slug });
    }
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-coal p-6 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge accent>{dict.tools.results}</Badge>
            <p className="mt-3 text-sm text-mute">{dict.tools.yourScore}</p>
            <p className="font-display text-6xl font-bold text-accent">{report.overall}<span className="text-2xl text-mute">/100</span></p>
          </div>
          <button type="button" onClick={() => { setAnswers({}); setCurrent(0); setFinished(false); }} className="rounded-full border border-line px-5 py-2.5 font-display text-sm hover:border-accent/50">
            {dict.common.restart}
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {report.findings.map((f) => (
            <div key={f.key} className="rounded-xl border border-line bg-carbon p-5">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-display text-sm font-semibold">{f.label}</span>
                <span className="font-mono text-xs text-accent">{f.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${f.pct}%` }} />
              </div>
              <p className={cx("mt-3 text-xs leading-relaxed", f.severity === "fail" ? "text-red-300/90" : f.severity === "warn" ? "text-yellow-200/90" : "text-mute")}>
                <span className="me-1.5 font-mono">{f.severity === "fail" ? "✕" : f.severity === "warn" ? "!" : "✓"}</span>
                {f.text}
              </p>
            </div>
          ))}
        </div>

        {report.recs.length ? (
          <div className="mt-8 rounded-xl border border-line bg-carbon p-6">
            <p className="kicker mb-3">Recommended fixes — weakest first</p>
            <ol className="space-y-2.5">
              {report.recs.map((r, i) => (
                <li key={i} className="flex gap-3 text-sm text-paper">
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  <span className="text-mute">{r!.text}</span>
                </li>
              ))}
            </ol>
            <MiniCapture dict={dict} cta={dict.tools.getRoadmap} payload={{ tool: config.slug, score: report.overall, weakest: report.weakest?.label }} />
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Btn href={localePath(locale, "contact")}>{dict.common.contactUs}</Btn>
          <Btn href={localePath(locale, "tools")} variant="ghost">{dict.nav.tools} →</Btn>
        </div>
      </div>
    );
  }

  const q = config.questions[current];
  const choices = q.choices ?? [
    { label: "Not at all", points: 0 }, { label: "Rarely", points: 1 },
    { label: "Sometimes", points: 2 }, { label: "Mostly", points: 3 }, { label: "Absolutely", points: 4 },
  ];

  return (
    <div className="rounded-2xl border border-line bg-coal p-6 sm:p-10">
      <div className="flex items-center justify-between">
        <Badge>{config.name}</Badge>
        <span className="font-mono text-xs text-mute">{dict.tools.question} {current + 1} {dict.tools.of} {total}</span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${(answered / total) * 100}%` }} />
      </div>
      <h2 className="mt-8 font-display text-xl font-bold leading-snug sm:text-2xl">{q.q}</h2>
      <div className="mt-8 grid gap-2 sm:grid-cols-5">
        {choices.map((c) => (
          <button key={c.label} type="button" onClick={() => answer(c.points)}
            className="rounded-xl border border-line bg-carbon p-3 text-xs font-medium text-mute transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:text-paper">
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <button type="button" disabled={current === 0} onClick={() => setCurrent(current - 1)} className="font-mono text-xs text-mute hover:text-paper disabled:opacity-40">← {dict.common.back}</button>
        <p className="font-mono text-[10px] text-mute/60">{answered}/{total}</p>
      </div>
    </div>
  );
}
