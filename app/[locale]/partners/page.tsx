import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { partnerTypes, expertNetwork } from "@/lib/data/company";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Partners({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker={d.nav.partners} title="Need capabilities we don't provide?" sub="We'd rather connect you to the right people than stretch to be all of them. That's what the network is for." />
      <Section className="py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {partnerTypes.map((t, i) => (
            <Reveal key={t.title} delay={i * 50}>
              <Card hover className="h-full">
                <Badge>{t.title}</Badge>
                <p className="mt-4 text-sm leading-relaxed text-mute">{t.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <SectionHeading title="Join the network" sub="Senior independents and firms who'd rather collaborate than compete." />
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {expertNetwork.map((n) => (
              <span key={n} className="rounded-full border border-line bg-coal px-5 py-2.5 text-sm text-mute">{n}</span>
            ))}
          </div>
          <div className="mt-8"><Btn href={localePath(locale, "contact")}>Apply as a partner</Btn></div>
        </div>
      </Section>
    </>
  );
}
