import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { packages, retainers, subscription } from "@/lib/data/packages";
import PackagesGrid from "@/components/PackagesGrid";
import { Badge, Btn, Card, CheckList, PageHero, Section, SectionHeading, cx } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Packages({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker="Pricing philosophy" title={d.nav.packages} sub="We don't hide pricing — we publish how we think about it. Scope, complexity, urgency and strategic depth drive the number. Indicative ranges below." />
      <Section className="py-16">
        <Reveal>
          <PackagesGrid locale={locale} dict={d} packages={packages} startLabel={d.common.start} />
        </Reveal>

        <div className="mt-20">
          <Reveal>
            <SectionHeading kicker="Recurring" title={d.nav.retainers} sub="One-time projects become ongoing partnerships — and one predictable fee." />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {retainers.map((r, i) => (
              <Reveal key={r.slug} delay={i * 50}>
                <Card hover className="h-full">
                  <Badge>{r.name}</Badge>
                  <p className="mt-4 font-mono text-sm text-accent">{r.price}</p>
                  <p className="mt-2 text-sm text-mute">{r.blurb}</p>
                  <div className="mt-4"><CheckList items={r.includes} /></div>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-8"><Btn href={p("retainers")} variant="ghost">{d.nav.retainers} →</Btn></div>
        </div>

        <div className="mt-20 rounded-2xl border border-line bg-coal p-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">How we price projects</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Scope", "Number and depth of deliverables — the honest base of every quote."],
                ["Complexity", "Technical integration, stakeholder count, research depth."],
                ["Urgency", "Priority and emergency work requires dedicated capacity — and costs it."],
                ["Revisions", "Structured rounds included; endless loops are a scope change."],
                ["Strategic involvement", "Execution-only is cheaper than thinking-with-you."],
                ["Team & locale", "Senior-led, Colombo-based, worldwide delivery."],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-xl border border-line/60 bg-carbon p-5">
                  <p className="font-display text-sm font-semibold text-accent">{title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-mute">{desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
