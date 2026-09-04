import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { services, matrixNeeds, matrixColumns } from "@/lib/data/services";
import { Badge, Btn, Card, Icon, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker={d.nav.services} title="One studio. Seven disciplines." sub="Writing, design, digital, strategy, transformation, AI and media — combined however your project needs them." />
      <Section className="py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 50}>
              <Link href={p(`services/${s.slug}`)} className="group block h-full">
                <Card hover className="h-full">
                  <div className="flex items-start justify-between">
                    <span className="text-mute group-hover:text-accent"><Icon name={s.icon} className="size-7" /></span>
                    <Icon name="arrow" className="size-4 text-mute/40 transition-all group-hover:translate-x-1 group-hover:text-accent rtl:rotate-180" />
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold group-hover:text-accent">{s.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{s.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.deliverables.slice(0, 4).map((del) => (
                      <span key={del} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute">{del}</span>
                    ))}
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <Reveal>
            <SectionHeading kicker="Matrix" title={d.home.matrixTitle} sub={d.home.matrixSub} />
          </Reveal>
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
                        {row.services.includes(col) ? <span className="text-accent">✓</span> : <span className="text-line">·</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <Link href={p("capabilities")} className="group block"><Card hover><Badge>Library</Badge><h3 className="mt-3 font-display text-lg font-bold group-hover:text-accent">{d.nav.capabilities} →</h3><p className="mt-2 text-sm text-mute">Every capability, browsable by family.</p></Card></Link>
          <Link href={p("packages")} className="group block"><Card hover><Badge>{d.nav.packages}</Badge><h3 className="mt-3 font-display text-lg font-bold group-hover:text-accent">{d.nav.packages} & {d.nav.retainers} →</h3><p className="mt-2 text-sm text-mute">Curated scopes and ongoing partnerships.</p></Card></Link>
          <Link href={p("discover")} className="group block"><Card hover><Badge accent>Guided</Badge><h3 className="mt-3 font-display text-lg font-bold group-hover:text-accent">{d.nav.discover} →</h3><p className="mt-2 text-sm text-mute">{d.common.notSure}</p></Card></Link>
        </div>

        <div className="mt-16 text-center">
          <Btn href={p("tools/brief-builder")}><span className="font-display">{d.common.start}</span></Btn>
        </div>
      </Section>
    </>
  );
}
