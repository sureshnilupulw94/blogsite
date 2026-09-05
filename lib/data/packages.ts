export type Pack = {
  slug: string;
  usd: number;
  name: string;
  for: string;
  price: string;
  timeline: string;
  includes: string[];
  featured?: boolean;
};

export const packages: Pack[] = [
  {
    slug: "starter",
    usd: 1200,
    name: "Starter",
    for: "Individuals & small businesses",
    price: "from $1,200",
    timeline: "2–3 weeks",
    includes: ["One core deliverable (profile, deck or landing page)", "1 discovery session", "2 revision rounds", "Source files & templates"],
  },
  {
    slug: "launch",
    usd: 3800,
    name: "Launch",
    for: "New businesses",
    price: "from $3,800",
    timeline: "4–6 weeks",
    includes: ["Brand basics + messaging", "Website (up to 6 pages)", "Launch copy & collateral", "30 days of support"],
    featured: true,
  },
  {
    slug: "growth",
    usd: 8500,
    name: "Growth",
    for: "Established companies",
    price: "from $8,500",
    timeline: "6–10 weeks",
    includes: ["Full identity or redesign", "Website + content system", "Document & presentation system", "Analytics & SEO foundation"],
  },
  {
    slug: "transform",
    usd: 18000,
    name: "Transform",
    for: "Organisations undergoing change",
    price: "from $18,000",
    timeline: "3–6 months",
    includes: ["Process & documentation audit", "Transformation roadmap", "Digital + AI implementation", "Team enablement"],
  },
  {
    slug: "enterprise",
    usd: 0,
    name: "Enterprise",
    for: "Complex engagements",
    price: "Custom",
    timeline: "Scoped together",
    includes: ["Multi-workstream programs", "Dedicated team", "Governance & security review", "SLA & care plan"],
  },
];

export type Retainer = {
  slug: string;
  name: string;
  price: string;
  blurb: string;
  includes: string[];
};

export const retainers: Retainer[] = [
  {
    slug: "creative-partner",
    name: "Creative Partner",
    price: "from $1,900/mo",
    blurb: "Monthly writing + design capacity.",
    includes: ["Rolling content & design queue", "Priority turnaround", "Monthly strategy check-in", "Pause or cancel monthly"],
  },
  {
    slug: "business-partner",
    name: "Business Partner",
    price: "from $2,900/mo",
    blurb: "Strategy + documentation + optimisation.",
    includes: ["Process & ops advisory", "Documentation system upkeep", "Quarterly audits", "On-call consulting"],
  },
  {
    slug: "digital-partner",
    name: "Digital Partner",
    price: "from $2,400/mo",
    blurb: "Website + maintenance + digital development.",
    includes: ["Hosting, security, updates", "Monthly improvements", "Performance & SEO monitoring", "Small build hours monthly"],
  },
  {
    slug: "ai-partner",
    name: "AI Partner",
    price: "from $3,500/mo",
    blurb: "AI strategy + implementation + optimisation.",
    includes: ["Automation pipeline", "Assistant & agent upkeep", "Monthly AI review", "Team enablement sessions"],
  },
];

export const subscription = {
  name: "The Studio Subscription",
  pitch: "Your external creative & transformation department.",
  desc: "Instead of hiring five people internally: monthly access to writing, design, presentations, documents, strategy, digital and AI consulting — one predictable fee, one queue, one team that knows your business.",
  points: [
    "One request queue, unlimited requests, delivered one at a time",
    "Average 3-day turnaround",
    "Pause or cancel any month",
    "Brand Brain included — we remember everything about your business",
  ],
  price: "from $4,500/mo",
  usdMonthly: 4500,
};
