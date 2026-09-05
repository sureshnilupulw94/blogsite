import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { cases, getCase } from "@/lib/data/work";
import { getService } from "@/lib/data/services";
import { Badge, Btn, Card, CheckList, PageHero, Section, SectionHeading, Stat } from "@/components/ui";
import BeforeAfter from "@/components/BeforeAfter";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return cases.flatMap((c) => ["en", "de", "ja", "fr", "nl", "ar", "es"].map((locale) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  return { title: c ? `${c.client} case study` : "Case study" };
}

export default async function CasePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const c = getCase(slug);
  if (!c) notFound();

  return (
    <>
      <PageHero kicker={`${c.industry} · Case study`} title={c.client} sub={c.outcome} />
      <Section className="py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {c.metrics.map((m) => <Stat key={m.label} value={m.value} label={m.label} />)}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="The challenge" />
            <p className="text-sm leading-relaxed text-mute">{c.challenge}</p>
            <div className="mt-10">
              <SectionHeading title="The transformation" />
            </div>
            <BeforeAfter dict={d} before={c.before} after={c.after} beforeTitle="Before" afterTitle="After" />
          </div>
          <div>
            <SectionHeading title="The approach" />
            <ol className="space-y-4">
              {c.approach.map((a, i) => (
                <li key={a} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-accent/40 font-mono text-xs text-accent">0{i + 1}</span>
                  <p className="pt-1.5 text-sm leading-relaxed text-mute">{a}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <SectionHeading title="Lessons" />
              <CheckList items={c.lessons} />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeading title="Why these decisions?" sub="Every portfolio piece has reasoning behind it — ask us about any of them." />
          <div className="grid gap-4 sm:grid-cols-3">
            {["Why this structure?", "Why this hierarchy?", "Why this system?"].map((q) => (
              <Card key={q}><p className="font-display text-sm font-semibold text-accent">{q}</p><p className="mt-2 text-xs leading-relaxed text-mute">Book a walkthrough — we'll show the rejected directions too.</p></Card>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-3">
          <span className="kicker">Services used</span>
          {c.services.map((s) => (
            <Link key={s} href={p(`services/${s}`)} className="rounded-full border border-line px-4 py-2 text-xs text-mute hover:border-accent/40 hover:text-accent">{getService(s)?.title ?? s}</Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Btn href={p("contact")}>Start something similar</Btn>
        </div>
      </Section>
    </>
  );
}
