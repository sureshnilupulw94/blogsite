import { requireAdmin } from "@/lib/admin";
import { readAll, type LeadRecord } from "@/lib/leads";
import { enrichLead, LEAD_STATUSES } from "@/lib/crm";
import { logout, setLeadStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await requireAdmin();
  const leads = (await readAll<LeadRecord>("leads.jsonl")).map(enrichLead).sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio CRM · leads</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{leads.length} lead records</h1>
        </div>
        <div className="flex gap-3">
          <a href="/admin" className="rounded-full border border-line px-5 py-2.5 font-display text-sm hover:border-accent/50">← Dashboard</a>
          <form action={logout}>
            <button type="submit" className="rounded-full border border-line px-5 py-2.5 font-mono text-xs text-mute hover:text-paper">Log out</button>
          </form>
        </div>
      </header>

      {leads.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-coal p-8 text-sm text-mute">
          No leads yet. Every form, tool capture, audit and concierge submission lands here with a computed score.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {leads.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-line bg-coal p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h2 className="font-display text-lg font-bold">{(lead.name as string) || "Anonymous"}</h2>
                    {lead.email ? <a href={`mailto:${lead.email}`} className="font-mono text-xs text-accent hover:underline">{lead.email as string}</a> : null}
                    {lead.company ? <span className="text-xs text-mute">{lead.company as string}</span> : null}
                  </div>
                  <p className="mt-1.5 text-sm text-mute">
                    <span className="text-paper">{lead.interest}</span> · urgency <span className="text-paper">{lead.urgency}</span> · value <span className="text-paper">{lead.value}</span>
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-mute/60">{new Date(lead.at).toLocaleString()} · source: {(lead.type as string) ?? "contact"}</p>
                </div>
                <div className="text-end">
                  <p className="font-display text-2xl font-bold text-accent">{lead.score}<span className="text-xs text-mute">/100</span></p>
                  <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${lead.score}%` }} />
                  </div>
                </div>
              </div>

              {lead.message || lead.brief || lead.problem ? (
                <details className="mt-4">
                  <summary className="cursor-pointer font-mono text-xs text-mute hover:text-paper">View submission</summary>
                  <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-line/60 bg-ink p-4 font-mono text-[11px] leading-relaxed text-paper/90">
                    {String(lead.brief ?? lead.problem ?? lead.message)}
                  </pre>
                </details>
              ) : null}

              <form action={setLeadStatus} className="mt-4 flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <label className="font-mono text-[10px] uppercase tracking-widest text-mute" htmlFor={`status-${lead.id}`}>Status</label>
                <select
                  id={`status-${lead.id}`}
                  name="status"
                  defaultValue={(lead.status as string) ?? "new"}
                  className="rounded-lg border border-line bg-carbon px-3 py-2 text-sm focus:border-accent/60 focus:outline-none"
                >
                  {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  name="note"
                  defaultValue={(lead.note as string) ?? ""}
                  placeholder="Note (next step, context…)"
                  className="min-w-48 flex-1 rounded-lg border border-line bg-carbon px-3 py-2 text-sm focus:border-accent/60 focus:outline-none"
                />
                <button type="submit" className="rounded-full bg-accent px-5 py-2 font-display text-xs font-semibold text-accent-ink">Save</button>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
