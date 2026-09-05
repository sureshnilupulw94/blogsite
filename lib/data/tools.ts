/* ---------- discovery goals ---------- */

export type Goal = {
  slug: string;
  label: string;
  sub: string;
  services: string[]; // service slugs
  stage: string; // transformation stage slug
};

export const goals: Goal[] = [
  { slug: "idea", label: "I have an idea", sub: "Something new wants to exist", services: ["strategy", "writing", "design"], stage: "idea" },
  { slug: "writing", label: "I need better writing", sub: "Words that sell, explain or persuade", services: ["writing", "training"], stage: "creation" },
  { slug: "design", label: "I need something designed", sub: "Identity, documents, presentations", services: ["design"], stage: "creation" },
  { slug: "website", label: "I need a website", sub: "Fast, findable, convertible", services: ["digital", "design", "writing"], stage: "implementation" },
  { slug: "improve", label: "My business needs improvement", sub: "Processes, structure, growth", services: ["strategy", "ai"], stage: "transformation" },
  { slug: "ai", label: "I want to use AI", sub: "Automation, assistants, strategy", services: ["ai"], stage: "transformation" },
  { slug: "unsure", label: "I need help but don't know what I need", sub: "Start with a conversation", services: ["strategy"], stage: "confusion" },
];

/* ---------- transformation map ---------- */

export type Stage = {
  slug: string;
  name: string;
  you: string;
  we: string[]; // service slugs
};

export const stages: Stage[] = [
  { slug: "idea", name: "Idea", you: "Something new wants to exist.", we: ["strategy"] },
  { slug: "confusion", name: "Confusion", you: "You have an idea but don't know where to start.", we: ["strategy", "writing"] },
  { slug: "clarity", name: "Clarity", you: "The path is visible. It needs to be chosen.", we: ["strategy", "writing"] },
  { slug: "strategy", name: "Strategy", you: "You know what you want — and why.", we: ["strategy"] },
  { slug: "creation", name: "Creation", you: "The assets must now exist.", we: ["writing", "design", "podcast"] },
  { slug: "implementation", name: "Implementation", you: "Now it needs to work in the world.", we: ["digital", "ai"] },
  { slug: "transformation", name: "Transformation", you: "The business itself is changing.", we: ["strategy", "ai"] },
  { slug: "growth", name: "Growth", you: "It works. Make it compound.", we: ["digital", "podcast", "training"] },
];

export const createFramework = [
  { letter: "C", word: "Clarify", desc: "Audience, objective, message hierarchy." },
  { letter: "R", word: "Research", desc: "Facts, competitors, voice — before arguments." },
  { letter: "E", word: "Engineer", desc: "Structure the argument, then the artefact." },
  { letter: "A", word: "Activate", desc: "Ship into the world: publish, launch, present." },
  { letter: "T", word: "Transform", desc: "Change how the business communicates." },
  { letter: "E", word: "Evolve", desc: "Measure, maintain, compound." },
];

/* ---------- assessments ---------- */

export type AssessmentQuestion = { q: string; dim: string };
export type AssessmentConfig = {
  slug: string;
  name: string;
  kicker: string;
  intro: string;
  cta: string;
  dimensions: { key: string; label: string; low: string; high: string }[];
  questions: AssessmentQuestion[];
};

