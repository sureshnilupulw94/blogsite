import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { legalDocs } from "@/lib/data/legal";
import { Badge, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function LegalIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker="Trust centre" title={d.nav.legal} sub="Everything legal, in language a person can read. Privacy, terms, AI usage, accessibility — the whole set." />
      <Section className="py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {legalDocs.map((doc, i) => (
            <Reveal key={doc.slug} delay={i * 30}>
              <Link href={localePath(locale, `legal/${doc.slug}`)} className="group block h-full">
                <div className="card-hover h-full rounded-2xl border border-line bg-coal p-6">
                  <Badge>{doc.title}</Badge>
                  <h2 className="mt-3 font-display text-base font-bold group-hover:text-accent">{doc.title}</h2>
                  <p className="mt-2 font-mono text-[10px] text-mute">Updated {doc.updated}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
