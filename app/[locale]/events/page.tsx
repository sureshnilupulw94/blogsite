import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { events } from "@/lib/data/company";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { MiniCapture } from "@/components/forms";
import Reveal from "@/components/Reveal";

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero
        kicker="Workshops & sessions"
        title="Learn it, then keep it"
        sub="Open sessions anyone can join — and private programs for teams that want the capability in-house. Practical, artefact-driven, no theory walls."
      />
      <Section className="py-16">
        <Reveal>
          <SectionHeading kicker="Open sessions" title="What's running" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((e, i) => (
            <Reveal key={e.title} delay={i * 50}>
              <Card hover className="flex h-full flex-col">
                <div className="flex items-baseline justify-between gap-3">
                  <Badge accent>{e.type}</Badge>
                  <span className="font-mono text-xs text-mute">{e.when}</span>
                </div>
                <h2 className="mt-4 font-display text-xl font-bold">{e.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{e.blurb}</p>
                <div className="mt-5">
                  <MiniCapture dict={d} cta="Register interest" payload={{ type: "event", event: e.title }} />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <Reveal>
            <SectionHeading kicker="Private programs" title="For teams" sub="The same material, shaped around your real work — your documents, your decks, your processes. Corporate training from 5 to 50 people, remote or Colombo-based." />
          </Reveal>
          <div className="mt-2 flex flex-wrap gap-3">
            <Btn href={p("contact")}>Ask about corporate training</Btn>
            <Btn href={p("services/training")} variant="ghost">{d.nav.services}: Training →</Btn>
          </div>
        </div>
      </Section>
    </>
  );
}