export const transformationIndex: AssessmentConfig = {
  slug: "transformation-index",
  name: "The Business Transformation Index™",
  kicker: "Assessment · 5 minutes",
  intro: "How transformable is your business? Sixteen questions across eight dimensions. Answer honestly — the value is in the truth.",
  cta: "Get your transformation roadmap",
  dimensions: [
    { key: "digital", label: "Digital maturity", low: "Paper-first", high: "Digital-first" },
    { key: "process", label: "Process maturity", low: "Heroics", high: "Systems" },
    { key: "people", label: "People readiness", low: "Fearful", high: "Energised" },
    { key: "customer", label: "Customer experience", low: "Frustrating", high: "Effortless" },
    { key: "brand", label: "Brand consistency", low: "Inconsistent", high: "Systematic" },
    { key: "data", label: "Data health", low: "Scattered", high: "Structured" },
    { key: "ai", label: "AI readiness", low: "Absent", high: "Operational" },
    { key: "comms", label: "Communication clarity", low: "Confusing", high: "Crystal" },
  ],
  questions: [
    { q: "Our key processes are documented and followed.", dim: "process" },
    { q: "New hires can find what they need without asking a person.", dim: "process" },
    { q: "Our website and digital channels generate leads on their own.", dim: "digital" },
    { q: "Our data lives in connected systems, not scattered spreadsheets.", dim: "data" },
    { q: "We can describe our customer's journey end-to-end.", dim: "customer" },
    { q: "Our brand looks and sounds consistent across every touchpoint.", dim: "brand" },
    { q: "The team sees change as opportunity, not threat.", dim: "people" },
    { q: "We regularly measure what customers experience, not just what we sell.", dim: "customer" },
    { q: "Documents we produce (proposals, reports, decks) are consistently strong.", dim: "comms" },
    { q: "Our positioning is clear enough that customers repeat it back to us.", dim: "comms" },
    { q: "Manual, repetitive work is a known and shrinking share of the week.", dim: "ai" },
    { q: "Someone owns AI/automation decisions — a person, not the tide.", dim: "ai" },
    { q: "Leadership communicates decisions with clear reasoning.", dim: "people" },
    { q: "Our online presence matches the quality of our actual work.", dim: "digital" },
    { q: "We trust our numbers enough to argue from them.", dim: "data" },
    { q: "Strategy is written down — not just spoken.", dim: "brand" },
  ],
};

export const aiReadiness: AssessmentConfig = {
  slug: "ai-readiness",
  name: "AI Readiness Assessment",
  kicker: "Assessment · 4 minutes",
  intro: "Is your business ready for AI — or just attracted to it? Seven dimensions, twelve questions, one honest answer.",
  cta: "Get your AI readiness report",
  dimensions: [
    { key: "data", label: "Data", low: "Nowhere", high: "Ready" },
    { key: "process", label: "Processes", low: "Chaos", high: "Mapped" },
    { key: "docs", label: "Documentation", low: "Tribal", high: "Structured" },
    { key: "security", label: "Security & governance", low: "Informal", high: "Governed" },
    { key: "workflow", label: "Workflow fit", low: "Opaque", high: "Obvious" },
    { key: "team", label: "Team readiness", low: "Sceptical", high: "Enabled" },
    { key: "use", label: "Use cases", low: "Vague", high: "Prioritised" },
  ],
  questions: [
    { q: "Our most repeated processes could be described step-by-step.", dim: "process" },
    { q: "The data AI would need is accessible and reasonably clean.", dim: "data" },
    { q: "Company knowledge is written down, not just remembered.", dim: "docs" },
    { q: "We know which data must never leave our control.", dim: "security" },
    { q: "We can name three workflows where hours vanish weekly.", dim: "workflow" },
    { q: "The team has tried AI tools in real work, not just demos.", dim: "team" },
    { q: "We have a list of AI use cases ranked by value.", dim: "use" },
    { q: "Someone is accountable for AI quality and safety.", dim: "security" },
    { q: "Our documents use consistent formats and terminology.", dim: "docs" },
    { q: "Leadership has communicated where AI fits our strategy.", dim: "team" },
    { q: "Process owners have time allocated to improve their processes.", dim: "process" },
    { q: "We could automate one workflow this quarter if we decided to.", dim: "use" },
  ],
};

export const assessments = [transformationIndex, aiReadiness];

export function getAssessment(slug: string) {
  return assessments.find((a) => a.slug === slug);
}

/* ---------- calculators ---------- */

export type CalcField = {
  key: string;
  label: string;
  type: "number" | "range";
  min?: number;
  max?: number;
  step?: number;
  def: number;
  unit?: string;
  hint?: string;
};

export type CalculatorConfig = {
  slug: string;
  name: string;
  kicker: string;
  intro: string;
  fields: CalcField[];
  formulaNote: string;
};

