"use client";

import { useMemo, useState, useEffect } from "react";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import type { CalculatorConfig } from "@/lib/data/tools";
import { track } from "@/lib/analytics";
import { Badge, Btn } from "./ui";
import { MiniCapture } from "./forms";

function compute(slug: string, v: Record<string, number>) {
  if (slug === "roi-calculator") {
    const gross = v.people * v.hours * 52 * v.rate;
    const savings = gross * (v.automatable / 100);
    const maintenance = v.build * 0.15;
    const net = savings - maintenance;
    const roi = v.build > 0 ? ((net - v.build) / v.build) * 100 : 0;
    const hours = v.people * v.hours * (v.automatable / 100) * 52;
    return [
      { label: "Estimated annual savings", value: "$" + Math.round(savings).toLocaleString() },
      { label: "Automatable hours / year", value: Math.round(hours).toLocaleString() },
      { label: "First-year ROI", value: Math.round(roi).toLocaleString() + "%" },
    ];
  }
  if (slug === "productivity-calculator") {
    const annual = v.team * v.waste * 52 * v.rate;
    const hours = v.team * v.waste * 52;
    return [
      { label: "Annual cost of manual work", value: "$" + Math.round(annual).toLocaleString() },
      { label: "Hours lost / year", value: Math.round(hours).toLocaleString() },
      { label: "Equivalent full-time people", value: (hours / 2000).toFixed(1) },
    ];
  }
  if (slug === "project-estimator") {
    const complexity = v.pages + ((100 - v.content) / 100) * v.pages * 0.5 + v.integrations * 3 + (v.languages - 1) * 4;
    const score = Math.min(10, Math.max(1, Math.round(complexity / 4)));
    const weeks = score <= 2 ? "2–3" : score <= 4 ? "3–6" : score <= 7 ? "6–10" : "10–16";
    const tier = score <= 3 ? "Starter" : score <= 6 ? "Launch" : score <= 8 ? "Growth" : "Transform";
    return [
      { label: "Complexity score", value: score + "/10" },
      { label: "Indicative timeline", value: weeks + " weeks" },
      { label: "Suggested package", value: tier },
    ];
  }
  // content-calculator
  const base = v.articles * 8 + v.social * 1.5 + v.decks * 6;
  const efficiency = 1 - v.repurpose * 0.06;
  const hours = base * 52 * 0 + base * efficiency; // monthly hours
  return [
    { label: "Monthly effort", value: Math.round(hours) + " h" },
    { label: "Ad-hoc freelance cost", value: "$" + Math.round(hours * 45).toLocaleString() + "/mo" },
    { label: "As a Flagship retainer", value: "from $1,900/mo" },
  ];
}

export default function CalculatorTool({ locale, dict, config }: { locale: Locale; dict: Dict; config: CalculatorConfig }) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.key, f.def]))
  );

  const results = useMemo(() => compute(config.slug, values), [config.slug, values]);

  useEffect(() => {
    track("calculator_use", { tool: config.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-line bg-coal p-6 sm:p-8">
        <Badge accent>{dict.tools.calc}</Badge>
        <div className="mt-6 space-y-7">
          {config.fields.map((f) => (
            <div key={f.key}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <label htmlFor={f.key} className="font-display text-sm font-semibold">{f.label}</label>
                <span className="rounded-md border border-line bg-carbon px-2.5 py-1 font-mono text-sm text-accent">
                  {f.unit === "$" ? "$" : ""}{values[f.key].toLocaleString()}{f.unit && f.unit !== "$" ? f.unit : ""}
                </span>
              </div>
              {f.type === "range" ? (
                <input
                  id={f.key}
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={values[f.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))}
                />
              ) : (
                <input
                  id={f.key}
                  type="number"
                  min={f.min}
                  value={values[f.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
                />
              )}
              {f.hint ? <p className="mt-1.5 text-xs text-mute/70">{f.hint}</p> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-accent/30 bg-coal p-6 sm:p-8">
          <p className="kicker">{dict.tools.results}</p>
          <div className="mt-5 space-y-5">
            {results.map((r) => (
              <div key={r.label} className="border-b border-line/60 pb-5 last:border-0 last:pb-0">
                <p className="text-sm text-mute">{r.label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-accent sm:text-4xl">{r.value}</p>
              </div>
            ))}
          </div>
          <MiniCapture dict={dict} cta={dict.common.book} payload={{ tool: config.slug, values }} />
        </div>
        <div className="rounded-2xl border border-line bg-coal p-6">
          <p className="kicker mb-3">How this is calculated</p>
          <p className="font-mono text-xs leading-relaxed text-mute">{config.formulaNote}</p>
          <div className="mt-5">
            <Btn href={localePath(locale, "contact")} variant="ghost">{dict.common.contactUs}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
