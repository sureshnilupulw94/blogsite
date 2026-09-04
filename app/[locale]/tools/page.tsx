import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { assessments, calculators } from "@/lib/data/tools";
import { Badge, Btn, Card, Icon, PageHero, Section, SectionHeading, cx } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Tools({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker={d.nav.tools} title="Free tools" sub={d.home.toolsSub} />
      <Section className="py-16">
        <Reveal>
          <SectionHeading kicker="Assessments" title="How ready are you?" sub="Honest scoring across the dimensions that matter. Report at the end, roadmap if you want it." />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {assessments.map((a, i) => (
            <Reveal key={a.slug} delay={i * 60}>
              <Link href={p(`tools/${a.slug}`)} className="group block h-full">
                <Card hover className="h-full">
                  <div className="flex items-start justify-between">
                    <Icon name="target" className="size-7 text-mute group-hover:text-accent" />
                    <Badge>{a.kicker}</Badge>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold group-hover:text-accent">{a.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{a.intro}</p>
                  <p className="mt-4 font-mono text-xs text-accent">{a.questions.length} questions → {a.dimensions.length} dimensions</p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <SectionHeading kicker="Calculators" title="What's it worth?" sub="Estimates you can argue with internally — assumptions shown, maths included." />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {calculators.map((c, i) => (
              <Reveal key={c.slug} delay={i * 50}>
                <Link href={p(`tools/${c.slug}`)} className="group block h-full">
                  <Card hover className="h-full">
                    <div className="flex items-start justify-between">
                      <Icon name="chart" className="size-7 text-mute group-hover:text-accent" />
                      <Badge>{c.kicker}</Badge>
                    </div>
                    <h2 className="mt-4 font-display text-lg font-bold group-hover:text-accent">{c.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{c.intro}</p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <SectionHeading kicker="Mini audits" title="Audit what you have" sub="Four free audits: one live (your website, actually fetched), three honest questionnaires. Findings and fixes included." />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { slug: "website-audit", name: "Website Audit", desc: "We fetch your page and run 14 checks — SEO, content, UX, conversion.", accent: true },
              { slug: "presentation-audit", name: "Presentation Audit", desc: "Readability, storytelling, hierarchy, consistency — scored with fixes.", accent: false },
              { slug: "brand-audit", name: "Brand Audit", desc: "Consistency, messaging, visual identity and asset health.", accent: false },
              { slug: "process-audit", name: "Business Process Audit", desc: "Maturity, bottlenecks, automation readiness, documentation.", accent: false },
            ].map((a, i) => (
              <Reveal key={a.slug} delay={i * 50}>
                <Link href={p(`tools/${a.slug}`)} className="group block h-full">
                  <Card hover className={cx("h-full", a.accent && "border-accent/40 bg-accent/5")}>
                    <div className="flex items-start justify-between">
                      <Icon name={a.accent ? "globe" : "target"} className={cx("size-7", a.accent ? "text-accent" : "text-mute group-hover:text-accent")} />
                      <Badge>Live{a.accent ? "" : " questionnaire"}</Badge>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold group-hover:text-accent">{a.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{a.desc}</p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <SectionHeading kicker="Generators" title="Structure your thinking" />
          </Reveal>
          <Reveal delay={60}>
            <Link href={p("tools/brief-builder")} className="group block">
              <Card hover className="border-accent/40 bg-accent/5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <Icon name="spark" className="size-7 text-accent" />
                    <h2 className="mt-3 font-display text-xl font-bold text-accent">Project Brief Generator</h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">Ten guided steps — objective, problem, materials, success, services, timeline, budget — compiled into a structured brief you can send to any team. Including ours.</p>
                  </div>
                  <span className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">{d.common.start}</span>
                </div>
              </Card>
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 rounded-2xl border border-line bg-coal p-8 text-center">
          <p className="font-display text-lg font-bold">Tools in the lab</p>
          <p className="mt-2 text-sm text-mute">Content calendar builder · upload→analyze document review — see the <Link href={p("roadmap")} className="text-accent hover:underline">roadmap</Link>.</p>
        </div>
      </Section>
    </>
  );
}
