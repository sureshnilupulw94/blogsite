"use client";

import { useState, type FormEvent } from "react";

type Result = { passages: { title: string; snippet: string }[]; answer: string | null; engine: string };

export default function BrainPanel() {
  const [q, setQ] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "empty" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);

  async function ask(e: FormEvent) {
    e.preventDefault();
    if (q.trim().length < 3) return;
    setState("loading");
    try {
      const res = await fetch("/api/portal/brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
      });
      const data = await res.json();
      if (!data.ok) {
        setState("error");
        return;
      }
      setResult(data as Result);
      setState(data.passages.length ? "done" : "empty");
    } catch {
      setState("error");
    }
  }

  const examples = ["What is our tagline?", "Which words are banned?", "What are the brand colours?", "Company facts for a proposal"];

  return (
    <div>
      <form onSubmit={ask} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask the Brand Brain — voice, colours, facts, rules…"
          className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
        />
        <button type="submit" disabled={state === "loading"} className="whitespace-nowrap rounded-full bg-accent px-7 py-3 font-display text-sm font-semibold text-accent-ink disabled:opacity-60">
          {state === "loading" ? "Thinking…" : "Ask"}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button key={ex} type="button" onClick={() => setQ(ex)} className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] text-mute hover:text-paper">
            {ex}
          </button>
        ))}
      </div>

      {state === "error" ? <p className="mt-4 text-sm text-red-300">Something went wrong — try again.</p> : null}

      {state === "empty" ? (
        <p className="mt-6 rounded-xl border border-line bg-coal p-5 text-sm text-mute">
          Nothing in the Brain matches that yet. Add knowledge below — the more you feed it, the smarter every future project gets.
        </p>
      ) : null}

      {state === "done" && result ? (
        <div className="mt-6 space-y-4">
          {result.answer ? (
            <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
              <p className="kicker mb-2 text-accent">Answer · {result.engine}</p>
              <p className="text-sm leading-relaxed text-paper">{result.answer}</p>
            </div>
          ) : null}
          <div>
            <p className="kicker mb-3">Matching passages {result.answer ? "(sources)" : ""}</p>
            <ul className="space-y-3">
              {result.passages.map((p, i) => (
                <li key={i} className="rounded-xl border border-line bg-coal p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{p.snippet}…</p>
                </li>
              ))}
            </ul>
            {!result.answer ? (
              <p className="mt-3 font-mono text-[11px] text-mute/70">Retrieval mode — set an LLM key (see .env.example) for direct answers grounded in these passages.</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
