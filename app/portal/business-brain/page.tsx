import { requirePortal, readWorkspace } from "@/lib/portal";
import { addKnowledge } from "../actions";
import BrainPanel from "../brain/BrainPanel";

export const dynamic = "force-dynamic";

export default async function BusinessBrainPage() {
  const session = await requirePortal();
  const ws = await readWorkspace(session.slug);

  return (
    <div className="space-y-8">
      <header>
        <p className="kicker">Operations knowledge base</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Business Brain</h1>
        <p className="mt-2 max-w-lg text-sm text-mute">
          How the business actually runs — policies, SOPs, processes, FAQs, people, systems. Ask it anything; add to it anytime. Knowledge stops living in heads and starts working for the team.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-coal p-6 sm:p-8">
        <BrainPanel which="business" examples={["What's the refund policy?", "How do we handle a delayed shipment?", "Who approves discounts?", "Where are our warehouses?"]} />
      </section>

      <section className="rounded-2xl border border-line bg-coal p-6 sm:p-8">
        <p className="kicker mb-4">Teach the Business Brain</p>
        <form action={addKnowledge} className="space-y-3">
          <input type="hidden" name="which" value="business" />
          <input
            name="title"
            placeholder="Title — e.g. Refund policy, Order intake SOP, Escalation matrix"
            className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
          />
          <textarea
            name="text"
            rows={6}
            required
            placeholder="Paste knowledge here — SOPs, policies, process steps, FAQs, team info…"
            className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm leading-relaxed focus:border-accent/60 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">Add to Business Brain</button>
        </form>
      </section>

      {ws?.businessBrain.length ? (
        <section>
          <p className="kicker mb-4">Known knowledge ({ws.businessBrain.length})</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ws.businessBrain.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-line bg-coal p-5">
                <p className="font-display text-sm font-semibold">{entry.title}</p>
                <p className="mt-1 font-mono text-[10px] text-mute">{entry.chunks.length} passages · added {new Date(entry.addedAt).toLocaleDateString()}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-mute">{entry.chunks[0]}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-coal/50 p-8 text-center text-sm text-mute">
          The Business Brain is empty — feed it your first SOP or policy above.
        </p>
      )}
    </div>
  );
}
