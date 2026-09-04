import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getPost, posts } from "@/lib/data/knowledge";
import { Badge, Btn, PageHero, Section } from "@/components/ui";
import { NewsletterForm } from "@/components/forms";

export function generateStaticParams() {
  return posts.flatMap((p) => ["en", "de", "ja", "fr", "nl", "ar", "es"].map((locale) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const post = getPost(slug);
  if (!post) notFound();
  const others = posts.filter((x) => x.slug !== slug).slice(0, 2);

  return (
    <>
      <PageHero kicker={`${post.kicker} · ${post.date} · ${post.minutes} ${d.common.minutes}`} title={post.title} sub={post.excerpt} />
      <Section className="py-16">
        <div className="max-w-2xl">
          <article className="prose-flag">
            {post.body.map((block, i) =>
              block.startsWith("## ") ? (
                <h2 key={i}>{block.replace("## ", "")}</h2>
              ) : block.startsWith("- ") ? (
                <ul key={i}>
                  {block.split("\n").map((line) => line.replace(/^- /, "").replace(/\*\*/g, "")).map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              ) : (
                <p key={i}>{block.replace(/\*\*/g, "")}</p>
              )
            )}
          </article>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.topics.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>

          <div className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8">
            <p className="font-display text-xl font-bold">{d.home.newsletterTitle}</p>
            <p className="mt-2 text-sm text-mute">{d.home.newsletterDesc}</p>
            <div className="mt-4"><NewsletterForm dict={d} /></div>
          </div>

          <div className="mt-14">
            <p className="kicker mb-4">{d.common.readMore}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {others.map((o) => (
                <Link key={o.slug} href={p(`insights/${o.slug}`)}>
                  <div className="card-hover rounded-2xl border border-line bg-coal p-5">
                    <p className="font-mono text-xs text-accent">{o.kicker}</p>
                    <h3 className="mt-2 font-display text-base font-bold">{o.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-10"><Btn href={p("insights")} variant="ghost">← {d.nav.insights}</Btn></div>
        </div>
      </Section>
    </>
  );
}
