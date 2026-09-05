import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { pressItems, pressKit } from "@/lib/data/company";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Press({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker={d.nav.press} title="Press & media room" sub="Mentions, appearances, and everything you need to write about us." />
      <Section className="py-16">
        <Reveal>
          <SectionHeading title="Recent" />
        </Reveal>
        <div className="space-y-3">
          {pressItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 40}>
              <Card>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-base font-semibold">{item.title}</h2>
                  <span className="font-mono text-xs text-mute">{item.date} · {item.outlet}</span>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <SectionHeading title="Press kit" sub="Downloadable assets for media use." />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pressKit.map((asset, i) => (
              <Reveal key={asset} delay={i * 30}>
                <Card hover>
                  <Badge accent>{d.common.soon}</Badge>
                  <p className="mt-3 font-display text-sm font-semibold">{asset}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-8"><Btn href={localePath(locale, "contact")} variant="ghost">Media enquiries</Btn></div>
        </div>
      </Section>
    </>
  );
}
