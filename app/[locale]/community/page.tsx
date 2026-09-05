import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { Badge, Btn, Card, CheckList, PageHero, Section, SectionHeading } from "@/components/ui";
import { MiniCapture } from "@/components/forms";
import Reveal from "@/components/Reveal";

const PERKS = [
  {
    name: "Office hours",
    cadence: "Twice monthly",
    blurb: "Bring the stuck deck, the messy org chart, the half-built SOP. Thirty minutes, unblocked or your money back — it's free with membership.",
    includes: ["Live group session", "Screen-share surgery", "Recording in the library"],
  },
  {
    name: "The workshop room",
    cadence: "Monthly",
    blurb: "One skill, ninety minutes, a working artefact to take away: a storyline, a voice sheet, an automation. Members vote the topic.",
    includes: ["Hands-on build", "Template included", "Ask-anything Q&A"],
  },
  {
    name: "Members' shelf",
    cadence: "Always on",
    blurb: "Early access to everything the studio publishes — frameworks, research drafts, prompt packs — plus the archive of every session.",
    includes: ["Research previews", "Session archive", "Product betas"],
  },
];

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero
        kicker="Community"
        title="The room around the work"
        sub="Agency+ is more than downloads — it's a working room of operators who believe clarity beats volume. First cohort opens soon; founding members set the agenda."
      />

      <Section className="py-16">
        <Reveal>
          <SectionHeading kicker="What members get" title="Perks with substance, not badges" sub="Every perk exists to move your work forward the same week you use it." />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {PERKS.map((perk, i) => (
            <Reveal key={perk.name} delay={i * 60}>
              <Card hover className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <Badge accent>{perk.cadence}</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{perk.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{perk.blurb}</p>
                <div className="mt-4 flex-1"><CheckList items={perk.includes} /></div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="border-y border-line/60 bg-coal/30">
        <Section className="py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div>
                <SectionHeading
                  kicker="Founding cohort"
                  title="Help us build the room"
                  sub="The first fifty members choose the workshop calendar, get founding pricing locked for life, and get a one-to-one clarity session with the studio."
                />
                <div className="mt-6">
                  <MiniCapture dict={d} cta="Request founding seat" payload={{ type: "community", interest: "founding-cohort" }} />
                </div>
                <p className="mt-4 font-mono text-[11px] text-mute/70">No payment now — we'll email when seats open.</p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <Card className="h-full">
                <Badge accent>Already live</Badge>
                <h3 className="mt-4 font-display text-lg font-bold">Not waiting for the room?</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Membership benefits land monthly, but the library, podcast and knowledge hub are open to everyone today — and Agency+ product access ships immediately on join.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Btn href={p("/products")}>Products & membership</Btn>
                  <Btn href={p("/library")} variant="ghost">The library</Btn>
                </div>
              </Card>
            </Reveal>
          </div>
        </Section>
      </div>

      <Section className="py-16">
        <Reveal>
          <SectionHeading kicker="House rules" title="How we keep the room worth being in" />
        </Reveal>
        <div className="mt-6 grid gap-4 text-sm text-mute md:grid-cols-3">
          <Reveal><Card className="h-full"><p className="font-display text-base font-bold text-paper">Work over opinions</p><p className="mt-2 leading-relaxed">Bring artefacts, not hot takes. Feedback is specific, kind and aimed at the work.</p></Card></Reveal>
          <Reveal delay={60}><Card className="h-full"><p className="font-display text-base font-bold text-paper">Confidential by default</p><p className="mt-2 leading-relaxed">What's shared in the room stays in the room. Client names stay home.</p></Card></Reveal>
          <Reveal delay={120}><Card className="h-full"><p className="font-display text-base font-bold text-paper">Clarity or silence</p><p className="mt-2 leading-relaxed">If a thread can't make something clearer, it rests. Attention is the membership fee.</p></Card></Reveal>
        </div>
      </Section>
    </>
  );
}
