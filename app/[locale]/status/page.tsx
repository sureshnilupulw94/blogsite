import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { statusSystems } from "@/lib/data/company";
import { Card, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Status({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker="System status" title="All systems, honestly" sub="If something is degraded, it says so here. No cheerful greens over broken things." />
      <Section className="py-16">
        <div className="space-y-3">
          {statusSystems.map((sys, i) => (
            <Reveal key={sys.name} delay={i * 40}>
              <Card>
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-semibold">{sys.name}</span>
                  <span className="inline-flex items-center gap-2 font-mono text-xs">
                    <span className={sys.state === "operational" ? "size-2 rounded-full bg-accent" : "size-2 rounded-full bg-mute"} />
                    <span className={sys.state === "operational" ? "text-accent" : "text-mute"}>
                      {sys.state === "operational" ? "● Operational" : "○ Planned"}
                    </span>
                  </span>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
