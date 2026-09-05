export type Industry = {
  slug: string;
  name: string;
  blurb: string;
  challenges: string[];
  whatWeDo: string[];
};

export const industries: Industry[] = [
  { slug: "hospitality", name: "Hospitality", blurb: "Hotels, restaurants, travel — where every touchpoint is a promise.", challenges: ["Guest communications that feel templated", "Menus, collateral & SOPs that drift out of date", "Booking experiences that leak"], whatWeDo: ["Guest journey mapping & content", "Menu & collateral systems", "SOP & operations documentation"] },
  { slug: "tourism", name: "Tourism", blurb: "Selling a place, an experience, a memory — before the visitor arrives.", challenges: ["Stories that don't survive translation", "Websites that don't convert international visitors", "Manual booking & inquiry handling"], whatWeDo: ["Multilingual storytelling", "High-converting booking sites", "Inquiry automation"] },
  { slug: "retail", name: "Retail", blurb: "Product stories and operations that keep pace with the shelf.", challenges: ["Product content that doesn't sell", "Inconsistent promotions", "Supplier & ops coordination"], whatWeDo: ["Product copy systems", "Campaign toolkits", "Ops documentation & automation"] },
  { slug: "finance", name: "Finance", blurb: "Trust, clarity and compliance — in every document and pixel.", challenges: ["Dense reporting nobody reads", "Regulatory documentation burden", "Explaining complex products simply"], whatWeDo: ["Report & presentation redesign", "Plain-language product content", "Compliance-ready documentation systems"] },
  { slug: "education", name: "Education", blurb: "Institutions that must teach, market and run themselves well.", challenges: ["Course materials that vary wildly", "Prospect communication gaps", "Administrative overload"], whatWeDo: ["Curriculum & template systems", "Admissions funnels", "Process automation"] },
  { slug: "technology", name: "Technology", blurb: "Companies whose biggest communication problem is their own complexity.", challenges: ["Explaining the product in one sentence", "Docs that engineers avoid writing", "Positioning that drifts"], whatWeDo: ["Positioning & messaging", "Documentation that ships", "Demo & pitch systems"] },
  { slug: "healthcare", name: "Healthcare", blurb: "Where clarity is not a luxury — it's safety.", challenges: ["Patient instructions that confuse", "Compliance-heavy processes", "Fragmented records"], whatWeDo: ["Plain-language patient content", "Process mapping", "Knowledge systems"] },
  { slug: "professional-services", name: "Professional Services", blurb: "Firms selling expertise — where the document is the product.", challenges: ["Proposals that take days to assemble", "Inconsistent branding across partners", "Expertise trapped in heads"], whatWeDo: ["Proposal & tender systems", "Brand governance", "Knowledge capture"] },
  { slug: "real-estate", name: "Real Estate", blurb: "High-value decisions built on presentation and trust.", challenges: ["Listings that all look the same", "Slow investor reporting", "Manual lead handling"], whatWeDo: ["Listing & brochure systems", "Investor reporting", "Lead automation"] },
  { slug: "manufacturing", name: "Manufacturing", blurb: "Physical businesses with digital frontiers.", challenges: ["Tribal-knowledge processes", "Outdated product catalogues", "Exporter communication"], whatWeDo: ["SOP & training systems", "Catalogue modernisation", "Buyer-facing digital"] },
  { slug: "startups", name: "Startups", blurb: "Speed matters; so does looking like you'll survive.", challenges: ["Pitch decks that undersell", "No time for content", "Tools sprawl before process exists"], whatWeDo: ["Investor materials", "Launch content engines", "Lean automation stacks"] },
  { slug: "ngo", name: "NGOs", blurb: "Mission-driven work that must communicate to fund and operate.", challenges: ["Donor reports that don't move donors", "Grant writing overload", "Field knowledge lost"], whatWeDo: ["Impact reporting design", "Grant & proposal support", "Knowledge systems"] },
  { slug: "government", name: "Government & Public Sector", blurb: "Public communication that must reach everyone.", challenges: ["Accessibility requirements", "Slow, manual workflows", "Multilingual obligations"], whatWeDo: ["Accessible public materials", "Process digitisation", "Plain-language programs"] },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}

/* ---------- problems we solve ---------- */

export type Problem = {
  slug: string;
  pain: string;
  headline: string;
  symptoms: string[];
  service: string;
};

export const problems: Problem[] = [
  {
    slug: "presentations",
    pain: "Your presentations aren't communicating what you know.",
    headline: "You know your business. Your slides don't.",
    symptoms: ["Overloaded slides", "Weak storytelling", "No visual hierarchy", "Inconsistent branding"],
    service: "design",
  },
  {
    slug: "invisible-value",
    pain: "Your website doesn't sell what you actually do.",
    headline: "The best-kept secret in your market is you.",
    symptoms: ["Bounce in seconds", "Unclear offer", "No inquiries", "Embarrassing mobile"],
    service: "digital",
  },
  {
    slug: "documentation-chaos",
    pain: "Everything lives in someone's head — and they're on leave.",
    headline: "Your business runs on memory. That's a risk.",
    symptoms: ["Tribal knowledge", "Version chaos", "Onboarding takes months", "Nothing is findable"],
    service: "strategy",
  },
  {
    slug: "manual-work",
    pain: "Your team spends hours on work a machine should do.",
    headline: "You're paying humans to be robots.",
    symptoms: ["Copy-paste workflows", "Repetitive reporting", "Slow turnaround", "Error-prone processes"],
    service: "ai",
  },
  {
    slug: "weak-copy",
    pain: "Your writing describes features. Buyers want outcomes.",
    headline: "Nobody buys features. They buy futures.",
    symptoms: ["Me-focused copy", "Jargon", "No clear CTA", "Inconsistent voice"],
    service: "writing",
  },
  {
    slug: "authority-gap",
    pain: "You're an expert. Nobody knows.",
    headline: "Expertise without an audience is a hobby.",
    symptoms: ["No content engine", "Competitors own the conversation", "No inbound leads"],
    service: "podcast",
  },
  {
    slug: "stalled-growth",
    pain: "Growth stalled and you're not sure why.",
    headline: "You can't fix what you can't see.",
    symptoms: ["Flat metrics", "Unclear funnel", "Ad-hoc strategy", "Burned-out team"],
    service: "strategy",
  },
  {
    slug: "ai-overwhelm",
    pain: "Everyone says 'use AI'. Nothing changed.",
    headline: "AI without a process just makes mess faster.",
    symptoms: ["Tool sprawl", "Pilots that die", "Fear in the team", "No governance"],
    service: "ai",
  },
];
