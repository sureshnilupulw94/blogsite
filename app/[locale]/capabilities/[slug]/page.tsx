import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { capabilities, getCapability, services } from "@/lib/data/services";
import { Badge, Btn, Card, CheckList, PageHero, Section } from "@/components/ui";

export function generateStaticParams() {
  return capabilities.flatMap((c) => ["en", "de", "ja", "fr", "nl", "ar", "es"].map((locale) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cap = getCapability(slug);
  return { title: cap ? `${cap.title} — ${cap.family}` : "Capability" };
}

export default async function CapabilityPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const cap = getCapability(slug);
  if (!cap) notFound();

  const siblings = capabilities.filter((c) => c.family === cap.family && c.slug !== cap.slug);
  const relatedService =
    services.find((s) =>
      cap.family === "Writing" ? s.slug === "writing" :
      cap.family === "Design" ? s.slug === "design" :
      cap.family === "Digital" ? s.slug === "digital" :
      cap.family === "AI" ? s.slug === "ai" : s.slug === "strategy"
    )!;

  return (
    <>
      <PageHero kicker={`${cap.family} · ${d.nav.capabilities}`} title={cap.title} sub={cap.blurb} />
      <Section className="py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold">Includes</h2>
            <div className="mt-5"><CheckList items={cap.includes} /></div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn href={p("tools/brief-builder")}>{d.common.start}</Btn>
              <Btn href={p(`services/${relatedService.slug}`)} variant="ghost">{relatedService.title} →</Btn>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">More in {cap.family}</h2>
            <div className="mt-5 grid gap-3">
              {siblings.map((s) => (
                <Link key={s.slug} href={p(`capabilities/${s.slug}`)} className="group">
                  <Card hover>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-semibold group-hover:text-accent">{s.title}</span>
                      <Badge>{s.family}</Badge>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-mute">{s.blurb}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
