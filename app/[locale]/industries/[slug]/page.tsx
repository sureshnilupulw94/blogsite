import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getIndustry, industries } from "@/lib/data/industries";
import { getService } from "@/lib/data/services";
import { cases } from "@/lib/data/work";
import { Badge, Btn, Card, CheckList, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return industries.flatMap((i) => ["en", "de", "ja", "fr", "nl", "ar", "es"].map((locale) => ({ locale, slug: i.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  return { title: ind ? ind.name : "Industry" };
}

export default async function IndustryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const ind = getIndustry(slug);
  if (!ind) notFound();

  const relatedCases = cases.filter((c) => c.industry.toLowerCase().includes(ind.name.split(" ")[0].toLowerCase()));
  const others = industries.filter((i) => i.slug !== slug).slice(0, 6);

  return (
    <>
      <PageHero kicker={d.nav.industries} title={ind.name} sub={ind.blurb} />
      <Section className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading title="What goes wrong" sub="The problems we see in this industry, again and again." />
              <ul className="space-y-3">
                {ind.challenges.map((c) => (
                  <li key={c} className="rounded-xl border border-line bg-coal p-4 text-sm text-mute"><span className="me-2 text-red-400/80">✕</span>{c}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div>
              <SectionHeading title="What we do about it" />
              <CheckList items={ind.whatWeDo} />
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn href={p("tools/brief-builder")}>{d.common.start}</Btn>
                <Btn href={p("contact")} variant="ghost">{d.common.contactUs}</Btn>
              </div>
            </div>
          </Reveal>
        </div>

        {relatedCases.length ? (
          <div className="mt-16">
            <SectionHeading kicker={d.nav.work} title={`${ind.name} work`} />
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedCases.map((c) => (
                <Link key={c.slug} href={p(`work/${c.slug}`)}><Card hover><Badge>{c.industry}</Badge><h3 className="mt-3 font-display text-lg font-bold">{c.client}</h3><p className="mt-2 text-sm text-mute">{c.outcome}</p></Card></Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-16">
          <p className="kicker mb-4">Other industries</p>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link key={o.slug} href={p(`industries/${o.slug}`)} className="rounded-full border border-line px-4 py-2 text-xs text-mute hover:border-accent/40 hover:text-accent">{o.name}</Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
