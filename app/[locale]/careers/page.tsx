import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { jobs, values } from "@/lib/data/company";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Careers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker={d.nav.careers} title="Could you make this place better?" sub="That's the interview question. If you have an answer, we want to hear it." />
      <Section className="py-16">
        <Reveal>
          <SectionHeading kicker="Open roles" title="What we're building with" />
        </Reveal>
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <Reveal key={job.title} delay={i * 40}>
              <Card hover>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-display text-xl font-bold">{job.title}</h2>
                  <Badge>{job.type}</Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-mute">{job.blurb}</p>
                <div className="mt-5"><Btn href={localePath(locale, "contact")} variant="ghost">Apply — tell us what you'd improve</Btn></div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 40}>
              <Card>
                <h3 className="font-display text-base font-bold text-accent">{v.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-mute">{v.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-line bg-coal p-8 text-center">
          <p className="font-display text-xl font-bold">No role that fits?</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">Introduce yourself anyway. The freelance network is always open, and roles appear when people do.</p>
          <div className="mt-5"><Btn href={localePath(locale, "contact")}>{d.common.contactUs}</Btn></div>
        </div>
      </Section>
    </>
  );
}
