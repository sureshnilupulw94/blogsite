import { requireAdmin } from "@/lib/admin";
import { ensureSeeded, listClients } from "@/lib/portal";
import { createClientAccount, makeLoginLink } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminClients({ searchParams }: { searchParams: Promise<{ created?: string; link?: string; error?: string }> }) {
  await requireAdmin();
  const { created, link, error } = await searchParams;
  await ensureSeeded();
  const clients = await listClients();

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio CRM · clients</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Portal accounts</h1>
        </div>
        <a href="/admin" className="rounded-full border border-line px-5 py-2.5 font-display text-sm hover:border-accent/50">← Dashboard</a>
      </header>

      {created ? (
        <p className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm text-paper">
          Portal created for <span className="text-accent">{created}</span> — they can now request a login link at <span className="font-mono text-xs">/portal/login</span>.
        </p>
      ) : null}
      {error ? <p className="mt-6 rounded-xl border border-red-400/40 bg-red-400/5 p-4 text-sm text-red-300">{error}</p> : null}
      {link ? (
        <p className="mt-6 break-all rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm">
          Login link (dev — single use, 30 min): <a href={link} className="font-mono text-xs text-accent underline">{link}</a>
        </p>
      ) : null}

      <section className="mt-8 rounded-2xl border border-line bg-coal p-6">
        <p className="kicker mb-4">Create portal account</p>
        <form action={createClientAccount} className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-mute">Client email</label>
            <input id="email" name="email" type="email" required placeholder="contact@company.com" className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none" />
          </div>
          <div className="min-w-44 flex-1">
            <label htmlFor="company" className="mb-1.5 block text-xs font-medium text-mute">Company</label>
            <input id="company" name="company" required placeholder="Company name" className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none" />
          </div>
          <div className="min-w-44 flex-1">
            <label htmlFor="project" className="mb-1.5 block text-xs font-medium text-mute">Project name</label>
            <input id="project" name="project" placeholder="e.g. Company Profile Redesign" className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none" />
          </div>
          <button type="submit" className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">Create</button>
        </form>
      </section>

      <section className="mt-8 space-y-3">
        {clients.map((c) => (
          <div key={c.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-coal p-5">
            <div>
              <p className="font-display text-base font-bold">{c.company}</p>
              <p className="mt-1 font-mono text-xs text-mute">{c.email} · /{c.slug} · created {new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
            <form action={makeLoginLink}>
              <input type="hidden" name="email" value={c.email} />
              <button type="submit" className="rounded-full border border-line px-5 py-2 font-display text-xs hover:border-accent/50 hover:text-accent">
                Generate login link
              </button>
            </form>
          </div>
        ))}
      </section>
    </div>
  );
}
