import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { episodes, getEpisode } from "@/lib/data/podcast";
import { site } from "@/lib/data/site";
import { Badge, Btn, Card, CheckList, Icon, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return episodes.flatMap((e) => ["en", "de", "ja", "fr", "nl", "ar", "es"].map((locale) => ({ locale, slug: e.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ep = getEpisode(slug);
  return { title: ep ? `EP ${String(ep.number).padStart(3, "0")} — ${ep.title}` : "Episode" };
}

export default async function EpisodePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const ep = getEpisode(slug);
  if (!ep) notFound();
  const next = episodes.find((e) => e.number === ep.number + 1);

  return (
    <>
      <PageHero kicker={`Podcast · EP ${String(ep.number).padStart(3, "0")} · ${ep.date}`} title={ep.title} sub={`${ep.guest} — ${ep.role}`} />
      <Section className="py-16">
        <Reveal>
          <Card className="border-accent/30">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <button type="button" className="inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-display text-sm font-bold text-accent-ink" aria-label="Play episode">
                <Icon name="play" className="size-4" /> {d.common.listen}
              </button>
              <div className="w-full flex-1">
                <div className="flex h-10 items-end gap-1" aria-hidden="true">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const h = 15 + Math.abs(Math.sin(i * 0.55)) * 100;
                    return <span key={i} className="w-1.5 rounded-full bg-accent/70" style={{ height: `${h}%` }} />;
                  })}
                </div>
                <p className="mt-2 font-mono text-xs text-mute">00:00 / {ep.duration} · {ep.date}</p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mute">{ep.teaser}</p>
            <blockquote className="mt-5 border-s-2 border-accent ps-4 font-display text-xl font-medium">“{ep.quote}”</blockquote>
          </Card>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <div>
              <h2 className="font-display text-xl font-bold">Show notes</h2>
              <div className="mt-5"><CheckList items={ep.showNotes} /></div>
              <div className="mt-8 flex flex-wrap gap-2">
                {ep.topics.map((t) => <Badge key={t}>{t}</Badge>)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="space-y-4">
              <Card>
                <p className="kicker mb-3">Subscribe</p>
                <div className="flex flex-wrap gap-2">
                  {site.socials.filter((s) => ["Spotify", "Apple Podcasts", "YouTube"].includes(s.label)).map((s) => (
                    <a key={s.label} href={s.href} className="rounded-full border border-line px-4 py-2 text-xs text-mute hover:border-accent/40 hover:text-accent">{s.label}</a>
                  ))}
                </div>
              </Card>
              {next ? (
                <Link href={p(`podcast/${next.slug}`)}>
                  <Card hover>
                    <p className="kicker">Next episode</p>
                    <h3 className="mt-2 font-display text-base font-bold group-hover:text-accent">{next.title}</h3>
                  </Card>
                </Link>
              ) : null}
              <Btn href={p("podcast")} variant="ghost" className="w-full">{d.common.viewAll} →</Btn>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
