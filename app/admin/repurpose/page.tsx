import { requireAdmin } from "@/lib/admin";
import { episodes } from "@/lib/data/podcast";
import { cases } from "@/lib/data/work";
import { repurpose, type RepurposeSource } from "@/lib/repurpose";
import { repurposeToBoard } from "../actions";
import CopyBox from "@/components/admin/CopyBox";

export const dynamic = "force-dynamic";

export default async function RepurposePage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string; title?: string; who?: string; summary?: string; points?: string }>;
}) {
  await requireAdmin();
  const { src, title, who, summary, points } = await searchParams;

  /* ---- resolve source: catalogue slug or pasted raw ---- */
  let source: RepurposeSource | null = null;
  if (src?.startsWith("ep:") ) {
    const ep = episodes.find((e) => e.slug === src.slice(3));
    if (ep) source = { kind: "podcast", title: `EP ${String(ep.number).padStart(3, "0")}: ${ep.title}`, who: `${ep.guest} — ${ep.role}`, summary: ep.teaser, points: [ep.quote, ...ep.showNotes].slice(0, 5) };
  } else if (src?.startsWith("case:")) {
    const c = cases.find((x) => x.slug === src.slice(5));
    if (c) source = { kind: "case", title: c.client, who: c.industry, summary: c.challenge, points: c.lessons.slice(0, 4) };
  } else if (title && summary) {
    source = {
      kind: "article",
      title: title.slice(0, 160),
      who: who?.slice(0, 120) || undefined,
      summary: summary.slice(0, 600),
      points: (points ?? "").split("\n").map((p) => p.trim()).filter(Boolean).slice(0, 5),
    };
  }

  const out = source ? await repurpose(source) : null;

  return (
    <div>
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio OS · content factory</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Repurposing engine</h1>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          One source, every channel. Pick a published episode or case, or paste a raw idea — the engine drafts the LinkedIn post, the thread, the newsletter blurb and the SEO pair. Deterministic by default; polishes with the LLM when a key is set.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* ---- source picker ---- */}
        <aside className="space-y-4">
          <form method="GET" className="rounded-2xl border border-line bg-coal p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Catalogue</p>
            <div className="mt-3 space-y-1.5">
              {episodes.slice(0, 4).map((ep) => (
                <a key={ep.slug} href={`/admin/repurpose?src=ep:${ep.slug}`} className={`block rounded-lg border px-3 py-2 text-xs transition-colors hover:border-accent/40 ${src === `ep:${ep.slug}` ? "border-accent/50 text-accent" : "border-line/60 text-mute"}`}>
                  EP {String(ep.number).padStart(3, "0")} · {ep.title}
                </a>
              ))}
              {cases.slice(0, 3).map((c) => (
                <a key={c.slug} href={`/admin/repurpose?src=case:${c.slug}`} className={`block rounded-lg border px-3 py-2 text-xs transition-colors hover:border-accent/40 ${src === `case:${c.slug}` ? "border-accent/50 text-accent" : "border-line/60 text-mute"}`}>
                  Case · {c.client}
                </a>
              ))}
            </div>
          </form>

          <form method="GET" className="rounded-2xl border border-line bg-coal p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Raw idea</p>
            <input name="title" required defaultValue={title && !src ? title : ""} placeholder="Title *" className="mt-3 w-full rounded-lg border border-line bg-carbon px-3 py-2 text-xs text-paper focus:border-accent/60 focus:outline-none" />
            <input name="who" defaultValue={who ?? ""} placeholder="Who (optional)" className="mt-2 w-full rounded-lg border border-line bg-carbon px-3 py-2 text-xs text-paper focus:border-accent/60 focus:outline-none" />
            <textarea name="summary" required defaultValue={summary && !src ? summary : ""} placeholder="Summary *" rows={3} className="mt-2 w-full rounded-lg border border-line bg-carbon px-3 py-2 text-xs text-paper focus:border-accent/60 focus:outline-none" />
            <textarea name="points" defaultValue={points && !src ? points : ""} placeholder="Takeaways — one per line" rows={4} className="mt-2 w-full rounded-lg border border-line bg-carbon px-3 py-2 text-xs text-paper focus:border-accent/60 focus:outline-none" />
            <button type="submit" className="mt-3 w-full rounded-full bg-accent px-4 py-2 font-display text-xs font-bold text-accent-ink">Repurpose</button>
          </form>
        </aside>

        {/* ---- output ---- */}
        <div className="space-y-4">
          {!out ? (
            <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-mute">
              Pick a source on the left — output lands here.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-coal p-4">
                <p className="text-sm">
                  <span className="font-display font-bold">{out.engine === "llm" ? "LLM-polished" : "Rules engine"}</span>
                  <span className="text-mute"> · {source?.title}</span>
                </p>
                <form action={repurposeToBoard} className="flex items-center gap-2">
                  <input type="hidden" name="title" value={source?.title ?? ""} />
                  <label className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-mute"><input type="checkbox" name="channel" value="linkedin" defaultChecked /> LinkedIn</label>
                  <label className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-mute"><input type="checkbox" name="channel" value="thread" defaultChecked /> Thread</label>
                  <label className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-mute"><input type="checkbox" name="channel" value="newsletter" defaultChecked /> Newsletter</label>
                  <button className="rounded-full border border-accent/50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-accent hover:bg-accent/10">→ board</button>
                </form>
              </div>
              <CopyBox label="LinkedIn post" text={out.linkedin} />
              <CopyBox label="Thread" text={out.thread.join("\n\n")} />
              <CopyBox label="Newsletter blurb" text={out.newsletter} />
              {out.quotes.length > 0 && <CopyBox label="Quote cards" text={out.quotes.map((q, i) => `${i + 1}. ${q}`).join("\n")} />}
              <CopyBox label="SEO" text={`title: ${out.seo.title}\nmeta:  ${out.seo.meta}`} mono />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
