import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getService, services } from "@/lib/data/services";
import { cases } from "@/lib/data/work";
import { posts } from "@/lib/data/knowledge";
import { Badge, Btn, Card, CheckList, Icon, PageHero, Section, SectionHeading } from "@/components/ui";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return services.flatMap((s) => ["en", "de", "ja", "fr", "nl", "ar", "es"].map((locale) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  return { title: service ? service.title : "Service" };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const service = getService(slug);
  if (!service) notFound();

  const relatedCases = cases.filter((c) => c.services.includes(slug)).slice(0, 2);
  const relatedPosts = posts.filter((post) => post.topics.some((t) => service.short.includes(t) || service.title.toLowerCase().includes(t.toLowerCase()))).slice(0, 2);

  return (
    <>
      <PageHero kicker={d.nav.services} title={service.title} sub={service.summary} />

      <Section className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl font-bold">What you get</h2>
              <div className="mt-5"><CheckList items={service.deliverables} /></div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div>
              <h2 className="font-display text-2xl font-bold">How it runs</h2>
              <ol className="mt-5 space-y-4">
                {service.process.map((step, i) => (
                  <li key={step.step} className="flex gap-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-accent/40 font-mono text-xs text-accent">0{i + 1}</span>
                    <div>
                      <p className="font-display text-sm font-semibold">{step.step}</p>
                      <p className="mt-1 text-sm leading-relaxed text-mute">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        <div className="mt-16">
          <Reveal>
            <SectionHeading title="Common questions" />
          </Reveal>
          <div className="space-y-3">
            {service.faqs.map((faq) => (
              <details key={faq.q} className="acc rounded-xl">
                <summary>{faq.q}</summary>
                <div className="acc-body">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        {relatedCases.length ? (
          <div className="mt-20">
            <Reveal><SectionHeading kicker={d.nav.work} title="Proof" /></Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedCases.map((c) => (
                <Link key={c.slug} href={p(`work/${c.slug}`)} className="group block">
                  <Card hover>
                    <Badge>{c.industry}</Badge>
                    <h3 className="mt-3 font-display text-lg font-bold group-hover:text-accent">{c.client}</h3>
                    <p className="mt-2 text-sm text-mute">{c.outcome}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {relatedPosts.length ? (
          <div className="mt-20">
            <Reveal><SectionHeading kicker={d.nav.insights} title="Related reading" /></Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={p(`insights/${post.slug}`)} className="group block">
                  <Card hover>
                    <p className="font-mono text-xs text-accent">{post.kicker}</p>
                    <h3 className="mt-2 font-display text-lg font-bold group-hover:text-accent">{post.title}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-20 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center sm:p-12">
          <Icon name={service.icon} className="mx-auto size-8 text-accent" />
          <h2 className="mt-4 font-display text-2xl font-bold">Start with a conversation</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-mute">Tell us what you're trying to achieve — we'll shape the approach, not sell you a template.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Btn href={p("tools/brief-builder")}>{d.common.start}</Btn>
            <Btn href={p("contact")} variant="ghost">{d.common.contactUs}</Btn>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-2">
          {services.filter((s) => s.slug !== slug).map((s) => (
            <Link key={s.slug} href={p(`services/${s.slug}`)} className="rounded-full border border-line px-4 py-2 text-xs text-mute transition-colors hover:border-accent/40 hover:text-accent">
              {s.title}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
