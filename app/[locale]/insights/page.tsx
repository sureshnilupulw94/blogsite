import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { posts } from "@/lib/data/knowledge";
import { Badge, Btn, Card, Icon, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Insights({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const topics = Array.from(new Set(posts.flatMap((post) => post.topics)));

  return (
    <>
      <PageHero kicker={d.nav.insights} title="The Knowledge Hub" sub="Articles, guides, tutorials, frameworks and checklists — the thinking the studio runs on." />
      <Section className="py-16">
        <div className="mb-10 flex flex-wrap gap-2">
          {topics.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 50}>
              <Link href={p(`insights/${post.slug}`)} className="group block h-full">
                <Card hover className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{post.kicker}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-mute"><Icon name="clock" className="size-3" />{post.minutes} {d.common.minutes}</span>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-bold leading-snug group-hover:text-accent">{post.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{post.excerpt}</p>
                  <p className="mt-4 font-mono text-[10px] text-mute/70">{post.date} · {post.topics.join(" · ")}</p>
                </Card>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={150}>
            <Card className="flex h-full flex-col justify-between border-accent/30 bg-accent/5">
              <div>
                <Badge accent>{d.nav.library}</Badge>
                <h2 className="mt-3 font-display text-lg font-bold">Templates, checklists & frameworks</h2>
                <p className="mt-2 text-sm text-mute">The practical companions to these articles — free to use.</p>
              </div>
              <div className="mt-5"><Btn href={p("library")} variant="ghost">{d.nav.library} →</Btn></div>
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
