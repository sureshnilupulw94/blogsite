import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { episodes } from "@/lib/data/podcast";
import { site } from "@/lib/data/site";
import { Badge, Btn, Card, Icon, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Podcast({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const [latest, ...rest] = episodes;

  return (
    <>
      <PageHero kicker={d.home.podcastTitle} title="Signal, not noise." sub={d.home.podcastSub} />
      <Section className="py-16">
        <Reveal>
          <Card className="border-accent/40 bg-accent/5">
            <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
              <div className="grid aspect-square w-full max-w-56 place-items-center rounded-2xl bg-ink">
                <svg viewBox="0 0 100 100" className="w-full p-6" aria-hidden="true">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const h = 8 + Math.abs(Math.sin(i * 0.7)) * 34;
                    return <rect key={i} x={i * 3.6 + 2} y={50 - h / 2} width="1.8" height={h} rx="0.9" fill={i % 7 === 3 ? "#7DD3FC" : "#D6FF3F"} opacity={0.35 + (i % 5) * 0.13} />;
                  })}
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <Badge accent>Latest · EP {String(latest.number).padStart(3, "0")}</Badge>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight">{latest.title}</h2>
                <p className="mt-2 text-sm text-mute">{latest.guest} · {latest.role}</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute">{latest.teaser}</p>
                <blockquote className="mt-5 border-s-2 border-accent ps-4 font-display text-lg font-medium">“{latest.quote}”</blockquote>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Btn href={p(`podcast/${latest.slug}`)}><Icon name="play" className="size-4" /> {d.common.listen}</Btn>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-mono text-xs text-mute"><Icon name="clock" className="size-4" /> {latest.duration}</span>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {rest.map((ep, i) => (
            <Reveal key={ep.slug} delay={i * 50}>
              <Link href={p(`podcast/${ep.slug}`)} className="group block h-full">
                <Card hover className="h-full">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-accent">EP {String(ep.number).padStart(3, "0")}</span>
                    <span className="flex items-center gap-1.5 font-mono text-xs text-mute"><Icon name="clock" className="size-3.5" />{ep.duration}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold group-hover:text-accent">{ep.title}</h3>
                  <p className="mt-1 text-xs text-mute">{ep.guest} · {ep.role}</p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-mute">{ep.teaser}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {ep.topics.map((t) => <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute">{t}</span>)}
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-3">
          <span className="kicker">Subscribe</span>
          {site.socials.filter((s) => ["Spotify", "Apple Podcasts", "YouTube"].includes(s.label)).map((s) => (
            <a key={s.label} href={s.href} className="rounded-full border border-line px-5 py-2.5 text-xs text-mute transition-colors hover:border-accent/40 hover:text-accent">{s.label}</a>
          ))}
          <span className="text-xs text-mute/60">— or be a guest:</span>
          <Btn href={p("contact")} variant="ghost">Pitch us</Btn>
        </div>
      </Section>
    </>
  );
}
