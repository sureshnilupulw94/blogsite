"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { goals } from "@/lib/data/tools";
import { MiniCapture } from "./forms";
import { Badge, cx, Icon } from "./ui";

const materialOpts = ["Brand guidelines", "Existing website", "Company profile", "Presentation materials", "Past reports", "Product information"];
const timelines = ["Yesterday", "This month", "This quarter", "3–6 months", "Exploring for now"];
const budgets = ["< $2k", "$2k – $8k", "$8k – $25k", "$25k+", "Not sure yet"];
const urgencies: [string, string][] = [
  ["standard", "Standard — planned work, no surcharge"],
  ["priority", "Priority — dedicated slot, +25%"],
  ["urgent", "Urgent — jumps the queue, +50%"],
  ["emergency", "Emergency — war-room, custom quote"],
];
const successExamples = ["More inquiries", "Investors convinced", "Team self-sufficient", "Manual work removed", "Look like the company we are"];

type State = {
  goal?: string;
  problem: string;
  materials: string[];
  success: string;
  services: string[];
  timeline?: string;
  urgency?: string;
  budget?: string;
  files: string[];
  name: string;
  email: string;
  company: string;
};

const STEP_LABELS = [
  "What are you trying to accomplish?",
  "What's the problem?",
  "What do you already have?",
  "What would success look like?",
  "Which services might help?",
  "Timeline?",
  "How urgent is it?",
  "Budget?",
  "Upload materials",
  "Review your brief",
  "Submit",
];

