import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getLegalDoc, legalDocs } from "@/lib/data/legal";
import { PageHero, Section } from "@/components/ui";

export function generateStaticParams() {
  return legalDocs.flatMap((doc) => ["en", "de", "ja", "fr", "nl", "ar", "es"].map((locale) => ({ locale, slug: doc.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  return { title: doc ? doc.title : "Legal" };
}

export default async function LegalDocPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  const others = legalDocs.filter((x) => x.slug !== slug);

  return (
    <>
      <PageHero kicker={`Trust centre · Updated ${doc.updated}`} title={doc.title} />
      <Section className="py-16">
        <div className="max-w-2xl">
          {doc.sections.map((section) => (
            <section key={section.h} className="mb-10">
              <h2 className="font-display text-xl font-bold">{section.h}</h2>
              {section.p.map((para, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-mute">{para}</p>
              ))}
            </section>
          ))}
          <div className="mt-12 border-t border-line pt-8">
            <p className="kicker mb-4">{d.nav.legal}</p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={localePath(locale, `legal/${o.slug}`)} className="text-xs text-mute hover:text-accent">{o.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
