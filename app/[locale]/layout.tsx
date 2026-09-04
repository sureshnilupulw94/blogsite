import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDict } from "@/lib/dictionaries";
import { isLocale, locales, localeMeta, type Locale } from "@/lib/i18n";
import { site } from "@/lib/data/site";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/noto-sans-arabic/400.css";
import "@fontsource/noto-sans-arabic/700.css";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDict(isLocale(locale) ? locale : "en");
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${dict.common.philosophy}`, template: `%s · ${site.name}` },
    description: site.description,
    openGraph: { title: site.fullBrand, description: site.description, type: "website" },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);
  const dir = localeMeta[locale].dir;

  return (
    <html lang={locale} dir={dir}>
      <body>
        <Header locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
