import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/data/site";
import { ContactForm } from "@/components/forms";
import { Card, PageHero, Section } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  return (
    <>
      <PageHero kicker={d.nav.contact} title="Build something with us" sub="Tell us where you are — an idea, a mess, a stuck project, an ambition. We respond within one working day." />
      <Section className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <ContactForm dict={d} />
          </Reveal>
          <Reveal delay={80}>
            <div className="space-y-4">
              <Card>
                <p className="kicker mb-3">Direct</p>
                <p className="font-mono text-sm text-accent">{site.email}</p>
                <p className="mt-2 font-mono text-sm text-mute">{site.phone}</p>
              </Card>
              <Card>
                <p className="kicker mb-3">Where</p>
                <p className="text-sm text-mute">{site.location}</p>
                <p className="mt-2 text-xs text-mute/70">Timezone-aware scheduling for international clients.</p>
              </Card>
              <Card>
                <p className="kicker mb-3">Follow</p>
                <div className="flex flex-wrap gap-2">
                  {site.socials.map((s) => (
                    <a key={s.label} href={s.href} className="rounded-full border border-line px-4 py-2 text-xs text-mute hover:border-accent/40 hover:text-accent">{s.label}</a>
                  ))}
                </div>
              </Card>
              <Card>
                <p className="kicker mb-3">Prefer structure?</p>
                <p className="text-sm text-mute">Use the <a href={`/${locale}/tools/brief-builder`} className="text-accent hover:underline">brief builder</a> — ten steps, better answers, faster response.</p>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
