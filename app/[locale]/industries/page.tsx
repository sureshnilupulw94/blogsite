import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { industries } from "@/lib/data/industries";
import { Badge, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker={d.nav.industries} title="Depth, not just breadth" sub="Thirteen industries, each with its own challenges and its own room in the studio." />
      <Section className="py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={(i % 3) * 50}>
              <Link href={localePath(locale, `industries/${ind.slug}`)} className="group block h-full">
                <div className="card-hover h-full rounded-2xl border border-line bg-coal p-6">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-3 font-display text-lg font-bold group-hover:text-accent">{ind.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{ind.blurb}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-12"><Badge>Don't see yours? We've probably worked adjacent — ask.</Badge></div>
      </Section>
    </>
  );
}
