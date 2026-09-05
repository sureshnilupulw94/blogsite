import { cookies } from "next/headers";
import Link from "next/link";
import "../globals.css";
import { ADMIN_COOKIE } from "@/lib/admin";
import { logout } from "./actions";

const NAV = [
  ["/admin", "Dashboard"],
  ["/admin/leads", "Leads"],
  ["/admin/projects", "Projects"],
  ["/admin/clients", "Clients"],
  ["/admin/proposals", "Proposals"],
  ["/admin/orders", "Orders"],
  ["/admin/finance", "Finance"],
  ["/admin/content", "Content"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const authed = store.get(ADMIN_COOKIE) !== undefined;

  return (
    <div className="min-h-screen bg-ink text-paper">
      {authed ? (
        <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/90 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-md bg-accent font-display text-xs font-bold text-accent-ink">F</span>
              <span className="font-display text-xs font-bold tracking-widest">STUDIO OS</span>
            </div>
            <nav className="flex items-center gap-0.5 overflow-x-auto text-sm" aria-label="Admin">
              {NAV.map(([href, label]) => (
                <Link key={href} href={href} className="whitespace-nowrap rounded-full px-3 py-1.5 text-mute transition-colors hover:text-paper">
                  {label}
                </Link>
              ))}
              <form action={logout}>
                <button type="submit" className="ms-2 rounded-full border border-line px-4 py-1.5 font-mono text-xs text-mute hover:text-paper">Log out</button>
              </form>
            </nav>
          </div>
        </header>
      ) : null}
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">{children}</div>
    </div>
  );
}
