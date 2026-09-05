import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { roadmap } from "@/lib/data/company";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

const experiments = [
  { title: "Brand Brain v2", tag: "AI", desc: "Multi-client knowledge bases with per-brand retrieval — one question, one approved answer." },
  { title: "Brief → Proposal pipeline", tag: "Automation", desc: "How much of a proposal can be responsibly generated from a structured brief? Current answer: ~70%." },
  { title: "This website", tag: "Prototype", desc: "The site you're on is itself a lab experiment: 7 locales, RTL, zero-JS-first, rule-based concierge." },
  { title: "Content repurposing grid", tag: "Workflow", desc: "One research report → nine outputs. Being tested on our own podcast." },
  { title: "Assessment scoring models", tag: "Research", desc: "Dimension weighting that survives contact with real businesses." },
  { title: "Voice-first briefs", tag: "AI", desc: "Dictate a brief, get structure back. Early, promising, occasionally hilarious." },
];

export default async function Lab({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker={d.nav.lab} title="Where we try things" sub="AI, design, automation and research experiments — published as they fail and succeed. These people are actually experimenting." />
      <Section className="py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {experiments.map((exp, i) => (
            <Reveal key={exp.title} delay={i * 40}>
              <Card hover className="h-full">
                <Badge accent>{exp.tag}</Badge>
                <h2 className="mt-3 font-display text-lg font-bold">{exp.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mute">{exp.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <Reveal>
            <SectionHeading kicker="What we're building" title="Public roadmap" sub="The platform's own development, in the open." />
          </Reveal>
          <div className="space-y-3">
            {roadmap.map((item, i) => (
              <Reveal key={item.title} delay={i * 30}>
                <div className="flex items-start gap-4 rounded-xl border border-line bg-coal p-5">
                  <span className={
                    item.status === "done" ? "text-accent" : item.status === "doing" ? "text-sky" : "text-mute"
                  }>{item.status === "done" ? "✓" : item.status === "doing" ? "→" : "○"}</span>
                  <div>
                    <p className="font-display text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-mute">{item.desc}</p>
                  </div>
                  <span className="ms-auto font-mono text-[10px] uppercase tracking-widest text-mute">{item.status}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8"><Btn href={p("roadmap")}>Full roadmap →</Btn></div>
        </div>
      </Section>
    </>
  );
}
