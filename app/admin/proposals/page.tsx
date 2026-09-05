import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { listProposals } from "@/lib/proposals";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  draft: "border-line text-mute",
  sent: "border-sky/50 text-sky",
  accepted: "border-accent/50 text-accent",
  declined: "border-red-400/40 text-red-300",
};

export default async function ProposalsPage() {
  await requireAdmin();
  const proposals = await listProposals();
  const accepted = proposals.filter((p) => p.status === "accepted");
  const pipeline = proposals.filter((p) => p.status === "draft" || p.status === "sent");

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio OS · proposals</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{proposals.length} proposals</h1>
          <p className="mt-2 font-mono text-xs text-mute">
            accepted <span className="text-accent">${accepted.reduce((a, p) => a + p.price, 0).toLocaleString()}</span> · pipeline <span className="text-paper">${pipeline.reduce((a, p) => a + p.price, 0).toLocaleString()}</span>
          </p>
        </div>
        <Link href="/admin/proposals/new" className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">+ New proposal</Link>
      </header>

      {proposals.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-coal p-8 text-sm text-mute">
          No proposals yet. Generate one from a brief — scope, CREATE phases and standard terms are auto-drafted; you adjust the rest.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {proposals.map((p) => (
            <Link key={p.id} href={`/admin/proposals/${p.id}`} className="block rounded-2xl border border-line bg-coal p-5 transition-colors hover:border-accent/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold">{p.client.company || p.client.name || "Untitled"}</h2>
                  <p className="mt-1 line-clamp-1 text-sm text-mute">{p.objective || "No objective set"}</p>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <span className="text-accent">${p.price.toLocaleString()}</span>
                  <span>{p.timelineWeeks}w</span>
                  <span className={`rounded-full border px-3 py-1 uppercase tracking-widest ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
