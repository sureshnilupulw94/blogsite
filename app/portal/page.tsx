import { requirePortal, readWorkspace } from "@/lib/portal";
import { approveMilestone, approveDeliverable, requestRevision } from "./actions";
import { cx } from "@/components/ui";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  draft: "border-line text-mute",
  internal: "border-line text-mute",
  "client-review": "border-accent/50 text-accent",
  revision: "border-yellow-300/40 text-yellow-200",
  approved: "border-accent/30 text-accent/80",
  final: "border-accent/50 text-accent",
};

export default async function PortalHome() {
  const session = await requirePortal();
  const ws = await readWorkspace(session.slug);
  if (!ws) {
    return <p className="text-sm text-mute">No workspace found. Contact the studio.</p>;
  }

  const done = ws.milestones.filter((m) => m.status === "done").length;
  const progress = ws.milestones.length ? Math.round((done / ws.milestones.length) * 100) : 0;
  const inReview = ws.deliverables.filter((d) => d.status === "client-review");
  const openComments = ws.comments.filter((c) => !c.resolved);

  return (
    <div className="space-y-8">
      {/* project card */}
      <section className="rounded-2xl border border-line bg-coal p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="kicker">Current project</p>
            <h1 className="mt-2 font-display text-3xl font-bold">{ws.project.name}</h1>
            <p className="mt-2 text-sm text-mute">
              Stage: <span className="text-paper">{ws.project.stage}</span> · Next action: <span className="text-accent">{ws.project.nextAction}</span>
            </p>
          </div>
          <div className="flex gap-6 font-mono text-xs text-mute">
            <span><span className="block font-display text-2xl font-bold text-paper">{ws.files.length}</span>files</span>
            <span><span className="block font-display text-2xl font-bold text-paper">{ws.brain.length + ws.businessBrain.length}</span>brain entries</span>
            <span><span className="block font-display text-2xl font-bold text-paper">{openComments.length}</span>open notes</span>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-1.5 flex justify-between font-mono text-xs">
            <span className="text-mute">Progress</span>
            <span className="text-accent">{progress}% — {done}/{ws.milestones.length} milestones</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      {/* approvals */}
      {inReview.length ? (
        <section className="rounded-2xl border border-accent/40 bg-accent/5 p-6 sm:p-8">
          <p className="kicker text-accent">Awaiting your approval</p>
          <div className="mt-5 space-y-4">
            {inReview.map((d) => (
              <div key={d.id} className="rounded-xl border border-line bg-coal p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-bold">{d.title}</h2>
                  <span className="rounded-full border border-accent/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">client review</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <form action={approveDeliverable}>
                    <input type="hidden" name="id" value={d.id} />
                    <button type="submit" className="rounded-full bg-accent px-6 py-2.5 font-display text-sm font-semibold text-accent-ink">Approve</button>
                  </form>
                  <form action={requestRevision} className="flex flex-1 flex-wrap gap-2">
                    <input type="hidden" name="id" value={d.id} />
                    <input
                      name="note"
                      required
                      placeholder="Or request a revision — what should change?"
                      className="min-w-48 flex-1 rounded-full border border-line bg-carbon px-4 py-2.5 text-sm focus:border-accent/60 focus:outline-none"
                    />
                    <button type="submit" className="rounded-full border border-line px-5 py-2.5 font-display text-sm font-semibold hover:border-yellow-300/50">Request revision</button>
                  </form>
                </div>
                {ws.comments.filter((c) => c.deliverableId === d.id && !c.resolved).map((c) => (
                  <p key={c.id} className="mt-3 rounded-lg border border-line/60 bg-carbon p-3 text-xs text-mute">
                    <span className="font-mono text-accent">{c.author === session.email ? "you" : c.author}{c.page ? ` · page ${c.page}` : ""}:</span> {c.message}
                  </p>
                ))}
                {d.pages?.length ? (
                  <a href={`/portal/review/${d.id}`} className="mt-3 inline-block font-display text-xs font-semibold text-accent hover:underline">Open page review — pin notes exactly where they apply →</a>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* milestones + deliverables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-coal p-6">
          <p className="kicker mb-5">Milestones</p>
          <ol className="space-y-3">
            {ws.milestones.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-carbon p-4">
                <span className="flex items-center gap-3">
                  <span className={cx("grid size-7 place-items-center rounded-full border font-mono text-xs", m.status === "done" ? "border-accent text-accent" : m.status === "current" ? "border-accent/60 text-accent" : "border-line text-mute")}>
                    {m.status === "done" ? "✓" : m.status === "current" ? "→" : "○"}
                  </span>
                  <span className={cx("font-display text-sm font-semibold", m.status === "todo" && "text-mute")}>{m.title}</span>
                </span>
                {m.status === "current" && m.awaiting ? (
                  <form action={approveMilestone}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-semibold text-accent-ink">Approve</button>
                  </form>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-line bg-coal p-6">
          <p className="kicker mb-5">Deliverables</p>
          <ul className="space-y-2.5">
            {ws.deliverables.length ? ws.deliverables.map((d) => {
              const notes = ws.comments.filter((c) => c.deliverableId === d.id && !c.resolved).length;
              return (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line/60 bg-carbon p-4">
                  <span className="font-display text-sm font-semibold">
                    {d.title}
                    {notes ? <span className="ms-2 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent">{notes} open note{notes > 1 ? "s" : ""}</span> : null}
                  </span>
                  <span className="flex items-center gap-3">
                    {d.pages?.length ? (
                      <a href={`/portal/review/${d.id}`} className="font-display text-xs font-semibold text-accent hover:underline">Review →</a>
                    ) : null}
                    <span className={cx("rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest", STATUS_STYLE[d.status] ?? "border-line text-mute")}>
                      {d.status}
                    </span>
                  </span>
                </li>
              );
            }) : <li className="text-sm text-mute">Deliverables appear here as work progresses.</li>}
          </ul>
        </section>
      </div>

      {/* activity */}
      <section className="rounded-2xl border border-line bg-coal p-6">
        <p className="kicker mb-4">Activity</p>
        <ul className="space-y-2.5">
          {ws.activity.slice(0, 8).map((a, i) => (
            <li key={i} className="flex gap-3 text-sm text-mute">
              <span className="font-mono text-[10px] text-mute/60">{new Date(a.at).toLocaleDateString()}</span>
              {a.text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
