import { requireAdmin } from "@/lib/admin";
import { services } from "@/lib/data/services";
import { createProposal } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewProposal({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;

  const input = "w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none";

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio OS · proposals</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Generate a proposal</h1>
      <p className="mt-2 text-sm text-mute">Scope bullets and CREATE phases are drafted from the selected services — you refine after generating.</p>

      {error === "services" ? <p className="mt-4 rounded-xl border border-red-400/40 bg-red-400/5 p-4 text-sm text-red-300">Pick at least one service.</p> : null}

      <form action={createProposal} className="mt-8 space-y-6">
        <fieldset className="rounded-2xl border border-line bg-coal p-6">
          <legend className="kicker px-2">Client</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="name" required placeholder="Contact name" className={input} />
            <input name="company" required placeholder="Company" className={input} />
            <input name="email" type="email" placeholder="Email" className={input} />
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-coal p-6">
          <legend className="kicker px-2">Objective</legend>
          <textarea name="objective" required rows={2} placeholder="e.g. Redesign the company profile and rewrite website copy for the Series A" className={input} />
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-coal p-6">
          <legend className="kicker px-2">Services (scope is drafted from these)</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((s) => (
              <label key={s.slug} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line/60 bg-carbon p-3.5 text-sm transition-colors has-[:checked]:border-accent/50 has-[:checked]:text-accent">
                <input type="checkbox" name="services" value={s.slug} className="size-4 accent-[#d6ff3f]" />
                {s.title}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-coal p-6">
          <legend className="kicker px-2">Commercials</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="timelineWeeks" className="mb-1.5 block text-xs font-medium text-mute">Timeline (weeks)</label>
              <input id="timelineWeeks" name="timelineWeeks" type="number" min={1} max={52} defaultValue={4} className={input} />
            </div>
            <div>
              <label htmlFor="price" className="mb-1.5 block text-xs font-medium text-mute">Price (USD)</label>
              <input id="price" name="price" type="number" min={0} step={100} defaultValue={4800} className={input} />
            </div>
          </div>
          <textarea name="notes" rows={2} placeholder="Notes for the team (optional — not shown to client)" className={`${input} mt-4`} />
        </fieldset>

        <button type="submit" className="rounded-full bg-accent px-8 py-3.5 font-display text-sm font-semibold text-accent-ink">Generate proposal →</button>
      </form>
    </div>
  );
}
