"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { goals } from "@/lib/data/tools";
import { track } from "@/lib/analytics";
import { Icon, Badge, Btn, cx } from "./ui";

export type ServiceLite = { slug: string; title: string; short: string; icon: string; summary: string };

export function DiscoveryWidget({ locale, dict, services, compact }: { locale: Locale; dict: Dict; services: ServiceLite[]; compact?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const goal = goals.find((g) => g.slug === active);
  const recs = goal ? goal.services.map((s) => services.find((x) => x.slug === s)).filter(Boolean) as ServiceLite[] : [];

  return (
    <div>
      <div className={cx("grid gap-3", compact ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3")}>
        {goals.map((g) => (
          <button
            key={g.slug}
            type="button"
            onClick={() => { setActive(g.slug); track("discovery_goal", { goal: g.slug, source: "widget" }); }}
            aria-pressed={active === g.slug}
            className={cx(
              "rounded-2xl border p-4 text-start transition-all sm:p-5",
              active === g.slug
                ? "border-accent bg-accent/10"
                : "border-line bg-coal hover:border-accent/40 hover:-translate-y-0.5"
            )}
          >
            <span className={cx("font-display text-sm font-semibold sm:text-base", active === g.slug ? "text-accent" : "text-paper")}>{g.label}</span>
            <span className="mt-1 block text-xs leading-relaxed text-mute">{g.sub}</span>
          </button>
        ))}
      </div>

      {goal ? (
        <div className="mt-6 rounded-2xl border border-accent/30 bg-carbon/60 p-6 sm:p-8">
          <Badge accent>{dict.home.recommended}</Badge>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {recs.map((s, i) => (
              <Link
                key={s.slug}
                href={localePath(locale, `services/${s.slug}`)}
                className="group rounded-xl border border-line bg-coal p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className="flex items-center justify-between">
                  <span className={i === 0 ? "text-accent" : "text-mute"}><Icon name={s.icon} /></span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-mute">{i === 0 ? "PRIMARY" : "SUPPORT"}</span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold group-hover:text-accent">{s.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-mute">{s.summary}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Btn href={localePath(locale, `tools/brief-builder`)}>{dict.common.start}</Btn>
            <Btn href={localePath(locale, "discover")} variant="ghost">{dict.common.explore} · {dict.nav.discover}</Btn>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-mute">{dict.common.notSure}</p>
      )}
    </div>
  );
}
