import Link from "next/link";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { services } from "@/lib/data/services";
import { problems } from "@/lib/data/industries";
import { packages } from "@/lib/data/packages";
import { episodes, ideas } from "@/lib/data/podcast";
import { calculators, assessments } from "@/lib/data/tools";
import { DiscoveryWidget } from "@/components/Discovery";
import TransformationMap from "@/components/TransformationMap";
import BeforeAfter from "@/components/BeforeAfter";
import Reveal from "@/components/Reveal";
import { NewsletterForm } from "@/components/forms";
import { Badge, Btn, Card, Icon, Kicker, Section, SectionHeading, cx } from "@/components/ui";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const serviceLite = services.map((s) => ({ slug: s.slug, title: s.title, short: s.short, icon: s.icon, summary: s.summary }));

  return (
    <>
      {/* ---------- hero + discovery engine ---------- */}
      <div className="grid-bg glow border-b border-line/60">
        <Section className="pb-20 pt-32 sm:pt-40">
          <div className="max-w-3xl">
            <Badge accent>{d.home.heroKicker}</Badge>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-7xl">
              {d.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{d.home.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn href={p("tools/brief-builder")}>{d.common.start} <Icon name="arrow" className="size-4" /></Btn>
              <Btn href={p("podcast")} variant="ghost"><Icon name="play" className="size-4" /> {d.nav.podcast}</Btn>
            </div>
          </div>
          <div className="mt-16">
            <p className="kicker mb-5">{d.home.discoveryCta} ↓</p>
            <DiscoveryWidget locale={locale} dict={d} services={serviceLite} />
          </div>
        </Section>
      </div>

      {/* ---------- philosophy ---------- */}
      <Section className="py-20 sm:py-28">
        <Reveal>
          <SectionHeading kicker="Point of view" title={d.common.philosophy} sub={d.home.philosophyDesc} />
        </Reveal>
        <Reveal delay={100}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {services.slice(0, 5).map((s) => (
              <Link key={s.slug} href={p(`services/${s.slug}`)} className="card-hover group rounded-2xl border border-line bg-coal p-5">
                <span className="text-mute transition-colors group-hover:text-accent"><Icon name={s.icon} /></span>
                <p className="mt-4 font-display text-sm font-semibold leading-snug">{s.short}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ---------- transformation map ---------- */}
      <div className="border-y border-line/60 bg-coal/30">
        <Section className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading kicker={d.nav.map} title={d.home.mapTitle} sub={d.home.mapSub} />
          </Reveal>
          <Reveal delay={80}>
            <TransformationMap locale={locale} dict={d} services={services.map((s) => ({ slug: s.slug, title: s.title, icon: s.icon }))} />
          </Reveal>
          <div className="mt-6">
            <Btn href={p("map")} variant="ghost">{d.common.explore} {d.nav.map} →</Btn>
          </div>
        </Section>
      </div>

      {/* ---------- services ---------- */}
      <Section className="py-20 sm:py-28">
        <Reveal>
          <SectionHeading kicker={d.nav.services} title={d.home.servicesTitle} sub={d.common.notSure} />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 60}>
              <Link href={p(`services/${s.slug}`)} className="group block h-full">
                <Card hover className="h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-mute transition-colors group-hover:text-accent"><Icon name={s.icon} className="size-6" /></span>
                    <Icon name="arrow" className="size-4 text-mute/40 transition-all group-hover:translate-x-1 group-hover:text-accent rtl:rotate-180" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold group-hover:text-accent">{s.title}</h3>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-mute">{s.summary}</p>
                </Card>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={services.length * 60}>
            <Link href={p("packages")} className="group block h-full">
              <Card hover className="flex h-full flex-col justify-between border-accent/30 bg-accent/5">
                <div>
                  <h3 className="font-display text-lg font-bold text-accent">{d.home.packagesTitle} →</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-mute">Starter · Launch · Growth · Transform · Enterprise — plus retainers and the studio subscription.</p>
                </div>
              </Card>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* ---------- problems ---------- */}
      <div className="border-y border-line/60 bg-coal/30">
        <Section className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading kicker={d.nav.problems} title={d.home.problemsTitle} sub="Instead of a service list, start from what hurts." />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {problems.slice(0, 6).map((prob, i) => (
              <Reveal key={prob.slug} delay={i * 50}>
                <Link href={p(`problems#${prob.slug}`)} className="group block h-full">
                  <Card hover className="h-full">
                    <p className="font-display text-base font-semibold leading-snug group-hover:text-accent">{prob.pain}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {prob.symptoms.slice(0, 3).map((sym) => (
                        <span key={sym} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute">{sym}</span>
                      ))}
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      {/* ---------- before / after ---------- */}
      <Section className="py-20 sm:py-28">
        <Reveal>
          <SectionHeading kicker={d.nav.work} title={d.home.workTitle} sub={d.home.workSub} />
        </Reveal>
        <Reveal delay={80}>
          <BeforeAfter
            dict={d}
            before={["Ugly documents", "Weak copy", "Manual workflows", "Outdated website", "Knowledge in heads"]}
            after={["Professional documents", "Persuasive communication", "Automated workflows", "Modern digital experience", "Knowledge in systems"]}
          />
        </Reveal>
        <div className="mt-8">
          <Btn href={p("work")} variant="ghost">{d.nav.work} →</Btn>
        </div>
      </Section>

      {/* ---------- podcast ---------- */}
      <div className="border-y border-line/60 bg-coal/30">
        <Section className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading kicker={d.nav.podcast} title={d.home.podcastTitle} sub={d.home.podcastSub} />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {episodes.slice(0, 3).map((ep, i) => (
              <Reveal key={ep.slug} delay={i * 60}>
                <Link href={p(`podcast/${ep.slug}`)} className="group block h-full">
                  <Card hover className="h-full">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-accent">EP {String(ep.number).padStart(3, "0")}</span>
                      <span className="font-mono text-xs text-mute"><Icon name="clock" className="me-1 inline size-3.5" />{ep.duration}</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold leading-snug group-hover:text-accent">{ep.title}</h3>
                    <p className="mt-2 text-xs text-mute">{ep.guest} · {ep.role}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-mute">{ep.teaser}</p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={p("podcast")}>{d.common.viewAll} →</Btn>
            <Btn href={p("contact")} variant="ghost">Be a guest</Btn>
          </div>
        </Section>
      </div>

      {/* ---------- tools ---------- */}
      <Section className="py-20 sm:py-28">
        <Reveal>
          <SectionHeading kicker={d.nav.tools} title={d.home.toolsTitle} sub={d.home.toolsSub} />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {assessments.map((a) => (
            <Link key={a.slug} href={p(`tools/${a.slug}`)} className="group block h-full">
              <Card hover className="h-full">
                <Icon name="target" className="size-6 text-mute group-hover:text-accent" />
                <h3 className="mt-4 font-display text-base font-bold group-hover:text-accent">{a.name}</h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-mute">{a.kicker}</p>
              </Card>
            </Link>
          ))}
          {calculators.map((c) => (
            <Link key={c.slug} href={p(`tools/${c.slug}`)} className="group block h-full">
              <Card hover className="h-full">
                <Icon name="chart" className="size-6 text-mute group-hover:text-accent" />
                <h3 className="mt-4 font-display text-base font-bold group-hover:text-accent">{c.name}</h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-mute">{c.kicker}</p>
              </Card>
            </Link>
          ))}
          <Link href={p("tools/brief-builder")} className="group block h-full">
            <Card hover className="h-full border-accent/30 bg-accent/5">
              <Icon name="spark" className="size-6 text-accent" />
              <h3 className="mt-4 font-display text-base font-bold text-accent">Project Brief Generator</h3>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-mute">10 steps · 3 minutes</p>
            </Card>
          </Link>
        </div>
      </Section>

      {/* ---------- packages ---------- */}
      <div className="border-y border-line/60 bg-coal/30">
        <Section className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading kicker={d.nav.packages} title={d.home.packagesTitle} sub="Curated scopes for common situations — or assemble your own." />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {packages.map((pack, i) => (
              <Reveal key={pack.slug} delay={i * 50}>
                <Card hover className={cx("h-full", pack.featured && "border-accent/50")}>
                  {pack.featured ? <Badge accent>Popular</Badge> : <Badge>{pack.name}</Badge>}
                  <p className="mt-4 font-display text-xl font-bold">{pack.name}</p>
                  <p className="mt-1 text-xs text-mute">{pack.for}</p>
                  <p className="mt-4 font-mono text-sm text-accent">{pack.price}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Btn href={p("packages")} variant="ghost">{d.nav.packages} & {d.nav.retainers} →</Btn>
          </div>
        </Section>
      </div>

      {/* ---------- ideas marquee ---------- */}
      <Section className="overflow-hidden py-20">
        <Reveal>
          <Link href={p("ideas")} className="group block">
            <Kicker>{d.home.ideasTitle} — {d.common.readMore} →</Kicker>
          </Link>
        </Reveal>
        <div className="marquee-track mt-8">
          {[...ideas, ...ideas].map((idea, i) => (
            <p key={i} className="w-80 shrink-0 font-display text-lg font-medium leading-snug text-mute">
              <span className="me-2 font-mono text-accent">→</span>{idea}
            </p>
          ))}
        </div>
      </Section>

      {/* ---------- newsletter ---------- */}
      <div className="border-t border-line/60 bg-coal/30">
        <Section className="py-20 sm:py-24">
          <div className="mx-auto max-w-xl text-center">
            <Reveal>
              <p className="font-display text-3xl font-bold">{d.home.newsletterTitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-mute">{d.home.newsletterDesc}</p>
              <div className="mt-6 flex justify-center"><NewsletterForm dict={d} /></div>
            </Reveal>
          </div>
        </Section>
      </div>
    </>
  );
}
