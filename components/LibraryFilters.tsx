"use client";

import { useState } from "react";
import type { Resource } from "@/lib/data/knowledge";
import { cx } from "./ui";

export default function LibraryFilters({ resources }: { resources: Resource[] }) {
  const formats = ["All", ...Array.from(new Set(resources.map((r) => r.format)))];
  const topics = ["All", ...Array.from(new Set(resources.map((r) => r.topic)))];
  const [format, setFormat] = useState("All");
  const [topic, setTopic] = useState("All");

  const filtered = resources.filter((r) => (format === "All" || r.format === format) && (topic === "All" || r.topic === topic));

  const chip = (active: boolean) =>
    cx("rounded-full border px-4 py-1.5 text-xs font-medium transition-all", active ? "border-accent bg-accent/10 text-accent" : "border-line text-mute hover:text-paper");

  return (
    <div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker w-14">Format</span>
          {formats.map((f) => (
            <button key={f} type="button" onClick={() => setFormat(f)} className={chip(format === f)}>{f}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker w-14">Topic</span>
          {topics.map((t) => (
            <button key={t} type="button" onClick={() => setTopic(t)} className={chip(topic === t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <article key={r.slug} className="card-hover rounded-2xl border border-line bg-coal p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{r.format}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">{r.level}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{r.blurb}</p>
            <p className="mt-4 font-mono text-xs text-mute/70">{r.topic}</p>
          </article>
        ))}
      </div>
      {filtered.length === 0 ? <p className="mt-8 text-sm text-mute">No matches — try another combination.</p> : null}
    </div>
  );
}
