"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { DocPage, PortalComment } from "@/lib/portal";
import { addFeedback, resolveFeedback } from "@/app/portal/actions";
import { cx } from "@/components/ui";

export type ViewComment = PortalComment & { mine: boolean };

function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cx(className, pending && "opacity-60")}>
      {pending ? "Saving…" : children}
    </button>
  );
}

export default function DocumentViewer({
  deliverableId,
  title,
  pages,
  comments,
}: {
  deliverableId: string;
  title: string;
  pages: DocPage[];
  comments: ViewComment[];
}) {
  const [draft, setDraft] = useState<{ page: number; x: number; y: number } | null>(null);
  const [openPin, setOpenPin] = useState<string | null>(null);

  const open = comments.filter((c) => !c.resolved);
  const resolved = comments.filter((c) => c.resolved);

  function onPageClick(e: React.MouseEvent<HTMLDivElement>, page: number) {
    if ((e.target as HTMLElement).closest("[data-pin]")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    setOpenPin(null);
    setDraft({ page, x, y });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* document */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="kicker">{pages.length} pages · click anywhere to pin a note</p>
          <p className="font-mono text-xs text-accent">{open.length} open</p>
        </div>
        <div className="space-y-6">
          {pages.map((page) => {
            const pins = comments.filter((c) => c.page === page.n);
            return (
              <div key={page.n} className="relative">
                <div
                  role="presentation"
                  onClick={(e) => onPageClick(e, page.n)}
                  className="aspect-[210/280] cursor-crosshair overflow-hidden rounded-lg bg-paper p-7 text-ink shadow-2xl sm:p-10"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Acme Logistics · v03 · page {page.n}</p>
                  {page.n === 1 ? (
                    <div className="flex h-[80%] flex-col items-center justify-center text-center">
                      <p className="font-display text-3xl font-bold tracking-tight">{page.title}</p>
                      <p className="mt-3 text-sm text-ink/60">{page.body[0]}</p>
                      <p className="mt-1 font-display text-lg font-semibold" style={{ color: "#0E7C66" }}>{page.body[1]}</p>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <h3 className="font-display text-2xl font-bold" style={{ color: "#0E7C66" }}>{page.title}</h3>
                      <div className="mt-4 space-y-3">
                        {page.body.map((para, i) => (
                          <p key={i} className="text-[13px] leading-relaxed text-ink/80">{para}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {pins.map((c) => {
                  const idx = pins.indexOf(c) + 1;
                  return (
                    <button
                      key={c.id}
                      data-pin
                      type="button"
                      onClick={() => { setOpenPin(openPin === c.id ? null : c.id); setDraft(null); }}
                      aria-label={`Note ${idx} on page ${page.n}: ${c.message}`}
                      className={cx(
                        "absolute z-10 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-[11px] font-bold shadow-lg transition-transform hover:scale-110",
                        c.resolved ? "bg-ink/70 text-paper" : "bg-accent text-accent-ink"
                      )}
                      style={{ left: `${c.x ?? 50}%`, top: `${c.y ?? 50}%` }}
                    >
                      {idx}
                    </button>
                  );
                })}
                {openPin && pins.find((p) => p.id === openPin) ? (
                  <div className="absolute z-20 w-64 -translate-x-1/2 rounded-xl border border-line bg-ink p-4 shadow-2xl" style={{ left: `${pins.find((p) => p.id === openPin)!.x ?? 50}%`, top: `calc(${pins.find((p) => p.id === openPin)!.y ?? 50}% + 20px)` }}>
                    <p className="text-xs leading-relaxed text-paper">{pins.find((p) => p.id === openPin)!.message}</p>
                    <p className="mt-2 font-mono text-[10px] text-mute">{pins.find((p) => p.id === openPin)!.mine ? "you" : pins.find((p) => p.id === openPin)!.author} · {pins.find((p) => p.id === openPin)!.resolved ? "resolved" : "open"}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* side panel */}
      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        {draft ? (
          <form action={addFeedback} className="rounded-2xl border border-accent/50 bg-accent/5 p-5">
            <p className="kicker text-accent">New note — page {draft.page} · {Math.round(draft.x)}% / {Math.round(draft.y)}%</p>
            <input type="hidden" name="deliverableId" value={deliverableId} />
            <input type="hidden" name="page" value={draft.page} />
            <input type="hidden" name="x" value={draft.x} />
            <input type="hidden" name="y" value={draft.y} />
            <textarea
              name="message"
              required
              rows={3}
              autoFocus
              placeholder="What should change here?"
              className="mt-3 w-full rounded-xl border border-line bg-carbon px-3.5 py-2.5 text-sm focus:border-accent/60 focus:outline-none"
            />
            <div className="mt-3 flex gap-2">
              <SubmitButton className="rounded-full bg-accent px-5 py-2 font-display text-xs font-semibold text-accent-ink">Add note</SubmitButton>
              <button type="button" onClick={() => setDraft(null)} className="rounded-full border border-line px-4 py-2 font-mono text-xs text-mute hover:text-paper">Cancel</button>
            </div>
          </form>
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-coal/60 p-5 text-xs leading-relaxed text-mute">
            Reviewing <span className="text-paper">{title}</span>. Click anywhere on a page to pin a note exactly where it applies — no more “page 17, third paragraph, maybe?” emails.
          </p>
        )}

        <section className="rounded-2xl border border-line bg-coal p-5">
          <p className="kicker mb-3">Open notes ({open.length})</p>
          <ul className="space-y-3">
            {open.length ? open.map((c) => (
              <li key={c.id} className="rounded-xl border border-line/60 bg-carbon p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{c.page ? `page ${c.page}` : "general"} · {c.mine ? "you" : c.author}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-paper">{c.message}</p>
                <form action={resolveFeedback} className="mt-3">
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="deliverableId" value={deliverableId} />
                  <SubmitButton className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] text-mute hover:text-paper">Resolve</SubmitButton>
                </form>
              </li>
            )) : <li className="text-sm text-mute">Nothing open — clean review.</li>}
          </ul>
        </section>

        {resolved.length ? (
          <section className="rounded-2xl border border-line bg-coal p-5">
            <p className="kicker mb-3">Resolved ({resolved.length})</p>
            <ul className="space-y-2.5">
              {resolved.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 rounded-xl border border-line/60 bg-carbon p-3.5">
                  <div>
                    <p className="font-mono text-[10px] text-mute">{c.page ? `page ${c.page}` : "general"}</p>
                    <p className="mt-1 text-xs leading-relaxed text-mute line-through decoration-mute/50">{c.message}</p>
                  </div>
                  <form action={resolveFeedback}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="deliverableId" value={deliverableId} />
                    <SubmitButton className="font-mono text-[10px] text-mute hover:text-paper">Reopen</SubmitButton>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </aside>
    </div>
  );
}
