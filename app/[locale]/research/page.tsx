import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { reports } from "@/lib/data/research";
import { posts } from "@/lib/data/knowledge";
import { Badge, Btn, Card, PageHero, Section, SectionHeading, Stat } from "@/components/ui";
import { MiniCapture, NewsletterForm } from "@/components/forms";
import Reveal from "@/components/Reveal";

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const report = reports[0];

  return (
    <>
      <PageHero
        kicker="Agency research"
        title="Research & reports"
        sub="One major study a year, published in the open — plus the continuous thinking in the Knowledge Hub."
      />

      <Section className="py-16">
        <Reveal>
          <Card className="border-accent/40 bg-accent/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Badge accent>Flagship report · {report.year}</Badge>
              <span className="font-mono text-xs text-mute">{report.fieldwork.split(";")[1]?.trim() ?? ""}</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{report.title} {report.year}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">{report.summary}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {report.findings.map((f, i) => (
                <div key={i} className="rounded-xl border border-line bg-coal p-5">
                  <span className="font-mono text-xs text-accent">FINDING 0{i + 1}</span>
                  <p className="mt-2 text-sm leading-relaxed text-paper">{f}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-5">
              {report.contents.map((c, i) => (
                <Stat key={c} value={String(i + 1).padStart(2, "0")} label={c} />
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-accent/40 bg-coal p-6">
              <p className="kicker mb-2">Get the full report</p>
              <p className="text-sm text-mute">Full methodology, sector indices, the 90-day adoption playbook and every chart. Free — we email it to you.</p>
              <MiniCapture dict={d} cta="Send me the report" payload={{ type: "report", report: report.slug }} />
              <p className="mt-3 font-mono text-[11px] text-mute/70">{report.fieldwork}</p>
            </div>
          </Card>
        </Reveal>

        <div className="mt-14">
          <Reveal>
            <SectionHeading kicker="Continuous research" title="From the Knowledge Hub" />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {posts.filter((post) => post.topics.some((t) => ["AI", "Strategy", "Documentation", "Transformation"].includes(t))).slice(0, 3).map((post) => (
              <Card key={post.slug} hover>
                <p className="font-mono text-xs text-accent">{post.kicker}</p>
                <h3 className="mt-2 font-display text-base font-bold">{post.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{post.excerpt.slice(0, 110)}…</p>
              </Card>
            ))}
          </div>
          <div className="mt-6"><Btn href={p("insights")} variant="ghost">{d.nav.insights} →</Btn></div>
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-coal p-8 text-center">
          <p className="font-display text-2xl font-bold">{d.home.newsletterTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">{d.home.newsletterDesc}</p>
          <div className="mt-5 flex justify-center"><NewsletterForm dict={d} /></div>
        </div>
      </Section>
    </>
  );
}
