import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getSystemStatus } from "@/lib/status";
import { Badge, Card, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { cx } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Status({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const { checks, checkedAt, allOperational } = await getSystemStatus();

  return (
    <>
      <PageHero kicker="System status" title="All systems, honestly" sub="Live checks, run the moment you loaded this page. If something is degraded, it says so here." />
      <Section className="py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Badge accent={allOperational}>{allOperational ? "● All systems operational" : "● Partial degradation"}</Badge>
          <span className="font-mono text-[11px] text-mute">checked {new Date(checkedAt).toLocaleTimeString()} · <a href={localePath(locale, "status")} className="hover:text-accent">re-check</a></span>
        </div>
        <div className="space-y-3">
          {checks.map((check, i) => (
            <Reveal key={check.name} delay={i * 40}>
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-base font-semibold">{check.name}</span>
                  <span className="inline-flex items-center gap-2 font-mono text-xs">
                    <span className={cx("size-2 rounded-full", check.state === "operational" ? "bg-accent" : check.state === "degraded" ? "bg-yellow-300" : "bg-mute")} />
                    <span className={check.state === "operational" ? "text-accent" : check.state === "degraded" ? "text-yellow-200" : "text-mute"}>
                      ● {check.state}
                    </span>
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-mute">{check.note}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 font-mono text-[11px] text-mute/60">Machine-readable: /api/status · incidents appear here and in The Brief.</p>
      </Section>
    </>
  );
}
