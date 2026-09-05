import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ensureSeeded, listClients, readWorkspace } from "@/lib/portal";

export const dynamic = "force-dynamic";

export default async function AdminProjects() {
  await requireAdmin();
  await ensureSeeded();
  const clients = await listClients();
  const rows = await Promise.all(
    clients.map(async (c) => {
      const ws = await readWorkspace(c.slug);
      const done = ws?.milestones.filter((m) => m.status === "done").length ?? 0;
      const total = ws?.milestones.length ?? 0;
      const openNotes = ws?.comments.filter((x) => !x.resolved).length ?? 0;
      return { client: c, ws, done, total, openNotes };
    })
  );

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio CRM · projects</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Client workspaces</h1>
        </div>
        <a href="/admin" className="rounded-full border border-line px-5 py-2.5 font-display text-sm hover:border-accent/50">← Dashboard</a>
      </header>

      <div className="mt-8 space-y-4">
        {rows.map(({ client, ws, done, total, openNotes }) => (
          <Link key={client.slug} href={`/admin/projects/${client.slug}`} className="block rounded-2xl border border-line bg-coal p-6 transition-colors hover:border-accent/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold">{client.company}</h2>
                <p className="mt-1 text-sm text-mute">{ws?.project.name ?? "No project"} · stage: <span className="text-paper">{ws?.project.stage ?? "—"}</span></p>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs text-mute">
                {openNotes ? <span className="rounded-full bg-accent/15 px-3 py-1.5 text-accent">{openNotes} open notes</span> : null}
                <span>{done}/{total} milestones</span>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-accent" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
            </div>
          </Link>
        ))}
        {!rows.length ? <p className="rounded-2xl border border-line bg-coal p-8 text-sm text-mute">No clients yet — create one under Clients.</p> : null}
      </div>
    </div>
  );
}
