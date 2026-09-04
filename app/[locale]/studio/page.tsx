import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { Badge, Btn, Card, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

const rooms = [
  { title: "Behind the scenes", desc: "How engagements actually run — standups, reviews, the boring magic of checklists." },
  { title: "Design explorations", desc: "Moodboards, type studies, grids. Decisions shown, not just results." },
  { title: "The writing process", desc: "Outlines becoming arguments becoming drafts becoming final copy." },
  { title: "Rejected concepts", desc: "The directions that didn't ship — and why. Often more instructive than the winners." },
  { title: "Finished work", desc: "The polished output, straight from the bench." },
  { title: "Studio culture", desc: "How a distributed team stays coherent: standards, rituals, tools." },
];

export default async function Studio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker={d.nav.studio} title="The room where it's made" sub="The studio is the humanizing layer — process, experiments, and the people behind the polish." />
      <Section className="py-16">
        <Reveal>
          <SectionHeading title="Inside the studio" sub="Six standing rooms. Each one opens as the studio publishes." />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <Reveal key={room.title} delay={i * 50}>
              <Card hover className="h-full">
                <span className="font-mono text-xs text-accent">ROOM {String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-3 font-display text-lg font-bold">{room.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mute">{room.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Badge accent>{d.common.soon}</Badge>
          <p className="text-sm text-mute">Studio posts land in The Brief first.</p>
          <Btn href={localePath(locale, "insights")} variant="ghost">{d.nav.insights} →</Btn>
        </div>
      </Section>
    </>
  );
}
