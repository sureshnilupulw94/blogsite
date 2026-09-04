import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { capabilities, capabilityFamilies } from "@/lib/data/services";
import { Badge, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Capabilities({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero kicker={d.nav.capabilities} title="Capability Library" sub="Everything the studio can do — browsable, combinable, and honest about where one discipline ends and another begins." />
      <Section className="py-16">
        <div className="space-y-14">
          {capabilityFamilies.map((family, fi) => (
            <Reveal key={family} delay={fi * 40}>
              <div>
                <div className="mb-5 flex items-center gap-4">
                  <h2 className="font-display text-2xl font-bold">{family}</h2>
                  <div className="h-px flex-1 bg-line" />
                  <Badge>{capabilities.filter((c) => c.family === family).length} capabilities</Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {capabilities.filter((c) => c.family === family).map((cap) => (
                    <Link key={cap.slug} href={p(`capabilities/${cap.slug}`)} className="group block h-full">
                      <div className="card-hover h-full rounded-2xl border border-line bg-coal p-5">
                        <h3 className="font-display text-base font-semibold group-hover:text-accent">{cap.title}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-mute">{cap.blurb}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
