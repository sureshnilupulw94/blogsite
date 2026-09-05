import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const routes = [
  "", "/discover", "/map", "/services", "/capabilities", "/packages", "/retainers",
  "/industries", "/problems", "/work", "/podcast", "/ideas", "/studio", "/lab",
  "/insights", "/library", "/tools", "/about", "/careers", "/partners", "/press",
  "/roadmap", "/status", "/contact", "/legal",
  "/tools/website-audit", "/tools/presentation-audit", "/tools/brand-audit", "/tools/process-audit",
  "/products", "/events", "/research",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `https://theflagship.example/en${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `https://theflagship.example/${l}${route}`])),
    },
  }));
}
