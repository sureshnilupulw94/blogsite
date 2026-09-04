"use client";

import { useMemo, useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import type { AssessmentConfig } from "@/lib/data/tools";
import { MiniCapture } from "./forms";
import { Badge, Btn, cx } from "./ui";
import { localePath, type Locale } from "@/lib/i18n";

const scale = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

export default function AssessTool({ locale, dict, config }: { locale: Locale; dict: Dict; config: AssessmentConfig }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = config.questions.length;
  const answered = Object.keys(answers).length;

  const results = useMemo(() => {
    const dimScores: Record<string, { sum: number; n: number }> = {};
    for (const q of config.questions) {
      dimScores[q.dim] ??= { sum: 0, n: 0 };
    }
    for (const [idx, val] of Object.entries(answers)) {
      const dim = config.questions[Number(idx)].dim;
      dimScores[dim].sum += val + 1; // 1..5
      dimScores[dim].n += 1;
    }
    const dims = config.dimensions.map((d) => {
      const s = dimScores[d.key];
      const pct = s && s.n ? Math.round(((s.sum / s.n) - 1) / 4 * 100) : 0;
      return { ...d, pct };
    });
    const overall = dims.length ? Math.round(dims.reduce((acc, d) => acc + d.pct, 0) / dims.length) : 0;
    const opportunities = [...dims].sort((a, b) => a.pct - b.pct).slice(0, 3);
    return { dims, overall, opportunities };
  }, [answers, config]);

  function answer(value: number) {
    setAnswers((a) => ({ ...a, [current]: value }));
    if (current + 1 < total) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div>
        <div className="rounded-2xl border border-accent/30 bg-coal p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge accent>{dict.tools.results}</Badge>
              <p className="mt-3 text-sm text-mute">{dict.tools.yourScore}</p>
              <p className="font-display text-6xl font-bold text-accent">
                {results.overall}<span className="text-2xl text-mute">/100</span>
              </p>
            </div>
            <button type="button" onClick={() => { setAnswers({}); setCurrent(0); setFinished(false); }} className="rounded-full border border-line px-5 py-2.5 font-display text-sm hover:border-accent/50">
              {dict.common.restart}
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {results.dims.map((d) => (
              <div key={d.key}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="font-display text-sm font-semibold">{d.label}</span>
                  <span className="font-mono text-xs text-accent">{d.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${d.pct}%` }} />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-mute/60">
                  <span>{d.low}</span><span>{d.high}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-line bg-carbon p-6">
            <p className="kicker">{dict.tools.opportunities}</p>
            <ol className="mt-3 space-y-2">
              {results.opportunities.map((o, i) => (
                <li key={o.key} className="flex items-center gap-3 font-display text-lg font-semibold">
                  <span className="font-mono text-xs text-accent">0{i + 1}</span> {o.label}
                </li>
              ))}
            </ol>
            <MiniCapture
              dict={dict}
              cta={dict.tools.getRoadmap}
              payload={{ tool: config.slug, score: results.overall, opportunities: results.opportunities.map((o) => o.label).join(", ") }}
            />
          </div>

          <div className="mt-6">
            <Btn href={localePath(locale, "contact")} variant="ghost">{dict.common.contactUs}</Btn>
          </div>
        </div>
      </div>
    );
  }

  const q = config.questions[current];

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
        {scale.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => answer(i)}
            className={cx(
              "rounded-xl border p-3 text-xs font-medium transition-all hover:-translate-y-0.5",
              answers[current] === i ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon text-mute hover:border-accent/30 hover:text-paper"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <button type="button" disabled={current === 0} onClick={() => setCurrent(current - 1)} className="font-mono text-xs text-mute hover:text-paper disabled:opacity-40">
          ← {dict.common.back}
        </button>
        <p className="font-mono text-[10px] text-mute/60">{answered}/{total}</p>
      </div>
    </div>
  );
}
