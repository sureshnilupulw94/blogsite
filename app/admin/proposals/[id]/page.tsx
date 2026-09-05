import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getProposal } from "@/lib/proposals";
import { getService } from "@/lib/data/services";
import { markProposal } from "../../actions";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function ProposalDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const p = await getProposal(id);
  if (!p) notFound();

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">Proposal · {new Date(p.createdAt).toLocaleDateString()}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{p.client.company || "Untitled"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PrintButton />
          {(["draft", "sent", "accepted", "declined"] as const).filter((s) => s !== p.status).map((s) => (
            <form key={s} action={markProposal}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="status" value={s} />
              <button type="submit" className={`rounded-full px-5 py-2.5 font-display text-xs font-semibold ${s === "accepted" ? "bg-accent text-accent-ink" : "border border-line text-mute hover:text-paper"}`}>
                Mark {s}
              </button>
            </form>
          ))}
        </div>
      </header>

      <article className="mt-8 rounded-2xl border border-line bg-paper p-8 text-ink sm:p-12 print:border-0 print:p-0">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">The Flagship — proposal</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight">{p.objective}</h2>
            <p className="mt-2 text-sm text-ink/60">Prepared for {p.client.company}{p.client.name ? ` · ${p.client.name}` : ""}{p.client.email ? ` · ${p.client.email}` : ""}</p>
          </div>
          <div className="text-end">
            <p className="font-display text-3xl font-bold" style={{ color: "#0E7C66" }}>${p.price.toLocaleString()}</p>
            <p className="font-mono text-xs text-ink/60">{p.timelineWeeks} weeks</p>
          </div>
        </div>

        <section className="mt-10">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest" style={{ color: "#0E7C66" }}>Scope</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {p.scope.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink/80"><span style={{ color: "#0E7C66" }}>→</span>{item}</li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-xs text-ink/50">Services: {p.services.map((s) => getService(s)?.title ?? s).join(" · ")}</p>
        </section>

        <section className="mt-8">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest" style={{ color: "#0E7C66" }}>How we run it — CREATE</h3>
          <ol className="mt-3 flex flex-wrap gap-2">
            {p.phases.map((phase, i) => (
              <li key={phase} className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-medium">
                <span className="me-1.5 font-mono" style={{ color: "#0E7C66" }}>{i + 1}</span>{phase}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest" style={{ color: "#0E7C66" }}>Terms</h3>
          <ul className="mt-3 space-y-1.5">
            {p.terms.map((t) => <li key={t} className="text-xs leading-relaxed text-ink/70">— {t}</li>)}
          </ul>
        </section>

        <footer className="mt-10 border-t border-ink/10 pt-6 font-mono text-[10px] text-ink/50">
          The Flagship — we make complex things clear. · hello@theflagship.example · This proposal is valid for 30 days.
        </footer>
      </article>

      {p.notes ? <p className="mt-4 rounded-xl border border-line bg-coal p-4 font-mono text-xs text-mute print:hidden">internal notes: {p.notes}</p> : null}
    </div>
  );
}