export const calculators: CalculatorConfig[] = [
  {
    slug: "roi-calculator",
    name: "AI ROI Calculator",
    kicker: "Calculator · 2 minutes",
    intro: "How much could automation actually save? Estimate the cost of manual work, then the return on automating it.",
    fields: [
      { key: "people", label: "People doing the manual process", type: "number", min: 1, def: 3, hint: "Who touches this workflow?" },
      { key: "hours", label: "Hours each, per week", type: "range", min: 1, max: 30, step: 1, def: 8 },
      { key: "rate", label: "Loaded hourly cost", type: "range", min: 5, max: 150, step: 5, def: 25, unit: "$" },
      { key: "automatable", label: "Share automatable", type: "range", min: 10, max: 90, step: 5, def: 60, unit: "%" },
      { key: "build", label: "One-time build investment", type: "range", min: 500, max: 30000, step: 500, def: 6000, unit: "$" },
    ],
    formulaNote: "Savings = people × hours × 52 × rate × automatable share. ROI = (annual savings − build) ÷ build. Maintenance estimated at 15% of build annually.",
  },
  {
    slug: "productivity-calculator",
    name: "Productivity Calculator",
    kicker: "Calculator · 1 minute",
    intro: "What are manual processes really costing? Not the tool bill — the hours.",
    fields: [
      { key: "team", label: "Team size", type: "range", min: 2, max: 100, step: 1, def: 12 },
      { key: "waste", label: "Hours lost per person, per week", type: "range", min: 1, max: 20, step: 1, def: 6, hint: "Copying data, chasing documents, re-doing work" },
      { key: "rate", label: "Average loaded hourly cost", type: "range", min: 5, max: 150, step: 5, def: 20, unit: "$" },
    ],
    formulaNote: "Annual cost = team × hours × 52 × rate. Time is the real budget.",
  },
  {
    slug: "project-estimator",
    name: "Website Project Estimator",
    kicker: "Calculator · 2 minutes",
    intro: "Estimate your website project's complexity — and what drives it.",
    fields: [
      { key: "pages", label: "Pages / views needed", type: "range", min: 1, max: 50, step: 1, def: 6 },
      { key: "content", label: "Content readiness", type: "range", min: 0, max: 100, step: 25, def: 50, unit: "%", hint: "0% = writing from scratch" },
      { key: "integrations", label: "Integrations (CRM, payments, booking…)", type: "range", min: 0, max: 6, step: 1, def: 1 },
      { key: "languages", label: "Languages", type: "range", min: 1, max: 5, step: 1, def: 1 },
    ],
    formulaNote: "Complexity = pages + (100−content)% × pages×0.5 + integrations×3 + (languages−1)×4. Shown as a 1–10 score with indicative timeline.",
  },
  {
    slug: "content-calculator",
    name: "Content Cost Calculator",
    kicker: "Calculator · 1 minute",
    intro: "Estimate your monthly content requirements — and what an engine costs versus doing it ad hoc.",
    fields: [
      { key: "articles", label: "Articles / month", type: "range", min: 0, max: 8, step: 1, def: 2 },
      { key: "social", label: "Social posts / month", type: "range", min: 0, max: 60, step: 5, def: 12 },
      { key: "decks", label: "Decks / documents per month", type: "range", min: 0, max: 10, step: 1, def: 1 },
      { key: "repurpose", label: "Repurpose each asset (0–5 outputs)", type: "range", min: 0, max: 5, step: 1, def: 2 },
    ],
    formulaNote: "Effort ≈ articles×8h + social×1.5h + decks×6h, reduced by repurposing efficiency (×0.85 per repurpose level).",
  },
];

export function getCalculator(slug: string) {
  return calculators.find((c) => c.slug === slug);
}

/* ---------- mini audits ---------- */

export type AuditChoice = { label: string; points: number };
export type AuditQuestion = { q: string; dim: string; choices?: AuditChoice[] };
export type AuditFinding = { dim: string; max: number; severity: "fail" | "warn" | "pass"; text: string };
export type AuditConfig = {
  slug: string;
  name: string;
  kicker: string;
  intro: string;
  dimensions: { key: string; label: string }[];
  questions: AuditQuestion[];
  findings: AuditFinding[];
  recommendations: { dim: string; text: string }[];
};

const SCALE: AuditChoice[] = [
  { label: "Not at all", points: 0 },
  { label: "Rarely", points: 1 },
  { label: "Sometimes", points: 2 },
  { label: "Mostly", points: 3 },
  { label: "Absolutely", points: 4 },
];

