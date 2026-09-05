import Link from "next/link";
import type { Dict } from "@/lib/dictionaries";
import { localePath, locales, localeMeta, type Locale } from "@/lib/i18n";
import { site } from "@/lib/data/site";
import { NewsletterForm } from "./forms";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dict }) {
  const p = (path: string) => localePath(locale, path);
  const cols: { title: string; links: [string, string][] }[] = [
    {
      title: dict.nav.services,
      links: [
        [dict.nav.services, "/services"], [dict.nav.capabilities, "/capabilities"], [dict.nav.packages, "/packages"],
        [dict.nav.retainers, "/retainers"], [dict.nav.industries, "/industries"], [dict.nav.problems, "/problems"], [dict.nav.map, "/map"],
      ],
    },
    {
      title: dict.common.explore,
      links: [
        [dict.nav.work, "/work"], [dict.nav.podcast, "/podcast"], [dict.nav.ideas, "/ideas"], [dict.nav.insights, "/insights"],
        [dict.nav.library, "/library"], [dict.nav.tools, "/tools"], [dict.nav.studio, "/studio"], [dict.nav.lab, "/lab"],
        [dict.nav.products, "/products"], [dict.nav.events, "/events"], [dict.nav.research, "/research"],
      ],
    },
    {
      title: dict.nav.about,
      links: [
        [dict.nav.about, "/about"], [dict.nav.careers, "/careers"], [dict.nav.partners, "/partners"],
        [dict.nav.press, "/press"], [dict.nav.roadmap, "/roadmap"], [dict.nav.status, "/status"], [dict.nav.contact, "/contact"],
      ],
    },
    {
      title: dict.nav.legal,
      links: [
        [dict.nav.legal, "/legal"], ["Privacy", "/legal/privacy"], ["Terms", "/legal/terms"], ["Cookies", "/legal/cookies"], ["AI policy", "/legal/ai-policy"], ["Accessibility", "/legal/accessibility"],
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-coal/50">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-md bg-accent font-display text-sm font-bold text-accent-ink">F</span>
              <span className="font-display text-sm font-bold tracking-[0.22em]">FLAGSHIP</span>
            </div>
            <p className="mt-4 font-display text-lg font-semibold">{dict.common.philosophy}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">{dict.home.newsletterDesc}</p>
            <div className="mt-5"><NewsletterForm dict={dict} /></div>
          </div>
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4" aria-label="Footer">
            {cols.map((col) => (
              <div key={col.title}>
                <h3 className="kicker mb-4">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={href + label}>
                      <Link href={p(href)} className="text-sm text-mute transition-colors hover:text-accent">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-5 border-t border-line/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-mute">© {new Date().getFullYear()} {site.name} · {site.location}</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Languages">
            {locales.map((l) => (
              <li key={l}>
                <Link href={localePath(l)} className={l === locale ? "font-mono text-xs text-accent" : "font-mono text-xs text-mute hover:text-paper"}>
                  {localeMeta[l].native}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
