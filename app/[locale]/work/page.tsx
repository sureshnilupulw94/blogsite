import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { cases } from "@/lib/data/work";
import { getService } from "@/lib/data/services";
import { Badge, Btn, PageHero, Section, SectionHeading, Stat } from "@/components/ui";
import BeforeAfter from "@/components/BeforeAfter";
import Reveal from "@/components/Reveal";

export default async function Work({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker={d.nav.work} title={d.home.workTitle} sub="Interactive case studies — challenge, strategy, transformation, result. Explore the decisions, not just the outcome." />
      <Section className="py-16">
        <Reveal>
          <SectionHeading title="The universal pattern" sub="Almost every engagement, regardless of industry:" />
        </Reveal>
        <Reveal delay={60}>
          <BeforeAfter dict={d} before={cases[0].before} after={cases[0].after} beforeTitle="Where they started" afterTitle="Where we took them" />
        </Reveal>

        <div className="mt-20 space-y-6">
          {cases.map((c, i) => (
            <Reveal key={c.slug} delay={40}>
              <article className="rounded-2xl border border-line bg-coal p-6 sm:p-10">
                <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge accent>{c.industry}</Badge>
                      {c.services.map((s) => (
                        <Badge key={s}>{getService(s)?.short ?? s}</Badge>
                      ))}
                    </div>
                    <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{c.client}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-mute"><span className="text-accent">Challenge —</span> {c.challenge}</p>
                    <p className="mt-3 text-sm leading-relaxed text-mute"><span className="text-accent">Outcome —</span> {c.outcome}</p>
                    <Link href={p(`work/${c.slug}`)} className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-accent hover:underline">
                      {d.common.explore} case <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                    {c.metrics.map((m) => (
                      <Stat key={m.label} value={m.value} label={m.label} />
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Btn href={p("contact")}>Your case could be next — {d.common.start.toLowerCase()}</Btn>
        </div>
      </Section>
    </>
  );
}
