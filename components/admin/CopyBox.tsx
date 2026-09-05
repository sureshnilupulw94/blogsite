"use client";

import { useState } from "react";

export default function CopyBox({ label, text, mono = false }: { label: string; text: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable (permissions) — selection still works */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="rounded-2xl border border-line bg-coal p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-mute">{label}</h3>
        <button type="button" onClick={copy} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-mute transition-colors hover:border-accent/50 hover:text-accent">
          {copied ? "copied ✓" : "copy"}
        </button>
      </div>
      <pre className={`mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-paper/90 ${mono ? "font-mono" : ""}`}>{text}</pre>
    </div>
  );
}
