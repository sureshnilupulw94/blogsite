import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { team, values, expertNetwork, events } from "@/lib/data/company";
import { site } from "@/lib/data/site";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker={d.nav.about} title={site.fullBrand} sub={`${site.tagline} A podcast that became a studio: writing, design, digital, strategy, transformation and AI — held together by one idea: ${site.philosophy.toLowerCase()}`} />
      <Section className="py-16">
        <Reveal>
          <SectionHeading kicker="Values" title="What we optimise for" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 50}>
              <Card hover className="h-full">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{v.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <Reveal>
            <SectionHeading kicker="Team" title="Meet the studio" sub="Not portraits and job titles — what each person actually does, obsesses over, and can be asked about." />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 50}>
                <Card hover className="h-full">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-bold">{member.name}</h3>
                    <Badge>{member.role}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-mute">{member.what}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div><dt className="inline font-mono text-[10px] uppercase tracking-widest text-mute">Obsesses over · </dt><dd className="inline text-mute">{member.obsess}</dd></div>
                    <div><dt className="inline font-mono text-[10px] uppercase tracking-widest text-mute">Favourite project · </dt><dd className="inline text-mute">{member.fav}</dd></div>
                    <div><dt className="inline font-mono text-[10px] uppercase tracking-widest text-mute">Philosophy · </dt><dd className="inline text-mute">{member.philosophy}</dd></div>
                    <div><dt className="inline font-mono text-[10px] uppercase tracking-widest text-mute">Ask me about · </dt><dd className="inline text-accent">{member.ask}</dd></div>
                  </dl>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <Reveal>
            <SectionHeading kicker="Network" title="The expert network" sub="Not every capability needs to be in-house. A vetted roster scales the studio without diluting it." />
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {expertNetwork.map((n) => (
              <span key={n} className="rounded-full border border-line bg-coal px-5 py-2.5 text-sm text-mute">{n}</span>
            ))}
          </div>
          <div className="mt-6"><Btn href={p("partners")} variant="ghost">{d.nav.partners} →</Btn></div>
        </div>

        <div className="mt-20">
          <Reveal>
            <SectionHeading kicker="Events & training" title="Workshops & sessions" sub="Open sessions anyone can join — plus custom corporate programs." />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((e, i) => (
              <Reveal key={e.title} delay={i * 40}>
                <Card hover>
                  <div className="flex items-baseline justify-between">
                    <Badge accent>{e.type}</Badge>
                    <span className="font-mono text-xs text-mute">{e.when}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold">{e.title}</h3>
                  <p className="mt-2 text-sm text-mute">{e.blurb}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-6"><Btn href={p("contact")}>Ask about corporate training</Btn></div>
        </div>
      </Section>
    </>
  );
}
