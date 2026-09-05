"use client";

import Link from "next/link";
import { useState } from "react";
import type { Pack } from "@/lib/data/packages";
import { subscription } from "@/lib/data/packages";
import { Badge, CheckList, cx } from "./ui";

const CURRENCIES = {
  USD: { rate: 1, symbol: "$", label: "USD" },
  LKR: { rate: 300, symbol: "LKR ", label: "LKR" },
  GBP: { rate: 0.79, symbol: "£", label: "GBP" },
  EUR: { rate: 0.92, symbol: "€", label: "EUR" },
} as const;

type Code = keyof typeof CURRENCIES;

function fmt(usd: number, code: Code) {
  const { rate, symbol } = CURRENCIES[code];
  const value = usd * rate;
  const rounded = code === "LKR" ? Math.round(value / 500) * 500 : Math.round(value / 50) * 50;
  return symbol + rounded.toLocaleString();
}

export default function PackagesGrid({ locale, dict, packages, startLabel }: { locale: string; dict: { common: { start: string } }; packages: Pack[]; startLabel: string }) {
  const [code, setCode] = useState<Code>("USD");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="kicker">Currency</span>
        {(Object.keys(CURRENCIES) as Code[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCode(c)}
            aria-pressed={code === c}
            className={cx("rounded-full border px-4 py-1.5 font-mono text-xs", code === c ? "border-accent bg-accent/10 text-accent" : "border-line text-mute hover:text-paper")}
          >
            {CURRENCIES[c].label}
          </button>
        ))}
        <span className="font-mono text-[10px] text-mute/60">indicative conversion</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pack) => (
          <div key={pack.slug} className={cx("card-hover flex h-full flex-col rounded-2xl border bg-coal p-6", pack.featured && "border-accent/50")}>
            <div className="flex items-center justify-between">
              {pack.featured ? <Badge accent>Most chosen</Badge> : <Badge>{pack.name}</Badge>}
              <span className="font-mono text-[10px] text-mute">{pack.timeline}</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">{pack.name}</h2>
            <p className="mt-1 text-xs text-mute">{pack.for}</p>
            <p className="mt-4 font-mono text-lg text-accent">
              {pack.usd ? <>from {fmt(pack.usd, code)}</> : "Custom"}
            </p>
            <div className="mt-5 flex-1"><CheckList items={pack.includes} /></div>
            <Link
              href={`/${locale}/contact`}
              className={cx(
                "mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 font-display text-sm font-semibold transition-transform hover:-translate-y-0.5",
                pack.featured ? "bg-accent text-accent-ink" : "border border-line text-paper hover:border-accent/50"
              )}
            >
              {startLabel}
            </Link>
          </div>
        ))}

        <div className="card-hover flex h-full flex-col rounded-2xl border border-accent/40 bg-accent/5 p-6">
          <Badge accent>Subscription</Badge>
          <h2 className="mt-4 font-display text-2xl font-bold">{subscription.name}</h2>
          <p className="mt-1 text-xs text-mute">{subscription.pitch}</p>
          <p className="mt-4 font-mono text-lg text-accent">from {fmt(subscription.usdMonthly ?? 4500, code)}/mo</p>
          <div className="mt-5 flex-1"><CheckList items={subscription.points} /></div>
          <Link href={`/${locale}/contact`} className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5">
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  );
}
