export const locales = ["en", "de", "ja", "fr", "nl", "ar", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; native: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", native: "EN", dir: "ltr" },
  de: { label: "Deutsch", native: "DE", dir: "ltr" },
  ja: { label: "日本語", native: "JA", dir: "ltr" },
  fr: { label: "Français", native: "FR", dir: "ltr" },
  nl: { label: "Nederlands", native: "NL", dir: "ltr" },
  ar: { label: "العربية", native: "AR", dir: "rtl" },
  es: { label: "Español", native: "ES", dir: "ltr" },
};

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

export function localePath(locale: Locale, path = "") {
  const clean = path.replace(/^\/+/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
