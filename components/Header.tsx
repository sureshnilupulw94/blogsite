"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { locales, localeMeta, localePath, type Locale } from "@/lib/i18n";
import { cx } from "./ui";

type NavLink = [string, string];

export default function Header({ locale, dict }: { locale: Locale; dict: Dict }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  const groups: { key: string; label: string; href?: string; children?: NavLink[] }[] = [
    { key: "discover", label: dict.nav.discover, href: "/discover" },
    {
      key: "services", label: dict.nav.services,
      children: [
        [dict.nav.services, "/services"], [dict.nav.capabilities, "/capabilities"],
        [dict.nav.packages, "/packages"], [dict.nav.retainers, "/retainers"],
        [dict.nav.industries, "/industries"], [dict.nav.problems, "/problems"],
        [dict.nav.map, "/map"],
      ],
    },
    {
      key: "work", label: dict.nav.work,
      children: [[dict.nav.work, "/work"], [dict.nav.studio, "/studio"], [dict.nav.lab, "/lab"]],
    },
    { key: "podcast", label: dict.nav.podcast, href: "/podcast" },
    {
      key: "tools", label: dict.nav.tools,
      children: [[dict.nav.tools, "/tools"], [dict.nav.library, "/library"], [dict.nav.insights, "/insights"], [dict.nav.ideas, "/ideas"]],
    },
    {
      key: "more", label: dict.nav.more,
      children: [
        [dict.nav.about, "/about"], [dict.nav.careers, "/careers"], [dict.nav.partners, "/partners"],
        [dict.nav.products, "/products"], [dict.nav.events, "/events"], [dict.nav.research, "/research"],
        [dict.nav.press, "/press"], [dict.nav.roadmap, "/roadmap"], [dict.nav.status, "/status"], [dict.nav.legal, "/legal"],
      ],
    },
  ];

  const allGroups = groups.flatMap((g) => (g.children ? g.children : ([[g.label, g.href!]] as NavLink[])));

  const isActive = (href?: string) => {
    if (!href) return false;
    const full = localePath(locale, href);
    return pathname === full || pathname.startsWith(full + "/");
  };

  const swapLocale = (next: Locale) => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length) parts[0] = next;
    return "/" + parts.join("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/50 bg-ink/85 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href={localePath(locale)} className="group flex items-center gap-2.5" aria-label="The Flagship — home">
          <span className="grid size-8 place-items-center rounded-md bg-accent font-display text-sm font-bold text-accent-ink">F</span>
          <span className="font-display text-sm font-bold tracking-[0.22em]">FLAGSHIP</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {groups.map((g) =>
            g.href ? (
              <Link
                key={g.key}
                href={localePath(locale, g.href)}
                className={cx(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(g.href) ? "text-accent" : "text-mute hover:text-paper"
                )}
              >
                {g.label}
              </Link>
            ) : (
              <div key={g.key} className="relative">
                <button
                  type="button"
                  aria-expanded={openGroup === g.key}
                  onClick={() => setOpenGroup(openGroup === g.key ? null : g.key)}
                  onBlur={() => setTimeout(() => openGroup === g.key && setOpenGroup(null), 120)}
                  className={cx(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    g.children!.some(([, href]) => isActive(href)) ? "text-accent" : "text-mute hover:text-paper"
                  )}
                >
                  {g.label}
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                {openGroup === g.key ? (
                  <div className="absolute start-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-line bg-coal shadow-2xl">
                    {g.children!.map(([label, href]) => (
                      <Link
                        key={href}
                        href={localePath(locale, href)}
                        className={cx(
                          "block px-4 py-2.5 text-sm transition-colors",
                          isActive(href) ? "bg-carbon text-accent" : "text-mute hover:bg-carbon hover:text-paper"
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-mute hover:text-paper">
              {localeMeta[locale].native}
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-coal shadow-2xl">
              {locales.map((l) => (
                <Link key={l} href={swapLocale(l)} className={cx("block px-4 py-2.5 text-sm", l === locale ? "bg-carbon text-accent" : "text-mute hover:bg-carbon hover:text-paper")}>
                  {localeMeta[l].label}
                </Link>
              ))}
            </div>
          </details>

          <Link
            href={localePath(locale, "contact")}
            className="hidden rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5 sm:block"
          >
            {dict.common.start}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-line bg-ink px-5 pb-8 pt-4 lg:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {allGroups.map(([label, href]) => (
              <Link
                key={href}
                href={localePath(locale, href)}
                className={cx("rounded-lg px-3 py-2.5 font-display text-base", isActive(href) ? "bg-coal text-accent" : "text-mute hover:bg-coal hover:text-paper")}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
