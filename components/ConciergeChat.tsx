"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { goals } from "@/lib/data/tools";
import { track } from "@/lib/analytics";
import type { Recommendation } from "@/lib/concierge/engine";
import { MiniCapture } from "./forms";
import { Badge, Btn, Icon, cx } from "./ui";

type Msg =
  | { role: "bot"; text: string }
  | { role: "user"; text: string }
  | { role: "bot"; card: Recommendation };

const blockers = [
  ["time", "No time — the team is at capacity"],
  ["clarity", "Not sure what the right approach is"],
  ["skills", "We don't have the skills in-house"],
  ["quality", "What we produce isn't good enough"],
  ["chaos", "Our processes are a mess"],
  ["nothing", "Nothing — we just need it done"],
];
const materials = ["Brand guidelines", "Existing website", "Company profile", "Presentation materials", "Past reports", "Product information"];
const deadlines = ["Yesterday", "This month", "This quarter", "3–6 months", "Exploring for now"];
const budgets = ["< $2k", "$2k – $8k", "$8k – $25k", "$25k+", "Not sure yet"];

const STEPS = ["goal", "blocker", "materials", "deadline", "budget", "freeform"] as const;
type Step = (typeof STEPS)[number];

export default function ConciergeChat({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi — I'm the Flagship concierge. Five quick questions and I'll recommend an approach. What are you trying to accomplish?" },
  ]);
  const [step, setStep] = useState<Step>("goal");
  const [input, setInput] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function analyze(extra?: string) {
    setTyping(true);
    setMessages((m) => [...m, { role: "bot", text: "Analysing your answers…" }]);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, freeform: extra ?? input.freeform }),
      });
      const data = await res.json();
      const recommendation = data.recommendation as Recommendation;
      await new Promise((r) => setTimeout(r, 600)); // let the typing state breathe
      setMessages((m) => [...m, { role: "bot", card: recommendation }]);
      track("concierge_complete", { primary: recommendation.primaryService, engine: recommendation.engine });
      try {
        localStorage.setItem("flagship_concierge", JSON.stringify({ goal: input.goal }));
      } catch { /* ignore */ }
    } catch {
      setMessages((m) => [...m, { role: "bot", text: dict.common.error }]);
    } finally {
      setTyping(false);
    }
  }

  function pushUser(text: string) {
    setMessages((m) => [...m, { role: "user", text }]);
  }

  function nextStep(from: Step, value?: string) {
    const idx = STEPS.indexOf(from);
    const next = STEPS[idx + 1];
    const updated = value ? { ...input, [from]: value } : input;
    setInput(updated);
    if (from === "freeform" || next === undefined) {
      void analyze(from === "freeform" ? draft : undefined);
      return;
    }
    setStep(next);
    const prompts: Record<Step, string> = {
      goal: "",
      blocker: "What's currently stopping you?",
      materials: "Do you already have materials we can work from?",
      deadline: "When does this need to ship?",
      budget: "What's your approximate budget?",
      freeform: "Last one: anything else I should know? Type freely — or skip.",
    };
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "bot", text: prompts[next] }]);
    }, 450);
  }

  const chip = (active: boolean) =>
    cx("rounded-full border px-4 py-2 text-xs font-medium transition-all", active ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon text-mute hover:text-paper");

  const finished = messages.some((m) => "card" in m);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-coal">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <Badge accent>AI Concierge</Badge>
        <span className="font-mono text-[10px] text-mute">{finished ? "analysis ready" : `question ${STEPS.indexOf(step) + 1} / ${STEPS.length + 1}`}</span>
      </div>

      <div ref={scrollRef} className="max-h-[30rem] space-y-4 overflow-y-auto px-6 py-6">
        {messages.map((m, i) =>
          "card" in m ? (
            <RecommendationCard key={i} locale={locale} dict={dict} rec={m.card} />
          ) : (
            <div key={i} className={cx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <p className={cx(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user" ? "bg-accent text-accent-ink" : "border border-line bg-carbon text-paper"
              )}>
                {m.text}
              </p>
            </div>
          )
        )}
        {typing ? (
          <div className="flex justify-start">
            <p className="rounded-2xl border border-line bg-carbon px-4 py-2.5">
              <span className="inline-flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 animate-pulse rounded-full bg-accent" style={{ animationDelay: `${d * 150}ms` }} />
                ))}
              </span>
            </p>
          </div>
        ) : null}
      </div>

      {!finished ? (
        <div className="border-t border-line px-6 py-5">
          {step === "goal" ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {goals.map((g) => (
                <button key={g.slug} type="button" onClick={() => { pushUser(g.label); track("discovery_goal", { goal: g.slug, source: "concierge" }); nextStep("goal", g.slug); }}
                  className="rounded-xl border border-line bg-carbon p-3.5 text-start text-sm transition-all hover:border-accent/40">
                  {g.label}
                </button>
              ))}
            </div>
          ) : null}

          {step === "blocker" ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {blockers.map(([id, label]) => (
                <button key={id} type="button" onClick={() => { pushUser(label); nextStep("blocker", id); }}
                  className="rounded-xl border border-line bg-carbon p-3.5 text-start text-sm transition-all hover:border-accent/40">
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {step === "materials" ? (
            <div>
              <div className="flex flex-wrap gap-2">
                {materials.map((m) => (
                  <button key={m} type="button" aria-pressed={selected.includes(m)} onClick={() => setSelected((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]))} className={chip(selected.includes(m))}>
                    {m}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => { pushUser(selected.length ? selected.join(", ") : "None yet"); nextStep("materials"); setInput((v) => ({ ...v, materials: selected.join(", ") })); }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-display text-sm font-semibold text-accent-ink">
                {dict.common.next} <Icon name="arrow" className="size-4" />
              </button>
            </div>
          ) : null}

          {step === "deadline" ? (
            <div className="flex flex-wrap gap-2">
              {deadlines.map((d) => (
                <button key={d} type="button" onClick={() => { pushUser(d); nextStep("deadline", d); }} className={chip(false)}>{d}</button>
              ))}
            </div>
          ) : null}

          {step === "budget" ? (
            <div className="flex flex-wrap gap-2">
              {budgets.map((b) => (
                <button key={b} type="button" onClick={() => { pushUser(b); nextStep("budget", b); }} className={chip(false)}>{b}</button>
              ))}
            </div>
          ) : null}

          {step === "freeform" ? (
            <form
              onSubmit={(e) => { e.preventDefault(); if (draft.trim()) pushUser(draft); else pushUser("Nothing else — go ahead"); nextStep("freeform", draft.trim() || undefined); }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. We're a 12-person logistics company, our deck is 43 slides of chaos…"
                className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
              />
              <button type="submit" className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">Analyze</button>
              <button type="button" onClick={() => { pushUser("Skip"); nextStep("freeform"); }} className="rounded-full border border-line px-5 py-3 font-mono text-xs text-mute hover:text-paper">Skip</button>
            </form>
          ) : null}
        </div>
      ) : (
        <div className="border-t border-line px-6 py-5">
          <div className="flex flex-wrap gap-3">
            <Btn href={localePath(locale, "tools/brief-builder")}>Turn this into a project brief</Btn>
            <button type="button" onClick={() => window.location.reload()} className="rounded-full border border-line px-6 py-3 font-display text-sm font-semibold hover:border-accent/50">
              {dict.common.restart}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ locale, dict, rec }: { locale: Locale; dict: Dict; rec: Recommendation }) {
  return (
    <div className="rounded-2xl border border-accent/30 bg-carbon/60 p-5">
      <div className="flex items-center justify-between">
        <Badge accent>Your recommended approach</Badge>
        <span className="font-mono text-[10px] uppercase tracking-widest text-mute">{rec.engine === "llm" ? "AI analysis" : "rules engine"}</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold">{rec.headline}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mute">{rec.rationale}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Link href={localePath(locale, `services/${rec.primaryService}`)} className="rounded-xl border border-accent/40 bg-coal p-4 transition-all hover:-translate-y-0.5">
          <p className="kicker">Primary service</p>
          <p className="mt-1.5 font-display text-sm font-bold text-accent">{rec.primaryService.replace(/-/g, " ")}</p>
        </Link>
        {rec.supportingServices.slice(0, 2).map((s) => (
          <Link key={s} href={localePath(locale, `services/${s}`)} className="rounded-xl border border-line bg-coal p-4 transition-all hover:-translate-y-0.5">
            <p className="kicker">Supporting</p>
            <p className="mt-1.5 font-display text-sm font-semibold">{s.replace(/-/g, " ")}</p>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="kicker mb-2">Phases</p>
          <ol className="space-y-1 text-xs text-mute">
            {rec.phases.map((ph, i) => <li key={ph}><span className="me-1.5 font-mono text-accent">0{i + 1}</span>{ph}</li>)}
          </ol>
        </div>
        <div>
          <p className="kicker mb-2">Watch out for</p>
          <ul className="space-y-1 text-xs text-mute">
            {rec.risks.length ? rec.risks.map((r) => <li key={r}><span className="me-1.5 text-red-400/80">!</span>{r}</li>) : <li>No obvious risks flagged.</li>}
          </ul>
        </div>
        <div>
          <p className="kicker mb-2">Still open</p>
          <ul className="space-y-1 text-xs text-mute">
            {rec.questions.slice(0, 3).map((q) => <li key={q}><span className="me-1.5 text-accent">?</span>{q}</li>)}
          </ul>
        </div>
      </div>

      <p className="mt-4 font-display text-sm font-semibold text-paper">{rec.nextStep}</p>
      <MiniCapture dict={dict} cta={dict.tools.sendToTeam} payload={{ type: "concierge", goal: rec.headline, primary: rec.primaryService, supporting: rec.supportingServices.join(", ") }} />
    </div>
  );
}
