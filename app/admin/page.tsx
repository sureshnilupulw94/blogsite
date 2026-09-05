import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { readAll, type LeadRecord, type EventRecord } from "@/lib/leads";
import { enrichLead } from "@/lib/crm";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

function daysAgo(iso: string, days: number) {
  const t = new Date(iso).getTime();
  return Date.now() - t <= days * 86400_000;
}

export default async function AdminDashboard() {
  await requireAdmin();

  const [leads, subscribers, events] = await Promise.all([
    readAll<LeadRecord>("leads.jsonl"),
    readAll<Record<string, unknown>>("subscribers.jsonl"),
    readAll<EventRecord>("events.jsonl"),
  ]);

  const enriched = leads.map(enrichLead).sort((a, b) => (a.at < b.at ? 1 : -1));
  const pageviews = events.filter((e) => e.type === "pageview");
  const namedEvents = events.filter((e) => e.type === "event" && e.name);
  const weekLeads = enriched.filter((l) => daysAgo(l.at, 7));
  const avgScore = enriched.length ? Math.round(enriched.reduce((a, l) => a + l.score, 0) / enriched.length) : 0;
  const conversion = pageviews.length ? ((leads.length / pageviews.length) * 100).toFixed(1) : "0";

  const topPaths = Object.entries(
    pageviews.reduce<Record<string, number>>((acc, e) => {
      const p = String(e.path ?? "—");
      acc[p] = (acc[p] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const eventCounts = Object.entries(
    namedEvents.reduce<Record<string, number>>((acc, e) => {
      const n = String(e.name);
      acc[n] = (acc[n] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const toolUsage = eventCounts.filter(([n]) => !n.startsWith("pageview"));
  const funnel = ["new", "contacted", "proposal", "won", "lost"].map((s) => ({
    status: s,
    n: enriched.filter((l) => (l.status ?? "new") === s).length,
  }));

  const kpis = [
    { label: "Leads (all time)", value: String(leads.length) },
    { label: "Leads (7 days)", value: String(weekLeads.length) },
    { label: "Avg lead score", value: String(avgScore) },
    { label: "Subscribers", value: String(subscribers.length) },
    { label: "Pageviews", value: String(pageviews.length) },
    { label: "View → lead", value: `${conversion}%` },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">The Flagship · internal</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Studio CRM</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/leads" className="rounded-full border border-line px-5 py-2.5 font-display text-sm hover:border-accent/50">
            Leads →
          </Link>
          <Link href="/admin/clients" className="rounded-full border border-line px-5 py-2.5 font-display text-sm hover:border-accent/50">
            Clients →
          </Link>
          <form action={logout}>
            <button type="submit" className="rounded-full border border-line px-5 py-2.5 font-mono text-xs text-mute hover:text-paper">Log out</button>
          </form>
        </div>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-line bg-coal p-5">
            <p className="font-display text-2xl font-bold text-accent">{k.value}</p>
            <p className="mt-1 text-xs text-mute">{k.label}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-coal p-6 lg:col-span-1">
          <h2 className="kicker mb-4">Top pages</h2>
          {topPaths.length ? (
            <ul className="space-y-2.5">
              {topPaths.map(([path, n]) => (
                <li key={path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-mute">{path}</span>
                  <span className="font-mono text-xs text-accent">{n}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-mute">No pageviews recorded yet.</p>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-coal p-6">
          <h2 className="kicker mb-4">Tool & event usage</h2>
          {toolUsage.length ? (
            <ul className="space-y-2.5">
              {toolUsage.map(([name, n]) => (
                <li key={name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-mute">{name}</span>
                  <span className="font-mono text-xs text-accent">{n}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-mute">No tool events yet — usage appears as visitors interact.</p>
          )}
          <h2 className="kicker mb-3 mt-6">Pipeline</h2>
          <ul className="flex flex-wrap gap-2">
            {funnel.map((f) => (
              <li key={f.status} className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-mute">
                {f.status}: <span className="text-accent">{f.n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-coal p-6">
          <h2 className="kicker mb-4">Latest leads</h2>
          {enriched.length ? (
            <ul className="space-y-3">
              {enriched.slice(0, 6).map((l) => (
                <li key={l.id} className="rounded-xl border border-line/60 bg-carbon p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-display text-sm font-semibold">{(l.name as string) || (l.email as string) || "Anonymous"}</span>
                    <span className="font-mono text-xs text-accent">{l.score}/100</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-mute">{l.interest} · {l.urgency} · {l.value}</p>
                  <p className="mt-1 font-mono text-[10px] text-mute/60">{new Date(l.at).toLocaleString()} · {(l.status as string) ?? "new"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-mute">No leads yet — they arrive via forms, tools and the concierge.</p>
          )}
        </section>
      </div>

      <p className="mt-10 font-mono text-[11px] text-mute/60">
        Events: {events.length} total · {pageviews.length} pageviews · {namedEvents.length} named events. Data stored in .data/*.jsonl (swap for a real DB in production).
      </p>
    </div>
  );
}
