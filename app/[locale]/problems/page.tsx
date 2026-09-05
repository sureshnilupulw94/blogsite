import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { problems } from "@/lib/data/industries";
import { getService } from "@/lib/data/services";
import { Badge, Btn, Card, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function ProblemsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker="Problems we solve" title="Start from what hurts" sub="More useful than a service list: name the problem, see the way out." />
      <Section className="py-16">
        <div className="space-y-6">
          {problems.map((prob, i) => {
            const service = getService(prob.service)!;
            return (
              <Reveal key={prob.slug} delay={i * 40}>
                <article id={prob.slug} className="scroll-mt-24 rounded-2xl border border-line bg-coal p-6 sm:p-10">
                  <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                      <Badge>{`Problem 0${i + 1}`}</Badge>
                      <h2 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl">{prob.headline}</h2>
                      <p className="mt-3 max-w-xl text-base leading-relaxed text-mute">{prob.pain}</p>
                    </div>
                    <div className="rounded-xl border border-line/60 bg-carbon p-5">
                      <p className="kicker mb-3">We help with</p>
                      <ul className="space-y-2">
                        {prob.symptoms.map((sym) => (
                          <li key={sym} className="flex items-center gap-2 text-sm text-mute"><span className="text-accent">✓</span>{sym}</li>
                        ))}
                      </ul>
                      <Link href={p(`services/${service.slug}`)} className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-accent hover:underline">
                        {service.title} →
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-14 text-center">
          <p className="text-sm text-mute">{d.common.notSure}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Btn href={p("discover")}>{d.nav.discover} →</Btn>
            <Btn href={p("tools/transformation-index")} variant="ghost">Take the Index</Btn>
          </div>
        </div>
        <div className="mt-10">
          <Card><p className="text-sm text-mute">Recognise three or more? That's a pattern worth a conversation. <Link href={p("contact")} className="text-accent hover:underline">Talk to us.</Link></p></Card>
        </div>
      </Section>
    </>
  );
}
