import { requireAdmin } from "@/lib/admin";
import { listProposals } from "@/lib/proposals";
import { listClients, readWorkspace } from "@/lib/portal";

export const dynamic = "force-dynamic";

const HOURLY_COST = Number(process.env.STUDIO_HOURLY_COST ?? 40);

export default async function FinancePage() {
  await requireAdmin();
  const [proposals, clients] = await Promise.all([listProposals(), listClients()]);

  const accepted = proposals.filter((p) => p.status === "accepted");
  const pipeline = proposals.filter((p) => p.status === "draft" || p.status === "sent");
  const acceptedValue = accepted.reduce((a, p) => a + p.price, 0);
  const pipelineValue = pipeline.reduce((a, p) => a + p.price, 0);

  const rows = await Promise.all(
    clients.map(async (c) => {
      const ws = await readWorkspace(c.slug);
      const minutes = ws?.time.reduce((a, t) => a + t.minutes, 0) ?? 0;
      const hours = minutes / 60;
      const won = accepted.filter((p) => p.client.company.toLowerCase() === c.company.toLowerCase()).reduce((a, p) => a + p.price, 0);
      const cost = hours * HOURLY_COST;
      return { company: c.company, won, hours: Math.round(hours * 10) / 10, cost: Math.round(cost), margin: won - cost };
    })
  );

  const totalHours = rows.reduce((a, r) => a + r.hours, 0);
  const totalCost = rows.reduce((a, r) => a + r.cost, 0);

  const kpis = [
    { label: "Accepted value", value: `$${acceptedValue.toLocaleString()}` },
    { label: "Pipeline (draft+sent)", value: `$${pipelineValue.toLocaleString()}` },
    { label: "Hours logged", value: String(Math.round(totalHours * 10) / 10) },
    { label: `Delivery cost (@$${HOURLY_COST}/h)`, value: `$${totalCost.toLocaleString()}` },
    { label: "Gross margin", value: `$${(acceptedValue - totalCost).toLocaleString()}` },
    { label: "Win rate", value: proposals.length ? `${Math.round((accepted.length / proposals.length) * 100)}%` : "—" },
  ];

  return (
    <div>
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio OS · finance</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Money & minutes</h1>
        <p className="mt-2 text-sm text-mute">Accepted proposals vs delivery cost from logged time. Set <code className="font-mono text-xs text-accent">STUDIO_HOURLY_COST</code> to adjust the rate.</p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-line bg-coal p-5">
            <p className="font-display text-2xl font-bold text-accent">{k.value}</p>
            <p className="mt-1 text-xs text-mute">{k.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-coal">
              {["Client", "Won", "Hours", "Delivery cost", "Margin"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-start font-display text-xs uppercase tracking-wider text-mute">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.company} className="border-t border-line/60 bg-ink/40">
                <td className="px-5 py-4 font-medium">{r.company}</td>
                <td className="px-5 py-4 font-mono text-xs text-accent">${r.won.toLocaleString()}</td>
                <td className="px-5 py-4 font-mono text-xs text-mute">{r.hours}h</td>
                <td className="px-5 py-4 font-mono text-xs text-mute">${r.cost.toLocaleString()}</td>
                <td className={`px-5 py-4 font-mono text-xs ${r.margin >= 0 ? "text-accent" : "text-red-300"}`}>${r.margin.toLocaleString()}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-mute">No clients yet — create one under Clients.</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
