import { cookies } from "next/headers";
import Link from "next/link";
import "../globals.css";
import { PORTAL_COOKIE, verifySessionToken, listClients } from "@/lib/portal";
import { logoutPortal } from "./actions";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const session = verifySessionToken(store.get(PORTAL_COOKIE)?.value);
  const client = session ? (await listClients()).find((c) => c.slug === session.slug) : null;

  return (
    <div className="min-h-screen bg-ink text-paper">
      {session ? (
        <header className="border-b border-line/60 bg-coal/50">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-md bg-accent font-display text-sm font-bold text-accent-ink">F</span>
              <div>
                <p className="font-display text-sm font-bold leading-none tracking-widest">FLAGSHIP</p>
                <p className="mt-1 font-mono text-[10px] text-mute">client portal{client ? ` · ${client.company}` : ""}</p>
              </div>
            </div>
            <nav className="flex items-center gap-1 text-sm" aria-label="Portal">
              <Link href="/portal" className="rounded-full px-3 py-2 text-mute transition-colors hover:text-paper">Workspace</Link>
              <Link href="/portal/files" className="rounded-full px-3 py-2 text-mute transition-colors hover:text-paper">Files</Link>
              <Link href="/portal/brain" className="rounded-full px-3 py-2 text-mute transition-colors hover:text-paper">Brand Brain</Link>
              <Link href="/portal/business-brain" className="rounded-full px-3 py-2 text-mute transition-colors hover:text-paper">Business Brain</Link>
              <form action={logoutPortal}>
                <button type="submit" className="rounded-full border border-line px-4 py-2 font-mono text-xs text-mute hover:text-paper">Log out</button>
              </form>
            </nav>
          </div>
        </header>
      ) : null}
      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-8">{children}</main>
    </div>
  );
}