export const audits: AuditConfig[] = [
  {
    slug: "presentation-audit",
    name: "Presentation Audit",
    kicker: "Audit · 3 minutes",
    intro: "Score your deck honestly: readability, storytelling, hierarchy and visual consistency — with specific fixes for every weak spot.",
    dimensions: [
      { key: "readability", label: "Readability" },
      { key: "storytelling", label: "Storytelling" },
      { key: "hierarchy", label: "Visual hierarchy" },
      { key: "consistency", label: "Consistency" },
    ],
    questions: [
      { q: "Slides are readable from the back of the room.", dim: "readability" },
      { q: "Most slides carry one idea, not five.", dim: "readability" },
      { q: "The deck tells a story rather than listing topics.", dim: "storytelling" },
      { q: "Read aloud, the headlines alone carry the argument.", dim: "storytelling" },
      { q: "Numbers are visualised, not tabulated.", dim: "hierarchy" },
      { q: "The most important element on each slide is obviously the most important.", dim: "hierarchy" },
      { q: "Typography, colour and spacing are consistent throughout.", dim: "consistency" },
      { q: "Every deck your company produces looks like the same company.", dim: "consistency" },
    ],
    findings: [
      { dim: "readability", max: 39, severity: "fail", text: "Dense slides are costing you the room — attention dies at paragraph three." },
      { dim: "readability", max: 69, severity: "warn", text: "Readable but still carrying too much per slide; cut 30% of words." },
      { dim: "readability", max: 100, severity: "pass", text: "Readable — the room can hear you AND read you." },
      { dim: "storytelling", max: 39, severity: "fail", text: "No throughline: it's a list wearing a template. Write the argument first." },
      { dim: "storytelling", max: 69, severity: "warn", text: "A story is in there somewhere — headline-test it to surface the spine." },
      { dim: "storytelling", max: 100, severity: "pass", text: "The story survives design — the way it should." },
      { dim: "hierarchy", max: 39, severity: "fail", text: "Everything screams, so nothing is heard. Establish one focal point per slide." },
      { dim: "hierarchy", max: 69, severity: "warn", text: "Hierarchy exists but is inconsistent — systemise size, weight and colour." },
      { dim: "hierarchy", max: 100, severity: "pass", text: "Clear hierarchy — viewers know where to look." },
      { dim: "consistency", max: 39, severity: "fail", text: "The deck looks made by different companies. A slide system fixes this in days." },
      { dim: "consistency", max: 69, severity: "warn", text: "Mostly consistent — lock down a master and stop freelancing." },
      { dim: "consistency", max: 100, severity: "pass", text: "Consistent — your brand compounds instead of fragmenting." },
    ],
    recommendations: [
      { dim: "readability", text: "Presentation design sprint: rewrite + redesign your core deck for the 90-second test." },
      { dim: "storytelling", text: "Story workshop: one session to find the throughline before touching design." },
      { dim: "hierarchy", text: "Slide system: grids, type scale and data-viz rules your team can reuse." },
      { dim: "consistency", text: "Template kit + training so every future deck ships on-brand." },
    ],
  },
  {
    slug: "brand-audit",
    name: "Brand Audit",
    kicker: "Audit · 3 minutes",
    intro: "How consistent is your brand across touchpoints? Score consistency, messaging, visual identity and asset health.",
    dimensions: [
      { key: "consistency", label: "Consistency" },
      { key: "messaging", label: "Messaging" },
      { key: "visual", label: "Visual identity" },
      { key: "assets", label: "Asset health" },
    ],
    questions: [
      { q: "Customers could describe what makes you different in one sentence.", dim: "messaging" },
      { q: "Your website, documents and social sound like one organisation.", dim: "consistency" },
      { q: "New hires quickly learn how to 'sound like us'.", dim: "consistency" },
      { q: "Your positioning hasn't drifted in the last year.", dim: "messaging" },
      { q: "Logo, colour and type are used correctly everywhere.", dim: "visual" },
      { q: "Your materials look current, not five years old.", dim: "visual" },
      { q: "Anyone can find your logo files and guidelines in minutes.", dim: "assets" },
      { q: "You have one source of truth for approved copy and facts.", dim: "assets" },
    ],
    findings: [
      { dim: "consistency", max: 39, severity: "fail", text: "Your brand is a committee — every channel improvises. A voice system is the fix." },
      { dim: "consistency", max: 69, severity: "warn", text: "Consistent in places; drift is creeping in at the edges." },
      { dim: "consistency", max: 100, severity: "pass", text: "One voice everywhere — rare and valuable." },
      { dim: "messaging", max: 39, severity: "fail", text: "If customers can't repeat your difference, your messaging is decoration." },
      { dim: "messaging", max: 69, severity: "warn", text: "The difference exists but it's buried — sharpen the claim." },
      { dim: "messaging", max: 100, severity: "pass", text: "Sharp positioning customers can repeat." },
      { dim: "visual", max: 39, severity: "fail", text: "Visual chaos: identity rules either don't exist or aren't followed." },
      { dim: "visual", max: 69, severity: "warn", text: "Visual identity works but has blind spots (docs? decks? social?)." },
      { dim: "visual", max: 100, severity: "pass", text: "Visual identity holds the line." },
      { dim: "assets", max: 39, severity: "fail", text: "Assets live in inboxes and heads — a Brand Brain fixes findability forever." },
      { dim: "assets", max: 69, severity: "warn", text: "Assets exist but cost time to find; centralise them." },
      { dim: "assets", max: 100, severity: "pass", text: "Healthy asset system — brand work compounds." },
    ],
    recommendations: [
      { dim: "consistency", text: "Voice system: guidelines + examples + Brand Brain so everything writes itself consistently." },
      { dim: "messaging", text: "Positioning sprint: one workshop, one sentence everyone can repeat." },
      { dim: "visual", text: "Identity refresh: audit touchpoints, fix the worst five first." },
      { dim: "assets", text: "Brand Brain build: one queryable home for guidelines, logos and approved facts." },
    ],
  },
  {
    slug: "process-audit",
    name: "Business Process Audit",
    kicker: "Audit · 4 minutes",
    intro: "Where does work get stuck? Score process maturity, bottlenecks, automation readiness and documentation.",
    dimensions: [
      { key: "maturity", label: "Process maturity" },
      { key: "bottlenecks", label: "Bottlenecks" },
      { key: "automation", label: "Automation readiness" },
      { key: "documentation", label: "Documentation" },
    ],
    questions: [
      { q: "Key processes are documented and actually followed.", dim: "maturity" },
      { q: "Work flows without a hero pushing it through.", dim: "maturity" },
      { q: "You can name the three slowest steps in your operation.", dim: "bottlenecks" },
      { q: "Approvals don't queue for days.", dim: "bottlenecks" },
      { q: "Repeated manual work (copy-paste, re-keying, chasing) is shrinking.", dim: "automation" },
      { q: "You could automate one workflow this quarter if you decided to.", dim: "automation" },
      { q: "New hires can find how work is done without asking three people.", dim: "documentation" },
      { q: "When someone leaves, their knowledge stays.", dim: "documentation" },
    ],
    findings: [
      { dim: "maturity", max: 39, severity: "fail", text: "Processes are habits, not systems — every week runs on memory." },
      { dim: "maturity", max: 69, severity: "warn", text: "Processes exist but enforcement is patchy." },
      { dim: "maturity", max: 100, severity: "pass", text: "Systematic — work survives absence and growth." },
      { dim: "bottlenecks", max: 39, severity: "fail", text: "Bottlenecks are invisible but expensive — map the value stream once." },
      { dim: "bottlenecks", max: 69, severity: "warn", text: "Known bottlenecks without owners — assign and unblock." },
      { dim: "bottlenecks", max: 100, severity: "pass", text: "Flow is visible and managed." },
      { dim: "automation", max: 39, severity: "fail", text: "Humans are doing robot work — quick automation wins are waiting." },
      { dim: "automation", max: 69, severity: "warn", text: "Some automation; the biggest hours are still manual." },
      { dim: "automation", max: 100, severity: "pass", text: "Automation-ready — or already automating." },
      { dim: "documentation", max: 39, severity: "fail", text: "Knowledge lives in heads — that's business risk, not a quirk." },
      { dim: "documentation", max: 69, severity: "warn", text: "Documentation exists but isn't trusted or found." },
      { dim: "documentation", max: 100, severity: "pass", text: "Institutional memory, engineered." },
    ],
    recommendations: [
      { dim: "maturity", text: "Process redesign engagement: map, simplify, own." },
      { dim: "bottlenecks", text: "Value-stream mapping session: find the queue, kill the queue." },
      { dim: "automation", text: "Automation audit: two weeks, ranked opportunities, first build included." },
      { dim: "documentation", text: "Knowledge architecture program: structure before content." },
    ],
  },
];

export function getAudit(slug: string) {
  return audits.find((a) => a.slug === slug);
}
