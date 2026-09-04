export type Post = {
  slug: string;
  title: string;
  kicker: string;
  date: string;
  minutes: number;
  excerpt: string;
  topics: string[];
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "knowledge-architecture",
    title: "You don't have a documentation problem",
    kicker: "Guide",
    date: "2026-08-20",
    minutes: 7,
    excerpt: "Every company eventually buys a wiki, fills it with noise, and calls the result 'documentation'. The issue was never the tool — it's the architecture.",
    topics: ["Documentation", "Transformation"],
    body: [
      "## The pattern",
      "A company grows past thirty people. Knowledge lives in chats, inboxes, and the memory of three veterans. Leadership buys a wiki. Six months later the wiki is a landfill: duplicate pages, dead links, contradictory SOPs. Everyone agrees documentation is important; nobody can find anything.",
      "## Why tools don't fix it",
      "Documentation fails when it has no architecture — no model of what exists, where it lives, who owns it, and when it dies. A wiki is a room. Architecture is the building plan. Adding rooms to a building with no plan produces the landfill above.",
      "## What knowledge architecture looks like",
      "- **A map**: every knowledge domain named and owned — process, policy, product, people, client.\n- **A lifecycle**: created → reviewed → current → archived. Nothing lives forever.\n- **A front door**: one place people actually start from, not forty bookmarks.\n- **A writing standard**: same structure, same tone, same level of detail.",
      "## The 90-day version",
      "Weeks 1–2: inventory and interview. Weeks 3–6: design the map, write the top twenty pages properly. Weeks 7–10: migrate the living, archive the dead. Weeks 11–12: train owners, set review rhythms.",
      "The result isn't more documentation. It's less — and what remains is findable, trusted, and maintained.",
    ],
  },
  {
    slug: "ai-readiness-honest-checklist",
    title: "The honest AI readiness checklist",
    kicker: "Checklist",
    date: "2026-08-06",
    minutes: 6,
    excerpt: "Before you spend on AI, answer ten uncomfortable questions. Most 'AI transformations' fail before the first tool is bought.",
    topics: ["AI", "Strategy"],
    body: [
      "## The uncomfortable questions",
      "- Can you describe your five most repeated processes without whiteboarding for an hour?\n- If your top three systems vanished their exports tomorrow, would you lose institutional memory?\n- Does your team trust the data enough to argue from it?\n- Who owns AI decisions — a person, or the tide?\n- What would you automate first if automation were free? (It nearly is.)",
      "## Scoring honestly",
      "If you answered 'no' or 'not sure' to three or more, you don't have an AI problem. You have a process and documentation problem — which is good news: it's cheaper to fix, and it compounds into AI readiness.",
      "## The order of operations",
      "Process → documentation → automation → AI. Skip steps and you automate the mess. Follow them and AI becomes almost boring — which is exactly what it should be.",
    ],
  },
  {
    slug: "presentation-hierarchy",
    title: "One idea per slide is not enough",
    kicker: "Tutorial",
    date: "2026-07-22",
    minutes: 5,
    excerpt: "'One idea per slide' is the first rule of presentations and the reason most decks are still bad. Here's the second rule.",
    topics: ["Presentation", "Design"],
    body: [
      "## The first rule and its failure",
      "One idea per slide stops the wall-of-text deck. But applied blindly it produces the sixty-slide shuffle: technically compliant, structurally aimless.",
      "## The second rule",
      "Every slide must advance the argument. A deck is an argument wearing clothes. Before designing anything, write the throughline: 'We are here, we must go there, because this — and here's how.' Every slide either builds that sentence or dies.",
      "## Practical test",
      "Read only your slide headlines aloud, in order. If they don't form a coherent pitch, no amount of design will save the deck. If they do, the design work is 80% done — hierarchy follows meaning.",
    ],
  },
  {
    slug: "content-compounding",
    title: "Content is a compounding asset. Ads are rent.",
    kicker: "Article",
    date: "2026-07-08",
    minutes: 6,
    excerpt: "The financial case for building a content engine instead of renting attention — with the maths to argue it internally.",
    topics: ["Content", "Marketing"],
    body: [
      "## Rent vs. own",
      "Ad spend stops working the day you stop paying. A useful article keeps ranking, convincing, and converting for years. The spreadsheet is simple: rent decays, owned compounds.",
      "## The engine, minimally",
      "One strong piece per month, repurposed everywhere: article → newsletter → social posts → podcast segment → slide. One idea, everywhere. That's the repurposing engine we run for clients — and ourselves.",
      "## The patience line",
      "Compounding feels slow for six months and inevitable after eighteen. Most companies quit at month five. That's the moat.",
    ],
  },
  {
    slug: "brand-brain-explained",
    title: "The Brand Brain, explained",
    kicker: "Framework",
    date: "2026-06-24",
    minutes: 8,
    excerpt: "What if every writer, designer and AI assistant working on your business actually knew it? That's the Brand Brain — here's how we build one.",
    topics: ["AI", "Brand"],
    body: [
      "## The problem",
      "Agencies re-learn your business every engagement. New writer, new briefing, new drift. Voice wobbles, facts diverge, 'authoritative sources' become three-year-old PDFs.",
      "## The construct",
      "A Brand Brain is a private knowledge base: guidelines, approved copy, product facts, tone patterns, past work — structured so both humans and AI can query it. Output quality stops depending on who happened to be free that week.",
      "## The pipeline",
      "Upload → extract (facts, terms, tone) → structure (what's approved, what's banned) → apply (copy, decks, docs, social) → review (humans approve, brain updates).",
      "## The guarantee",
      "Nothing ships unreviewed. The Brain accelerates; humans decide. That's the entire philosophy: human expertise amplified by intelligent systems.",
    ],
  },
  {
    slug: "website-is-a-salesperson",
    title: "Your website is your best salesperson",
    kicker: "Article",
    date: "2026-06-10",
    minutes: 5,
    excerpt: "It works 24/7, meets every prospect first, and never has an off day. Have you trained it — or just redecorated it?",
    topics: ["Digital", "Conversion"],
    body: [
      "## The audit nobody does",
      "Ask five people to find your offer, understand it, and describe the next step. Watch them. Every hesitation is a lost meeting you'll never hear about.",
      "## The three questions every page must answer",
      "What is this? Why should I care? What do I do next? — in that order, above the fold, in plain language.",
      "## Design is the messenger",
      "Speed, hierarchy and clarity are design decisions with revenue consequences. A beautiful page that loads in six seconds and hides the CTA is an expensive brochure.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/* ---------- library resources ---------- */

export type Resource = {
  slug: string;
  title: string;
  format: "Template" | "Checklist" | "Framework" | "Guide" | "Worksheet";
  topic: string;
  level: "Starter" | "Growing" | "Advanced";
  blurb: string;
};

export const resources: Resource[] = [
  { slug: "ai-readiness-checklist", title: "AI Readiness Checklist", format: "Checklist", topic: "AI", level: "Starter", blurb: "The ten questions from our honest checklist, as a printable one-pager." },
  { slug: "brand-voice-worksheet", title: "Brand Voice Worksheet", format: "Worksheet", topic: "Brand", level: "Starter", blurb: "Define voice in four axes: formal↔casual, serious↔playful, plain↔rich, respectful↔irreverent." },
  { slug: "deck-storyline-template", title: "Deck Storyline Template", format: "Template", topic: "Presentation", level: "Starter", blurb: "The throughline-first deck skeleton our studio uses for every pitch." },
  { slug: "knowledge-map-canvas", title: "Knowledge Map Canvas", format: "Framework", topic: "Documentation", level: "Growing", blurb: "Map every knowledge domain, owner and lifecycle on one page." },
  { slug: "content-repurposing-map", title: "Content Repurposing Map", format: "Framework", topic: "Content", level: "Growing", blurb: "One idea → nine outputs. The exact repurposing grid we run." },
  { slug: "sop-template", title: "SOP Template", format: "Template", topic: "Process", level: "Starter", blurb: "A standard-operating-procedure format people actually follow." },
  { slug: "website-brief-template", title: "Website Project Brief", format: "Template", topic: "Digital", level: "Starter", blurb: "The brief template behind our project brief generator." },
  { slug: "process-audit-checklist", title: "Process Audit Checklist", format: "Checklist", topic: "Process", level: "Growing", blurb: "Twenty checks to find the manual work hiding in plain sight." },
  { slug: "ai-usage-policy-template", title: "AI Usage Policy Template", format: "Template", topic: "AI", level: "Advanced", blurb: "A sane, human-readable policy for AI use inside a company." },
  { slug: "transformation-roadmap-canvas", title: "Transformation Roadmap Canvas", format: "Framework", topic: "Transformation", level: "Advanced", blurb: "From current state to target state with sequenced, funded moves." },
  { slug: "pitch-checklist", title: "The 90-Second Deck Test", format: "Checklist", topic: "Presentation", level: "Starter", blurb: "What an investor checks in the first 90 seconds — pass before you polish." },
  { slug: "brand-consistency-scorecard", title: "Brand Consistency Scorecard", format: "Worksheet", topic: "Brand", level: "Growing", blurb: "Score your brand's consistency across ten touchpoints." },
];

export const glossary = [
  { term: "Brand Brain", def: "A private knowledge base of a brand's guidelines, voice and approved facts, usable by humans and AI alike." },
  { term: "Business Brain", def: "The internal counterpart: processes, SOPs, policies and know-how structured for query and automation." },
  { term: "Knowledge architecture", def: "The structure governing what knowledge exists, where it lives, who owns it, and when it dies." },
  { term: "Repurposing engine", def: "A system that turns one source asset into many outputs (article, post, deck, email, script)." },
  { term: "Transformation Map", def: "Our eight-stage model of business maturity: Idea → Confusion → Clarity → Strategy → Creation → Implementation → Transformation → Growth." },
  { term: "CREATE framework", def: "Clarify → Research → Engineer → Activate → Transform → Evolve. How we run engagements." },
  { term: "Lead magnet", def: "A useful free asset (tool, checklist, report) offered in exchange for contact." },
  { term: "Maturity score", def: "A 0–100 rating of a business's capability in a dimension like digital, process or AI readiness." },
];
