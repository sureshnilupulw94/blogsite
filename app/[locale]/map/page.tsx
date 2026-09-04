import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { services } from "@/lib/data/services";
import { stages, createFramework } from "@/lib/data/tools";
import TransformationMap from "@/components/TransformationMap";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker="Signature" title={d.home.mapTitle} sub={d.home.mapSub} />
      <Section className="py-16">
        <TransformationMap locale={locale} dict={d} services={services.map((s) => ({ slug: s.slug, title: s.title, icon: s.icon }))} defaultStage={0} />

        <div className="mt-20">
          <Reveal>
            <SectionHeading kicker="The journey" title="Where are you now?" sub="Pick your stage above — or read the whole path." />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {stages.map((stage, i) => (
              <Reveal key={stage.slug} delay={i * 40}>
                <Card hover>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    <h3 className="font-display text-lg font-bold">{stage.name}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{stage.you}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {stage.we.map((slug) => (
                      <span key={slug} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute">
                        {services.find((s) => s.slug === slug)?.short ?? slug}
                      </span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <Reveal>
            <SectionHeading kicker="Framework" title="The CREATE Framework™" sub="How every Flagship engagement runs — Clarify, Research, Engineer, Activate, Transform, Evolve." />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {createFramework.map((f, i) => (
              <Reveal key={f.letter} delay={i * 50}>
                <Card className="text-center">
                  <span className="font-display text-3xl font-bold text-accent">{f.letter}</span>
                  <p className="mt-2 font-display text-sm font-semibold">{f.word}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mute">{f.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn href={p("tools/transformation-index")}>Take the Transformation Index</Btn>
            <Btn href={p("contact")} variant="ghost">{d.common.contactUs}</Btn>
          </div>
        </div>
      </Section>
      <div className="border-t border-line/60 py-10 text-center">
        <Badge>IDEA → CONFUSION → CLARITY → STRATEGY → CREATION → IMPLEMENTATION → TRANSFORMATION → GROWTH</Badge>
      </div>
    </>
  );
}
