import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { resources, glossary } from "@/lib/data/knowledge";
import { Badge, Btn, PageHero, Section, SectionHeading } from "@/components/ui";
import LibraryFilters from "@/components/LibraryFilters";
import Reveal from "@/components/Reveal";

export default async function Library({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker={d.nav.library} title="The Library" sub="Templates, frameworks, checklists, guides and worksheets — the studio's practical output, free to use." />
      <Section className="py-16">
        <LibraryFilters resources={resources} />
        <Btn href={localePath(locale, "tools")} variant="ghost" className="mt-10">Interactive versions live in {d.nav.tools} →</Btn>
      </Section>

      <div className="border-t border-line/60 bg-coal/30">
        <Section className="py-16">
          <Reveal>
            <SectionHeading kicker="Glossary" title="How we speak" sub="Terms this site uses — defined the way we mean them." />
          </Reveal>
          <dl className="grid gap-4 sm:grid-cols-2">
            {glossary.map((g, i) => (
              <Reveal key={g.term} delay={i * 30}>
                <div className="rounded-xl border border-line bg-coal p-5">
                  <dt className="font-display text-sm font-bold text-accent">{g.term}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-mute">{g.def}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <div className="mt-8"><Badge accent>More terms added as the platform grows</Badge></div>
        </Section>
      </div>
    </>
  );
}
