import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ideas } from "@/lib/data/podcast";
import { Btn, PageHero, Section } from "@/components/ui";
import { NewsletterForm } from "@/components/forms";
import Reveal from "@/components/Reveal";

export default async function Ideas({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker={d.nav.ideas} title="Short observations" sub="Not articles. Not news. Arguments we'd defend in a meeting — each one a way we actually think." />
      <Section className="py-16">
        <div className="space-y-4">
          {ideas.map((idea, i) => (
            <Reveal key={i} delay={i * 30}>
              <blockquote className="rounded-2xl border border-line bg-coal p-6 sm:p-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-display text-xl font-medium leading-snug sm:text-2xl">{idea}</p>
                </div>
              </blockquote>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <p className="font-display text-2xl font-bold">{d.home.newsletterTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">{d.home.newsletterDesc}</p>
          <div className="mt-5 flex justify-center"><NewsletterForm dict={d} /></div>
        </div>
        <div className="mt-10 text-center">
          <Btn href={localePath(locale, "insights")} variant="ghost">{d.nav.insights} →</Btn>
        </div>
      </Section>
    </>
  );
}
