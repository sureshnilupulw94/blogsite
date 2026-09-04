"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { stages } from "@/lib/data/tools";
import { cx, Icon } from "./ui";

export default function TransformationMap({ locale, dict, services, defaultStage = 1 }: { locale: Locale; dict: Dict; services: { slug: string; title: string; icon: string }[]; defaultStage?: number }) {
  const [active, setActive] = useState(defaultStage);
  const stage = stages[active];

  return (
    <div>
      <ol className="flex snap-x gap-2 overflow-x-auto pb-2" aria-label="Transformation stages">
        {stages.map((s, i) => (
          <li key={s.slug} className="snap-start">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active}
              className={cx(
                "flex min-w-28 flex-col gap-1 rounded-xl border px-4 py-3 text-start transition-all",
                i === active ? "border-accent bg-accent/10" : i < active ? "border-accent/25 bg-coal" : "border-line bg-coal hover:border-accent/30"
              )}
            >
              <span className="font-mono text-[10px] tracking-widest text-mute">0{i + 1}</span>
              <span className={cx("font-display text-sm font-semibold", i === active ? "text-accent" : "text-paper")}>{s.name}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl border border-line bg-coal p-6 sm:p-8">
        <p className="kicker">{dict.common.stage} 0{active + 1}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-accent">{stage.name}</h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-mute">{stage.you}</p>
        <div className="mt-6">
          <p className="kicker mb-3">What we do here</p>
          <div className="flex flex-wrap gap-2">
            {stage.we.map((slug) => {
              const s = services.find((x) => x.slug === slug);
              if (!s) return null;
              return (
                <Link
                  key={slug}
                  href={localePath(locale, `services/${slug}`)}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-carbon px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                >
                  <Icon name={s.icon} className="size-4" />
                  {s.title}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          {active > 0 ? (
            <button type="button" onClick={() => setActive(active - 1)} className="rounded-full border border-line px-4 py-2 font-mono text-xs text-mute hover:text-paper">← {stages[active - 1].name}</button>
          ) : null}
          {active < stages.length - 1 ? (
            <button type="button" onClick={() => setActive(active + 1)} className="rounded-full border border-line px-4 py-2 font-mono text-xs text-mute hover:text-paper">{stages[active + 1].name} →</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
