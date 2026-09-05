import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { listClients, readWorkspace } from "@/lib/portal";
import { setDeliverableStatus, toggleFeedback } from "../../actions";
import { cx } from "@/components/ui";

export const dynamic = "force-dynamic";

const STATUSES = ["draft", "internal", "client-review", "revision", "approved", "final"];

export default async function AdminProject({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const client = (await listClients()).find((c) => c.slug === slug);
  const ws = await readWorkspace(slug);
  if (!client || !ws) notFound();

  const done = ws.milestones.filter((m) => m.status === "done").length;
  const open = ws.comments.filter((c) => !c.resolved);
  const resolved = ws.comments.filter((c) => c.resolved);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">{client.company} · {client.email}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{ws.project.name}</h1>
          <p className="mt-2 text-sm text-mute">
            Stage <span className="text-paper">{ws.project.stage}</span> · awaiting <span className="text-accent">{ws.project.nextAction}</span> · {done}/{ws.milestones.length} milestones
          </p>
        </div>
        <a href="/admin/projects" className="rounded-full border border-line px-5 py-2.5 font-display text-sm hover:border-accent/50">← Projects</a>
      </header>

      {/* feedback inbox */}
      <section className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
        <p className="kicker text-accent">Client feedback — open ({open.length})</p>
        <ul className="mt-4 space-y-3">
          {open.length ? open.map((c) => {
            const d = ws.deliverables.find((x) => x.id === c.deliverableId);
            return (
              <li key={c.id} className="rounded-xl border border-line bg-coal p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                  {d?.title ?? "deliverable"}{c.page ? ` · page ${c.page}` : ""}{c.x !== undefined && c.y !== undefined ? ` · pin ${Math.round(c.x)}%,${Math.round(c.y)}%` : ""} · {c.author}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-paper">{c.message}</p>
                <form action={toggleFeedback} className="mt-3">
                  <input type="hidden" name="slug" value={slug} />
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-semibold text-accent-ink">Resolve</button>
                </form>
              </li>
            );
          }) : <li className="text-sm text-mute">No open notes — the client is happy (or asleep).</li>}
        </ul>
        {resolved.length ? (
          <details className="mt-4">
            <summary className="cursor-pointer font-mono text-xs text-mute hover:text-paper">Resolved ({resolved.length})</summary>
            <ul className="mt-3 space-y-2">
              {resolved.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-coal p-3">
                  <span className="text-xs text-mute line-through">{c.message}</span>
                  <form action={toggleFeedback}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="font-mono text-[10px] text-mute hover:text-paper">Reopen</button>
                  </form>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      {/* deliverables */}
      <section className="rounded-2xl border border-line bg-coal p-6">
        <p className="kicker mb-4">Deliverables — move status as work progresses</p>
        <ul className="space-y-3">
          {ws.deliverables.length ? ws.deliverables.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line/60 bg-carbon p-4">
              <div>
                <p className="font-display text-sm font-semibold">{d.title}</p>
                {d.pages?.length ? <p className="mt-0.5 font-mono text-[10px] text-mute">{d.pages.length} review pages published</p> : null}
              </div>
              <form action={setDeliverableStatus} className="flex items-center gap-2">
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="id" value={d.id} />
                <select name="status" defaultValue={d.status} className="rounded-lg border border-line bg-ink px-3 py-2 text-sm focus:border-accent/60 focus:outline-none">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" className="rounded-full bg-accent px-4 py-2 font-display text-xs font-semibold text-accent-ink">Save</button>
              </form>
            </li>
          )) : <li className="text-sm text-mute">No deliverables yet.</li>}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* milestones */}
        <section className="rounded-2xl border border-line bg-coal p-6">
          <p className="kicker mb-4">Milestones</p>
          <ol className="space-y-2.5">
            {ws.milestones.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-xl border border-line/60 bg-carbon p-3.5">
                <span className={cx("grid size-6 place-items-center rounded-full border font-mono text-[10px]", m.status === "done" ? "border-accent text-accent" : m.status === "current" ? "border-accent/60 text-accent" : "border-line text-mute")}>
                  {m.status === "done" ? "✓" : m.status === "current" ? "→" : "○"}
                </span>
                <span className={cx("font-display text-sm", m.status === "todo" && "text-mute")}>{m.title}</span>
                {m.awaiting ? <span className="ms-auto font-mono text-[10px] text-accent">awaiting client</span> : null}
              </li>
            ))}
          </ol>
        </section>

        {/* overview */}
        <section className="rounded-2xl border border-line bg-coal p-6">
          <p className="kicker mb-4">Workspace</p>
          <ul className="space-y-2 font-mono text-xs text-mute">
            <li>files: <span className="text-paper">{ws.files.length}</span></li>
            <li>brand brain entries: <span className="text-paper">{ws.brain.length}</span></li>
            <li>business brain entries: <span className="text-paper">{ws.businessBrain.length}</span></li>
            <li>updated: <span className="text-paper">{new Date(ws.project.updatedAt).toLocaleString()}</span></li>
          </ul>
          <p className="kicker mb-2 mt-5">Recent activity</p>
          <ul className="space-y-1.5">
            {ws.activity.slice(0, 6).map((a, i) => (
              <li key={i} className="text-xs text-mute"><span className="font-mono text-[10px] text-mute/60">{new Date(a.at).toLocaleDateString()}</span> {a.text}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
