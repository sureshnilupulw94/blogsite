import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { services, matrixNeeds, matrixColumns } from "@/lib/data/services";
import { stages, createFramework } from "@/lib/data/tools";
import { DiscoveryWidget } from "@/components/Discovery";
import ConciergeChat from "@/components/ConciergeChat";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Discover({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const serviceLite = services.map((s) => ({ slug: s.slug, title: s.title, short: s.short, icon: s.icon, summary: s.summary }));

  return (
    <>
      <PageHero kicker={d.nav.discover} title={d.home.heroTitle} sub={d.home.heroSub} />

      <Section className="py-16">
        <DiscoveryWidget locale={locale} dict={d} services={serviceLite} />
      </Section>

      {/* service matrix */}
      <div className="border-y border-line/60 bg-coal/30">
        <Section className="py-20">
          <Reveal>
            <SectionHeading kicker="Service matrix" title={d.home.matrixTitle} sub={d.home.matrixSub} />
          </Reveal>
          <Reveal delay={60}>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="bg-coal">
                    <th className="px-5 py-4 text-start font-display text-xs uppercase tracking-wider text-mute">Need</th>
                    {matrixColumns.map((c) => (
                      <th key={c} className="px-3 py-4 text-center font-display text-xs uppercase tracking-wider text-mute">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixNeeds.map((row) => (
                    <tr key={row.need} className="border-t border-line/60 bg-ink/40">
                      <td className="px-5 py-4 font-medium">{row.need}</td>
                      {matrixColumns.map((col) => (
                        <td key={col} className="px-3 py-4 text-center">
                          {row.services.includes(col) ? <span className="text-accent" aria-label="yes">✓</span> : <span className="text-line">·</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-6 text-sm text-mute">{d.common.notSure}</p>
        </Section>
      </div>

      {/* concierge */}
      <Section className="py-20">
        <Reveal>
          <SectionHeading kicker="AI Concierge" title="Tell us what you're working on." sub="Chat with the concierge — five questions, a free-text brain-dump, and a recommended approach with phases, risks and open questions." />
        </Reveal>
        <Reveal delay={60}>
          <ConciergeChat locale={locale} dict={d} />
        </Reveal>
      </Section>

      {/* stages + framework */}
      <div className="border-t border-line/60 bg-coal/30">
        <Section className="py-20">
          <Reveal>
            <SectionHeading kicker={d.nav.map} title="Eight stages. One path." sub="From idea to growth — every stage mapped to the work that moves you forward." />
          </Reveal>
          <Reveal delay={60}>
            <div className="flex flex-wrap items-center gap-2">
              {stages.map((s, i) => (
                <span key={s.slug} className="flex items-center gap-2">
                  <span className="rounded-full border border-line bg-coal px-4 py-2 font-display text-sm font-semibold">{s.name}</span>
                  {i < stages.length - 1 ? <span className="text-accent">→</span> : null}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {createFramework.map((f) => (
                <Card key={f.letter} className="text-center">
                  <span className="font-display text-3xl font-bold text-accent">{f.letter}</span>
                  <p className="mt-2 font-display text-sm font-semibold">{f.word}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mute">{f.desc}</p>
                </Card>
              ))}
          </div>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={p("map")}>{d.nav.map} →</Btn>
            <Btn href={p("tools/brief-builder")} variant="ghost">{d.common.start}</Btn>
          </div>
        </Section>
      </div>
    </>
  );
}
