import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { retainers, subscription } from "@/lib/data/packages";
import { Badge, Btn, Card, CheckList, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Retainers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker="Partnership" title={d.nav.retainers} sub="The same team, every month, who knows your business. Retainers turn one-time projects into compounding capability." />
      <Section className="py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {retainers.map((r, i) => (
            <Reveal key={r.slug} delay={i * 50}>
              <Card hover className="h-full">
                <div className="flex items-center justify-between">
                  <Badge>{r.name}</Badge>
                  <span className="font-mono text-sm text-accent">{r.price}</span>
                </div>
                <p className="mt-4 text-sm text-mute">{r.blurb}</p>
                <div className="mt-5"><CheckList items={r.includes} /></div>
                <div className="mt-6"><Btn href={localePath(locale, "contact")} variant="ghost">{d.common.start}</Btn></div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-accent/40 bg-accent/5 p-8 sm:p-12">
          <Reveal>
            <Badge accent>Subscription</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold">{subscription.name}</h2>
            <p className="mt-2 font-display text-lg text-accent">{subscription.pitch}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mute">{subscription.desc}</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <CheckList items={subscription.points} />
              <div className="flex flex-col items-start justify-center gap-4 rounded-xl border border-line bg-coal p-6">
                <p className="font-mono text-2xl text-accent">{subscription.price}</p>
                <Btn href={localePath(locale, "contact")}>Talk to us</Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