export default function BriefBuilder({ locale, dict, services }: { locale: Locale; dict: Dict; services: { slug: string; title: string; short: string }[] }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<State>({ materials: [], services: [], files: [], problem: "", success: "", name: "", email: "", company: "" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("flagship_concierge");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.goal) setState((s) => ({ ...s, goal: parsed.goal }));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (state.goal) {
      try { localStorage.setItem("flagship_concierge", JSON.stringify({ goal: state.goal })); } catch { /* ignore */ }
    }
  }, [state.goal]);

  const toggle = (key: "materials" | "services" | "files", value: string) =>
    setState((s) => ({ ...s, [key]: s[key].includes(value) ? s[key].filter((x) => x !== value) : [...s[key], value] }));

  const goalLabel = goals.find((g) => g.slug === state.goal)?.label ?? "—";

  const briefText = [
    "PROJECT BRIEF — THE FLAGSHIP",
    "",
    `Objective: ${goalLabel}`,
    `Problem: ${state.problem || "—"}`,
    `Success looks like: ${state.success || "—"}`,
    `Existing materials: ${state.materials.join(", ") || "—"}`,
    `Services of interest: ${state.services.map((s) => services.find((x) => x.slug === s)?.title ?? s).join(", ") || "—"}`,
    `Timeline: ${state.timeline ?? "—"}${state.urgency ? ` · urgency: ${state.urgency}` : ""}`,
    `Budget: ${state.budget ?? "—"}`,
    `Files referenced: ${state.files.join(", ") || "—"}`,
    "",
    "Recommended approach: Discovery → Audit → Strategy → Implementation",
  ].join("\n");

  const canNext = () => {
    if (step === 0) return !!state.goal;
    if (step === 1) return state.problem.trim().length > 5;
    return true;
  };

  const chip = (active: boolean) =>
    cx("rounded-full border px-4 py-2 text-xs font-medium transition-all", active ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon text-mute hover:text-paper");

  return (
    <div className="rounded-2xl border border-line bg-coal p-6 sm:p-10">
      <div className="flex items-center justify-between">
        <Badge accent>Project Builder</Badge>
        <span className="font-mono text-xs text-mute">STEP {String(step + 1).padStart(2, "0")} / {STEP_LABELS.length}</span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }} />
      </div>

      <h2 className="mt-8 font-display text-xl font-bold sm:text-2xl">{STEP_LABELS[step]}</h2>

      <div className="mt-6 min-h-40">
        {step === 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {goals.map((g) => (
              <button key={g.slug} type="button" onClick={() => setState((s) => ({ ...s, goal: g.slug }))} className={cx("rounded-xl border p-4 text-start text-sm transition-all", state.goal === g.slug ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon hover:border-accent/40")}>
                {g.label}
              </button>
            ))}
          </div>
        ) : null}

        {step === 1 ? (
          <textarea
            value={state.problem}
            onChange={(e) => setState((s) => ({ ...s, problem: e.target.value }))}
            rows={5}
            placeholder="e.g. We need a new company profile and website — ours is 4 years old and embarrassing."
            className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm leading-relaxed focus:border-accent/60 focus:outline-none"
          />
        ) : null}

        {step === 2 ? (
          <div className="flex flex-wrap gap-2">
            {materialOpts.map((m) => (
              <button key={m} type="button" onClick={() => toggle("materials", m)} aria-pressed={state.materials.includes(m)} className={chip(state.materials.includes(m))}>{m}</button>
            ))}
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {successExamples.map((ex) => (
                <button key={ex} type="button" onClick={() => setState((s) => ({ ...s, success: s.success ? s.success + "; " + ex : ex }))} className={chip(false)}>+ {ex}</button>
              ))}
            </div>
            <input
              value={state.success}
              onChange={(e) => setState((s) => ({ ...s, success: e.target.value }))}
              placeholder="Describe what success looks like…"
              className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((s) => (
              <button key={s.slug} type="button" onClick={() => toggle("services", s.slug)} aria-pressed={state.services.includes(s.slug)} className={cx("rounded-xl border p-4 text-start transition-all", state.services.includes(s.slug) ? "border-accent bg-accent/10" : "border-line bg-carbon hover:border-accent/40")}>
                <span className={cx("font-display text-sm font-semibold", state.services.includes(s.slug) && "text-accent")}>{s.title}</span>
              </button>
            ))}
          </div>
        ) : null}

        {step === 5 ? (
          <div className="flex flex-wrap gap-2">
            {timelines.map((t) => (
              <button key={t} type="button" onClick={() => setState((s) => ({ ...s, timeline: t }))} className={chip(state.timeline === t)}>{t}</button>
            ))}
          </div>
        ) : null}

        {step === 6 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {urgencies.map(([id, label]) => (
              <button key={id} type="button" onClick={() => setState((s) => ({ ...s, urgency: id }))} className={cx("rounded-xl border p-4 text-start text-sm transition-all", state.urgency === id ? "border-accent bg-accent/10 text-accent" : "border-line bg-carbon hover:border-accent/40")}>
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {step === 7 ? (
          <div className="flex flex-wrap gap-2">
            {budgets.map((b) => (
              <button key={b} type="button" onClick={() => setState((s) => ({ ...s, budget: b }))} className={chip(state.budget === b)}>{b}</button>
            ))}
          </div>
        ) : null}

        {step === 8 ? (
          <div>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-carbon/60 px-6 py-10 text-center transition-colors hover:border-accent/50">
              <Icon name="doc" className="size-8 text-mute" />
              <span className="font-display text-sm font-semibold">Attach materials <span className="text-mute">({dict.common.optional})</span></span>
              <span className="text-xs text-mute/70">PDF, presentations, documents, screenshots — file names are noted in the brief; you'll share the actual files after we respond.</span>
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const names = Array.from(e.target.files ?? []).map((f) => f.name);
                  setState((s) => ({ ...s, files: names }));
                }}
              />
            </label>
            {state.files.length ? (
              <p className="mt-3 font-mono text-xs text-accent">{state.files.length} file(s): {state.files.join(", ")}</p>
            ) : null}
          </div>
        ) : null}

        {step === 9 ? (
          <div>
            <pre className="max-h-80 overflow-auto rounded-xl border border-line bg-ink p-5 font-mono text-xs leading-relaxed text-paper/90">{briefText}</pre>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(briefText); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="mt-3 rounded-full border border-line px-5 py-2 font-mono text-xs text-mute hover:text-paper"
            >
              {copied ? dict.common.copied : dict.common.copy}
            </button>
          </div>
        ) : null}

        {step === 10 ? (
          <div>
            <p className="text-sm leading-relaxed text-mute">Your brief is ready. Send it — we respond within one working day with questions, a suggested approach, or a call slot.</p>
            <MiniCapture dict={dict} cta={dict.tools.sendToTeam} payload={{ type: "brief", goal: goalLabel, problem: state.problem, success: state.success, materials: state.materials.join(", "), services: state.services.join(", "), timeline: state.timeline, urgency: state.urgency, budget: state.budget, files: state.files.join(", "), brief: briefText }} />
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line/60 pt-6">
        <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="font-mono text-xs text-mute hover:text-paper disabled:opacity-40">
          ← {dict.common.back}
        </button>
        {step < 10 ? (
          <button
            type="button"
            disabled={!canNext()}
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            {dict.common.next} <Icon name="arrow" className="size-4" />
          </button>
        ) : (
          <a href={localePath(locale, "discover")} className="font-mono text-xs text-mute hover:text-paper">{dict.common.restart}</a>
        )}
      </div>
    </div>
  );
}
