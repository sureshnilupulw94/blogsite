import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getProposalByToken, setProposalStatus } from "@/lib/proposals";
import { getService } from "@/lib/data/services";
import { recordEvent } from "@/lib/leads";
import { site } from "@/lib/data/site";

export const dynamic = "force-dynamic";

async function decide(formData: FormData) {
  "use server";
  const token = String(formData.get("token") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const proposal = await getProposalByToken(token);
  if (!proposal) return;
  if (decision === "accept") {
    await setProposalStatus(proposal.id, "accepted");
    await recordEvent({ type: "event", name: "proposal_accepted", company: proposal.client.company, value: proposal.price });
  } else if (decision === "decline") {
    await setProposalStatus(proposal.id, "declined");
    await recordEvent({ type: "event", name: "proposal_declined", company: proposal.client.company });
  }
  revalidatePath(`/p/${token}`);
}

export default async function SharedProposal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await getProposalByToken(token);
  if (!p) notFound();

  await recordEvent({ type: "event", name: "proposal_viewed", company: p.client.company, value: p.price });

  const decided = p.status === "accepted" || p.status === "declined";

  return (
    <div className="min-h-screen bg-ink px-5 py-10 text-paper sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-accent font-display text-sm font-bold text-accent-ink">F</span>
            <span className="font-display text-sm font-bold tracking-[0.22em]">FLAGSHIP</span>
          </div>
          <span className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${p.status === "accepted" ? "border-accent/50 text-accent" : p.status === "declined" ? "border-red-400/40 text-red-300" : "border-line text-mute"}`}>
            {p.status}
          </span>
        </header>

        <article className="mt-8 rounded-2xl border border-line bg-paper p-8 text-ink sm:p-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">Proposal for {p.client.company}</p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{p.objective}</h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
            <div>
              <p className="font-display text-4xl font-bold" style={{ color: "#0E7C66" }}>${p.price.toLocaleString()}</p>
              <p className="mt-1 font-mono text-xs text-ink/60">{p.timelineWeeks} weeks · prepared {new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="max-w-55 text-right font-mono text-[10px] leading-relaxed text-ink/50">Prepared by {site.name}<br />{site.email}</p>
          </div>

          <section className="mt-8">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest" style={{ color: "#0E7C66" }}>Scope</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {p.scope.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-ink/80"><span style={{ color: "#0E7C66" }}>→</span>{item}</li>)}
            </ul>
            <p className="mt-4 font-mono text-xs text-ink/50">Services: {p.services.map((s) => getService(s)?.title ?? s).join(" · ")}</p>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest" style={{ color: "#0E7C66" }}>How we run it — CREATE</h2>
            <ol className="mt-3 flex flex-wrap gap-2">
              {p.phases.map((phase, i) => (
                <li key={phase} className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-medium">
                  <span className="me-1.5 font-mono" style={{ color: "#0E7C66" }}>{i + 1}</span>{phase}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest" style={{ color: "#0E7C66" }}>Terms</h2>
            <ul className="mt-3 space-y-1.5">
              {p.terms.map((t) => <li key={t} className="text-xs leading-relaxed text-ink/70">— {t}</li>)}
            </ul>
          </section>

          <footer className="mt-10 border-t border-ink/10 pt-6 font-mono text-[10px] text-ink/50">
            Valid for 30 days from preparation. Questions? {site.email}
          </footer>
        </article>

        {decided ? (
          <div className={`mt-6 rounded-2xl border p-6 text-center ${p.status === "accepted" ? "border-accent/50 bg-accent/10" : "border-red-400/30 bg-red-400/5"}`}>
            <p className="font-display text-xl font-bold">{p.status === "accepted" ? "Accepted — thank you." : "Marked as declined."}</p>
            <p className="mt-2 text-sm text-mute">
              {p.status === "accepted"
                ? `We've notified the studio. Next: a kick-off email from your project lead within one working day.`
                : "No hard feelings — tell us what missed the mark and we'll reshape it."}
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-line bg-coal p-6">
            <form action={decide}>
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="decision" value="accept" />
              <button type="submit" className="rounded-full bg-accent px-8 py-3.5 font-display text-sm font-bold text-accent-ink">Accept proposal</button>
            </form>
            <form action={decide}>
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="decision" value="decline" />
              <button type="submit" className="rounded-full border border-line px-8 py-3.5 font-display text-sm font-semibold text-mute hover:text-paper">Decline</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
