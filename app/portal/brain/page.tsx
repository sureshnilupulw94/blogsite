import { requirePortal, readWorkspace } from "@/lib/portal";
import { addKnowledge } from "../actions";
import BrainPanel from "./BrainPanel";

export const dynamic = "force-dynamic";

export default async function BrainPage() {
  const session = await requirePortal();
  const ws = await readWorkspace(session.slug);

  return (
    <div className="space-y-8">
      <header>
        <p className="kicker">Private knowledge base</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Brand Brain</h1>
        <p className="mt-2 max-w-lg text-sm text-mute">
          Everything the studio should know about your brand — voice, rules, facts, history. Ask it anything; add to it anytime. Every future deliverable starts from this brain.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-coal p-6 sm:p-8">
        <BrainPanel which="brand" examples={["What is our tagline?", "Which words are banned?", "What are the brand colours?", "Company facts for a proposal"]} />
      </section>

      <section className="rounded-2xl border border-line bg-coal p-6 sm:p-8">
        <p className="kicker mb-4">Teach the Brain</p>
        <form action={addKnowledge} className="space-y-3">
          <input type="hidden" name="which" value="brand" />
          <input
            name="title"
            placeholder="Title — e.g. Voice guidelines, Product facts, Q3 messaging"
            className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
          />
          <textarea
            name="text"
            rows={6}
            required
            placeholder="Paste knowledge here — guidelines, approved copy, facts, tone examples, banned words…"
            className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm leading-relaxed focus:border-accent/60 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">Add to Brain</button>
        </form>
      </section>

      {ws?.brain.length ? (
        <section>
          <p className="kicker mb-4">Known knowledge ({ws.brain.length})</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ws.brain.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-line bg-coal p-5">
                <p className="font-display text-sm font-semibold">{entry.title}</p>
                <p className="mt-1 font-mono text-[10px] text-mute">{entry.chunks.length} passages · added {new Date(entry.addedAt).toLocaleDateString()}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-mute">{entry.chunks[0]}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
