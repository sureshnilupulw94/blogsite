import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { roadmap } from "@/lib/data/company";
import { Badge, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Roadmap({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  const columns = [
    { key: "done", label: "Shipped", accent: "text-accent", mark: "✓" },
    { key: "doing", label: "In progress", accent: "text-sky", mark: "→" },
    { key: "next", label: "Next up", accent: "text-paper", mark: "○" },
    { key: "later", label: "Later", accent: "text-mute", mark: "○" },
  ];

  return (
    <>
      <PageHero kicker="Building in public" title={d.nav.roadmap} sub="What we're building — the platform's own development, in the open. Suggest, vote, watch." />
      <Section className="py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((col, ci) => (
            <Reveal key={col.key} delay={ci * 60}>
              <div className="rounded-2xl border border-line bg-coal p-5">
                <div className="mb-4 flex items-center gap-2">
                  <span className={col.accent}>{col.mark}</span>
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-mute">{col.label}</h2>
                </div>
                <div className="space-y-3">
                  {roadmap.filter((r) => r.status === col.key).map((item) => (
                    <div key={item.title} className="rounded-xl border border-line/60 bg-carbon p-4">
                      <p className="font-display text-sm font-semibold">{item.title}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-mute">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10"><Badge accent>Suggest a feature via contact — best ideas ship</Badge></div>
      </Section>
    </>
  );
}
