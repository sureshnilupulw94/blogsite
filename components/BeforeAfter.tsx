"use client";

import { useCallback, useRef, useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { cx } from "./ui";

export default function BeforeAfter({ dict, before, after, beforeTitle, afterTitle }: { dict: Dict; before: string[]; after: string[]; beforeTitle?: string; afterTitle?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) update(e.clientX);
  };
  const stop = () => {
    dragging.current = false;
  };

  const Slider = (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl border border-line bg-carbon/70 p-4 sm:p-6">
          <p className="kicker mb-3">{dict.common.before}</p>
          <ul className="space-y-2">
            {before.map((b) => (
              <li key={b} className="font-mono text-[11px] leading-relaxed text-mute sm:text-xs"><span className="text-red-400/80">✕</span> {b}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-accent/40 bg-accent/5 p-4 sm:p-6">
          <p className="kicker mb-3 text-accent">{dict.common.after}</p>
          <ul className="space-y-2">
            {after.map((a) => (
              <li key={a} className="font-mono text-[11px] leading-relaxed text-paper sm:text-xs"><span className="text-accent">✓</span> {a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl border border-line select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
      >
        {Slider}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden="true">
          <div className="h-full w-px bg-accent/90" />
        </div>
        <div
          className="ba-handle pointer-events-auto absolute top-1/2 z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-accent bg-ink text-accent shadow-lg"
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-label={`${dict.common.before} / ${dict.common.after}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
            if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
          }}
        >
          <span className="font-mono text-xs">↔</span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-ink/40 to-transparent" />
      </div>
      <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-widest text-mute">
        <span>{beforeTitle ?? dict.common.before}</span>
        <span>{afterTitle ?? dict.common.after}</span>
      </div>
      <label className="mt-2 sr-only" htmlFor="ba-range">{dict.common.before} / {dict.common.after}</label>
      <input id="ba-range" type="range" min={4} max={96} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="mt-2" />
    </div>
  );
}
