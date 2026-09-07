import { login } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-sm py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-mute">The Flagship · internal</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Studio CRM</h1>
      <p className="mt-3 text-sm text-mute">Enter the admin token to view leads, subscribers and analytics.</p>
      <form action={login} className="mt-8 space-y-4">
        <input
          type="password"
          name="token"
          required
          placeholder="Admin token"
          className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
        />
        {error ? <p className="text-sm text-red-400">Wrong token.</p> : null}
        <button type="submit" className="w-full rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">
          Enter
        </button>
      </form>
      <p className="mt-6 font-mono text-[11px] text-mute/60">Access is restricted to authorized studio staff.</p>
    </div>
  );
}
