"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { goals } from "@/lib/data/tools";
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
            onClick={() => setActive(g.slug)}
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

/* ---------- AI Concierge (rule-based guided interview) ---------- */

type Answers = { goal?: string; blocker?: string; materials: string[]; deadline?: string; budget?: string };

const blockers = [
  ["time", "No time — the team is at capacity"],
  ["clarity", "We're not sure what the right approach is"],
  ["skills", "We don't have the skills in-house"],
  ["quality", "What we produce isn't good enough"],
  ["chaos", "Our processes are a mess"],
  ["nothing", "Nothing — we just need it done"],
];

const materialOpts = ["Brand guidelines", "Existing website", "Company profile", "Presentation materials", "Past reports", "Product information"];

const deadlines = ["Yesterday", "This month", "This quarter", "3–6 months", "Exploring for now"];
const budgets = ["< $2k", "$2k – $8k", "$8k – $25k", "$25k+", "Not sure yet"];

export function Concierge({ locale, dict, services }: { locale: Locale; dict: Dict; services: ServiceLite[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ materials: [] });

  const done = step > 4;
  const goalSlug = goals.find((g) => g.slug === answers.goal)?.services ?? ["strategy"];
  const primary = services.find((s) => s.slug === goalSlug[0]) ?? services[0];
  const supporting = goalSlug.slice(1).map((s) => services.find((x) => x.slug === s)).filter(Boolean) as ServiceLite[];

  const toggleMaterial = (m: string) =>
    setAnswers((a) => ({ ...a, materials: a.materials.includes(m) ? a.materials.filter((x) => x !== m) : [...a.materials, m] }));

  if (done) {
    const payload = { goal: answers.goal, blocker: answers.blocker, materials: answers.materials.join(", "), deadline: answers.deadline, budget: answers.budget };
    return (
      <div className="rounded-2xl border border-line bg-coal p-6 sm:p-10">
        <Badge accent>{dict.tools.results}</Badge>
        <h3 className="mt-4 font-display text-2xl font-bold">Your recommended approach</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-accent/40 bg-carbon p-5">
            <p className="kicker">Primary service</p>
            <Link href={localePath(locale, `services/${primary.slug}`)} className="mt-2 block font-display text-xl font-bold text-accent hover:underline">
              {primary.title}
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-mute">{primary.summary}</p>
          </div>
          <div className="rounded-xl border border-line bg-carbon p-5">
            <p className="kicker">Supporting services</p>
            <ul className="mt-2 space-y-2">
              {supporting.map((s) => (
                <li key={s.slug}>
                  <Link href={localePath(locale, `services/${s.slug}`)} className="font-display text-sm font-semibold hover:text-accent">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-carbon p-5 md:col-span-2">
            <p className="kicker">Suggested project phases</p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-4">
              {["Discovery", "Audit", "Strategy", "Implementation"].map((phase, i) => (
                <li key={phase} className="rounded-lg border border-line/60 bg-coal p-3">
                  <span className="font-mono text-[10px] text-accent">0{i + 1}</span>
                  <span className="mt-1 block font-display text-sm font-semibold">{phase}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Btn href={localePath(locale, "tools/brief-builder")}>Turn this into a project brief</Btn>
          <button type="button" onClick={() => { setAnswers({ materials: [] }); setStep(0); }} className="rounded-full border border-line px-6 py-3 font-display text-sm font-semibold hover:border-accent/50">
            {dict.common.restart}
          </button>
        </div>
        <p className="mt-4 font-mono text-[11px] text-mute/70">{JSON.stringify(payload)}</p>
      </div>
    );
  }

  const steps = [
    {
      title: "What are you trying to accomplish?",
      body: (
        <div className="grid gap-2 sm:grid-cols-2">
          {goals.map((g) => (
            <button key={g.slug} type="button" onClick={() => { setAnswers((a) => ({ ...a, goal: g.slug })); setStep(1); }}
              className={cx("rounded-xl border p-4 text-start text-sm font-medium transition-all", answers.goal === g.slug ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon text-paper hover:border-accent/40")}>
              {g.label}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's currently stopping you?",
      body: (
        <div className="grid gap-2 sm:grid-cols-2">
          {blockers.map(([id, label]) => (
            <button key={id} type="button" onClick={() => { setAnswers((a) => ({ ...a, blocker: id })); setStep(2); }}
              className={cx("rounded-xl border p-4 text-start text-sm transition-all", answers.blocker === id ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon text-paper hover:border-accent/40")}>
              {label}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Do you already have materials?",
      body: (
        <div>
          <div className="flex flex-wrap gap-2">
            {materialOpts.map((m) => (
              <button key={m} type="button" onClick={() => toggleMaterial(m)} aria-pressed={answers.materials.includes(m)}
                className={cx("rounded-full border px-4 py-2 text-xs font-medium transition-all", answers.materials.includes(m) ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon text-mute hover:text-paper")}>
                {m}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "What's your deadline?",
      body: (
        <div className="flex flex-wrap gap-2">
          {deadlines.map((d) => (
            <button key={d} type="button" onClick={() => { setAnswers((a) => ({ ...a, deadline: d })); setStep(4); }}
              className={cx("rounded-full border px-5 py-2.5 text-sm transition-all", answers.deadline === d ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon text-paper hover:border-accent/40")}>
              {d}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your approximate budget?",
      body: (
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button key={b} type="button" onClick={() => { setAnswers((a) => ({ ...a, budget: b })); setStep(5); }}
              className={cx("rounded-full border px-5 py-2.5 text-sm transition-all", answers.budget === b ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon text-paper hover:border-accent/40")}>
              {b}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="rounded-2xl border border-line bg-coal p-6 sm:p-10">
      <div className="flex items-center justify-between">
        <Badge>AI Concierge</Badge>
        <span className="font-mono text-xs text-mute">{step + 1} / {steps.length}</span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <h3 className="mt-6 font-display text-xl font-bold sm:text-2xl">{current.title}</h3>
      <div className="mt-6">{current.body}</div>
      {step === 2 ? (
        <button type="button" onClick={() => setStep(3)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">
          {dict.common.next} <Icon name="arrow" className="size-4" />
        </button>
      ) : null}
      {step > 0 ? (
        <button type="button" onClick={() => setStep(step - 1)} className="mt-6 block font-mono text-xs text-mute hover:text-paper">
          ← {dict.common.back}
        </button>
      ) : null}
    </div>
  );
}
