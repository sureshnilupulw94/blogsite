import { ensureSeeded } from "@/lib/portal";
import MagicLinkForm from "./MagicLinkForm";

export const dynamic = "force-dynamic";

export default async function PortalLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  await ensureSeeded();

  return (
    <div className="mx-auto max-w-md py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-mute">The Flagship · client portal</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Your workspace</h1>
      <p className="mt-3 text-sm leading-relaxed text-mute">
        Enter the email on your portal account and we&apos;ll create a one-time login link. No passwords to remember.
      </p>

      <div className="mt-8">
        <MagicLinkForm />
      </div>

      {error ? <p className="mt-4 rounded-xl border border-red-400/40 bg-red-400/5 p-4 text-sm text-red-300">That link is invalid or has expired — request a new one.</p> : null}

      <div className="mt-10 rounded-2xl border border-line bg-coal p-5">
        <p className="kicker mb-2">Demo</p>
        <p className="text-sm text-mute">
          Try <span className="font-mono text-accent">demo@acme.example</span> — a seeded Acme Logistics workspace with a live project, approvals and a Brand Brain.
        </p>
      </div>
    </div>
  );
}
