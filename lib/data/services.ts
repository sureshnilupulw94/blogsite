export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  summary: string;
  deliverables: string[];
  process: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
  matrixNeed?: string;
};

export const services: Service[] = [
  {
    slug: "writing",
    title: "Writing & Content",
    short: "Writing",
    icon: "pen",
    summary:
      "Words that sell, explain and persuade — from a one-line tagline to a 60-page company profile. Copywriting, technical writing, business writing and research, built on clear thinking.",
    deliverables: [
      "Website & landing page copy",
      "Company profiles & brochures",
      "Investor & pitch materials",
      "Technical documentation & SOPs",
      "Email sequences & campaigns",
      "Editing & rewriting",
    ],
    process: [
      { step: "Clarify", detail: "Audience, objective, message hierarchy — before a single sentence." },
      { step: "Research", detail: "Facts, competitors, voice. Approved facts only." },
      { step: "Draft", detail: "Structured writing with reasoning visible." },
      { step: "Edit", detail: "Editorial review, fact-check, tone alignment." },
    ],
    faqs: [
      { q: "Do you write in our voice?", a: "Yes — we build a voice profile from your existing material, or create one with you if it doesn't exist yet." },
      { q: "Can AI write it?", a: "We use AI to accelerate research and drafts, humans own the final word. The positioning is human expertise amplified by intelligent systems." },
    ],
    matrixNeed: "Launch a business",
  },
  {
    slug: "design",
    title: "Design & Brand",
    short: "Design",
    icon: "layers",
    summary:
      "Identities, presentations and documents that make complex information understandable. Design as communication, not decoration.",
    deliverables: [
      "Brand identity & guidelines",
      "Presentation design (pitch, exec, sales)",
      "Document & report design",
      "Infographics & data visualisation",
      "Marketing collateral",
      "Packaging of long reports",
    ],
    process: [
      { step: "Brief", detail: "What must this design make someone understand, feel, and do?" },
      { step: "Explore", detail: "Moodboards, typography, grids — decisions shown, not just results." },
      { step: "Iterate", detail: "Structured rounds with clear feedback points." },
      { step: "Systemise", detail: "Templates and rules so it stays consistent after we leave." },
    ],
    faqs: [
      { q: "Why does presentation design matter?", a: "A beautiful presentation cannot rescue a weak idea — but a bad one can absolutely kill a good one." },
      { q: "Do we get the source files?", a: "Always, plus templates your team can actually use." },
    ],
    matrixNeed: "Investor fundraising",
  },
  {
    slug: "digital",
    title: "Digital & Web",
    short: "Digital",
    icon: "globe",
    summary:
      "Websites and digital experiences that load fast, rank well, and convert. Built on modern stacks, maintained without drama.",
    deliverables: [
      "Websites & landing pages",
      "Web applications & portals",
      "E-commerce",
      "SEO & performance",
      "Analytics & conversion tracking",
      "Care & maintenance",
    ],
    process: [
      { step: "Define", detail: "Site architecture around user journeys, not org charts." },
      { step: "Design", detail: "Systems-first UI: tokens, components, then pages." },
      { step: "Build", detail: "Modern framework, accessible, fast on real networks." },
      { step: "Grow", detail: "Measure, iterate, maintain." },
    ],
    faqs: [
      { q: "Which stack do you use?", a: "Whatever serves the goal — typically Next.js for product-grade sites. We hand over documentation either way." },
      { q: "Do you maintain sites?", a: "Yes — see our Digital Partner retainer." },
    ],
    matrixNeed: "Rebrand",
  },
  {
    slug: "strategy",
    title: "Strategy & Transformation",
    short: "Strategy",
    icon: "compass",
    summary:
      "When the business itself needs to change: process redesign, operating models, documentation systems and roadmaps that survive contact with reality.",
    deliverables: [
      "Business & process audits",
      "Transformation roadmaps",
      "Process redesign & SOP systems",
      "Knowledge architecture",
      "Operating model design",
      "Change enablement",
    ],
    process: [
      { step: "Discover", detail: "How work actually happens — not how the org chart says it does." },
      { step: "Define", detail: "The gap, the goal, the constraints." },
      { step: "Design", detail: "Processes, systems, documentation, ownership." },
      { step: "Deploy", detail: "Sequenced implementation with measurable checkpoints." },
    ],
    faqs: [
      { q: "What's knowledge architecture?", a: "Most companies don't have a documentation problem — they have a knowledge architecture problem. We fix the structure, not just the documents." },
      { q: "How long is a transformation?", a: "Real change runs 3–18 months. We deliver value in the first 30 days regardless." },
    ],
    matrixNeed: "Automate operations",
  },
  {
    slug: "ai",
    title: "AI & Automation",
    short: "AI",
    icon: "spark",
    summary:
      "Practical AI: automations that remove manual work, assistants that know your business, and AI strategy that starts with the workflow — not the tool.",
    deliverables: [
      "AI opportunity audits",
      "Workflow automation",
      "Custom AI assistants & agents",
      "Knowledge bases (Brand Brain / Business Brain)",
      "AI usage policy & governance",
      "Team enablement",
    ],
    process: [
      { step: "Map", detail: "Where the hours actually go." },
      { step: "Prioritise", detail: "Highest-leverage automations first — quick wins fund the deep work." },
      { step: "Build", detail: "Integrations with humans in the loop." },
      { step: "Optimise", detail: "Measure, refine, expand." },
    ],
    faqs: [
      { q: "We're not ready for AI.", a: "Most companies don't need more AI tools — they need fewer disconnected workflows. We often fix the process first, then automate it." },
      { q: "Is our data safe?", a: "We design with data minimisation and clear AI usage policies. Your data stays yours." },
    ],
    matrixNeed: "Build authority",
  },
  {
    slug: "podcast",
    title: "Podcast & Media",
    short: "Media",
    icon: "mic",
    summary:
      "The Flagship AI Podcast — and podcast production for brands that want to own a conversation. Strategy, production, show notes, repurposing.",
    deliverables: [
      "Podcast strategy & format design",
      "Full production (record → publish)",
      "Show notes & episode pages",
      "Content repurposing (one idea, everywhere)",
      "Guest sourcing & research",
      "Brand podcasts end-to-end",
    ],
    process: [
      { step: "Position", detail: "What conversation do you own? Who's it for?" },
      { step: "Produce", detail: "Recording, editing, sound design, artwork." },
      { step: "Publish", detail: "Distribution, pages, SEO, transcripts." },
      { step: "Repurpose", detail: "Every episode becomes articles, clips, posts, emails." },
    ],
    faqs: [
      { q: "Why should a business podcast?", a: "It's the most efficient authority engine: one conversation feeds weeks of content and builds a network while doing it." },
      { q: "Can you run our show completely?", a: "Yes. You bring the guests; we bring everything else." },
    ],
    matrixNeed: "Build authority",
  },
  {
    slug: "training",
    title: "Training & Workshops",
    short: "Training",
    icon: "book",
    summary:
      "Your team, levelled up: business writing, presentation design, AI for business, and transformation workshops. Practical, not theoretical.",
    deliverables: [
      "Business writing workshops",
      "Presentation design training",
      "AI for business programs",
      "Documentation & SOP training",
      "Executive coaching",
      "Custom programs",
    ],
    process: [
      { step: "Assess", detail: "Where the team is, where it needs to be." },
      { step: "Design", detail: "Curriculum around your real work, not generic examples." },
      { step: "Deliver", detail: "Live, hands-on, with artefacts people keep using." },
      { step: "Embed", detail: "Follow-ups and materials that make it stick." },
    ],
    faqs: [
      { q: "In-person or remote?", a: "Both. Colombo-based for in-person, worldwide for remote." },
      { q: "How big can a group be?", a: "Workshops work best under 20; talks scale to any size." },
    ],
    matrixNeed: "Launch a business",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/* ---------- capability library ---------- */

export type Capability = {
  slug: string;
  title: string;
  family: string;
  blurb: string;
  includes: string[];
};

export const capabilityFamilies = ["Writing", "Design", "Digital", "Transformation", "AI"] as const;

export const capabilities: Capability[] = [
  { slug: "copywriting", title: "Copywriting", family: "Writing", blurb: "Persuasion in print: pages, funnels, campaigns.", includes: ["Web copy", "Ad copy", "Email sequences", "Taglines & naming"] },
  { slug: "technical-writing", title: "Technical Writing", family: "Writing", blurb: "Complex things, explained so people can act.", includes: ["Documentation", "User guides", "API docs", "SOPs"] },
  { slug: "business-writing", title: "Business Writing", family: "Writing", blurb: "Proposals, reports, profiles that get decisions made.", includes: ["Proposals", "Company profiles", "Reports", "Exec summaries"] },
  { slug: "research", title: "Research", family: "Writing", blurb: "Evidence before argument.", includes: ["Market research", "Competitive analysis", "Interviews", "Synthesis"] },
  { slug: "brand", title: "Brand", family: "Design", blurb: "Identity systems that mean something.", includes: ["Identity design", "Guidelines", "Art direction", "Naming"] },
  { slug: "presentation", title: "Presentation", family: "Design", blurb: "Slides that carry an argument.", includes: ["Pitch decks", "Exec decks", "Sales decks", "Slide systems"] },
  { slug: "document", title: "Document", family: "Design", blurb: "Reports and documents people actually read.", includes: ["Annual reports", "Proposals", "Brochures", "Templates"] },
  { slug: "digital-design", title: "Digital Design", family: "Design", blurb: "Interfaces and experiences for screens.", includes: ["Web design", "Product UI", "Design systems", "Prototypes"] },
  { slug: "websites", title: "Websites", family: "Digital", blurb: "Fast, findable, convertible.", includes: ["Marketing sites", "Landing pages", "CMS", "Performance"] },
  { slug: "platforms", title: "Platforms", family: "Digital", blurb: "Portals, dashboards, tools.", includes: ["Client portals", "Web apps", "Integrations", "Dashboards"] },
  { slug: "seo-analytics", title: "SEO & Analytics", family: "Digital", blurb: "Be found. Understand what happens next.", includes: ["Technical SEO", "Content SEO", "Analytics", "CRO"] },
  { slug: "ecommerce", title: "E-commerce", family: "Digital", blurb: "Selling without friction.", includes: ["Storefronts", "Checkout optimisation", "Product content", "Payments"] },
  { slug: "process", title: "Process", family: "Transformation", blurb: "Work that flows without heroes.", includes: ["Process mapping", "Redesign", "SOPs", "Quality systems"] },
  { slug: "transformation", title: "Transformation", family: "Transformation", blurb: "From where the business is to where it must be.", includes: ["Audits", "Roadmaps", "Change programs", "Operating models"] },
  { slug: "documentation", title: "Documentation", family: "Transformation", blurb: "Institutional memory, engineered.", includes: ["Knowledge architecture", "Handbooks", "Wikis", "Onboarding systems"] },
  { slug: "automation", title: "Automation", family: "AI", blurb: "Machines doing the repeatable; humans doing the valuable.", includes: ["Workflow automation", "Integrations", "RPA-lite", "Ops tooling"] },
  { slug: "ai-strategy", title: "AI Strategy", family: "AI", blurb: "AI applied where it pays.", includes: ["Opportunity audits", "Use-case mapping", "Roadmaps", "Governance"] },
  { slug: "ai-assistants", title: "AI Assistants", family: "AI", blurb: "Assistants that know your business.", includes: ["Brand Brain", "Business Brain", "Custom agents", "RAG systems"] },
];

export function getCapability(slug: string) {
  return capabilities.find((c) => c.slug === slug);
}

/* ---------- service matrix ---------- */

export const matrixNeeds = [
  { need: "Launch a business", services: ["Writing", "Design", "Digital", "Strategy"] },
  { need: "Investor fundraising", services: ["Writing", "Design", "Strategy"] },
  { need: "Rebrand", services: ["Writing", "Design", "Digital", "Strategy"] },
  { need: "Automate operations", services: ["Digital", "Strategy", "AI"] },
  { need: "Build authority", services: ["Writing", "Design", "Digital", "Media"] },
  { need: "Fix documentation chaos", services: ["Writing", "Strategy", "AI"] },
  { need: "Modernise the website", services: ["Design", "Digital", "AI"] },
];

export const matrixColumns = ["Writing", "Design", "Digital", "Strategy", "AI", "Media"];
