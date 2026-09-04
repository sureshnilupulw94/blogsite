import Link from "next/link";
import { getDict } from "@/lib/dictionaries";
import { defaultLocale } from "@/lib/i18n";
import { Btn, Section } from "@/components/ui";

export default function NotFound() {
  const d = getDict(defaultLocale);
  return (
    <Section className="flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">Lost the signal.</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">
        This page doesn't exist — but the map does. Start from the beginning, or find what you were looking for.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Btn href={`/${defaultLocale}`}>{d.nav.home}</Btn>
        <Btn href={`/${defaultLocale}/discover`} variant="ghost">{d.nav.discover}</Btn>
      </div>
      <Link href={`/${defaultLocale}/map`} className="mt-8 font-mono text-xs text-mute hover:text-accent">
        {d.nav.map} →
      </Link>
    </Section>
  );
}
