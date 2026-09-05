import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { team } from "@/lib/data/company";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { MiniCapture } from "@/components/forms";
import Reveal from "@/components/Reveal";

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero
        kicker="Team directory"
        title="The people, the rates, no guessing"
        sub="Four crafts, one operating system. Book a person directly or bundle them into a team engagement — the rate card is public because clear pricing is a clarity deliverable too."
      />

      <Section className="py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 50}>
              <Card hover className="h-full">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-lg font-bold">{member.name}</h2>
                  <Badge>{member.role}</Badge>
                </div>
                <p className="mt-3 text-sm text-mute">{member.what}</p>
                <div className="mt-4 flex items-end justify-between gap-4 rounded-xl border border-line bg-carbon/60 p-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Rate card</p>
                    <p className="mt-1 font-display text-2xl font-bold text-accent">
                      ${member.rate.usd}<span className="text-sm font-normal text-mute">/{member.rate.unit}</span>
                    </p>
                  </div>
                  <p className="max-w-[60%] text-right text-xs leading-relaxed text-mute">{member.rateNote}</p>
                </div>
                <p className="mt-4 text-sm"><span className="font-mono text-[10px] uppercase tracking-widest text-mute">Ask me about · </span><span className="text-accent">{member.ask}</span></p>
                <div className="mt-5 border-t border-line pt-4">
                  <MiniCapture dict={d} cta={`Book ${member.name.replace("The ", "")}`} payload={{ type: "booking", person: member.name }} />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 rounded-2xl border border-line bg-coal/60 p-6 sm:p-8">
            <SectionHeading
              kicker="How billing works"
              title="Simple, like it should be"
            />
            <div className="mt-5 grid gap-4 text-sm text-mute sm:grid-cols-3">
              <div><p className="font-display text-base font-bold text-paper">Estimate first</p><p className="mt-1 leading-relaxed">Every booking starts with a fixed estimate — hours, outcomes, date. No open meters.</p></div>
              <div><p className="font-display text-base font-bold text-paper">Bundles beat hours</p><p className="mt-1 leading-relaxed">Packages and Agency+ membership discount these rates up to 30% — see the pricing page.</p></div>
              <div><p className="font-display text-base font-bold text-paper">Time reported</p><p className="mt-1 leading-relaxed">Client portals show time logged against your project, line by line. Nothing hidden.</p></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn href={p("/packages")}>Packages & retainers</Btn>
              <Btn href={p("/contact")} variant="ghost">Request a booking</Btn>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
