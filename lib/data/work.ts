export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  services: string[];
  challenge: string;
  approach: string[];
  outcome: string;
  metrics: { label: string; value: string }[];
  before: string[];
  after: string[];
  lessons: string[];
};

export const cases: CaseStudy[] = [
  {
    slug: "bank-knowledge-architecture",
    client: "Regional bank",
    industry: "Finance",
    services: ["strategy", "writing", "ai"],
    challenge: "4,000 employees, three mergers, zero shared source of truth. Onboarding took four months; auditors found a different answer every visit.",
    approach: [
      "90-day knowledge architecture program",
      "Mapped 9 knowledge domains, appointed 27 owners",
      "Rewrote the top 120 documents against one standard",
      "Built a Business Brain so staff query policies in plain language",
    ],
    outcome: "The single source of truth the regulator kept asking for — and staff actually use.",
    metrics: [
      { label: "Onboarding time", value: "−62%" },
      { label: "Audit findings on docs", value: "−81%" },
      { label: "Policy queries self-served", value: "74%" },
    ],
    before: ["Tribal knowledge across 3 merged banks", "1,900 unowned documents", "4-month onboarding", "Duplicate, contradictory SOPs"],
    after: ["One knowledge architecture, 27 owners", "Every document living or archived", "6-week onboarding", "Plain-language Business Brain"],
    lessons: ["Architecture before content", "Owners or it dies", "Search is not a strategy"],
  },
  {
    slug: "startup-series-a-deck",
    client: "Logistics startup",
    industry: "Technology",
    services: ["design", "writing"],
    challenge: "Great metrics, fatal deck: 43 slides of features, no argument. Three passed-on rounds.",
    approach: [
      "Rebuilt the throughline in one workshop",
      "Story-first restructure: 43 → 16 slides",
      "Data slides redesigned for the 90-second test",
      "Speaker notes and Q&A appendix system",
    ],
    outcome: "Raised a $4M Series A six weeks after the rebuild.",
    metrics: [
      { label: "Rounds to term sheet", value: "6 wks" },
      { label: "Slides", value: "43 → 16" },
      { label: "Investor meetings → 2nd", value: "58%" },
    ],
    before: ["43 slides, feature-ordered", "Numbers without narrative", "No ask", "Template design"],
    after: ["16 slides, argument-ordered", "One metric per claim", "Clear raise + use of funds", "Custom slide system"],
    lessons: ["Story before design", "Headlines must pitch alone", "Every slide advances or dies"],
  },
  {
    slug: "hotel-group-brand-system",
    client: "Hospitality group",
    industry: "Hospitality",
    services: ["design", "writing", "digital"],
    challenge: "Twelve properties, nine agencies, one inconsistent brand. Guests couldn't tell the properties apart — or find the booking flow.",
    approach: [
      "Brand audit across 10 touchpoints",
      "One voice system + Brand Brain",
      "Modular collateral system each property localises",
      "Booking journey rebuilt around three questions",
    ],
    outcome: "A brand that scales to new properties in days, not quarters.",
    metrics: [
      { label: "Booking conversion", value: "+34%" },
      { label: "Collateral production time", value: "−70%" },
      { label: "Brand consistency score", value: "41 → 92" },
    ],
    before: ["Nine agencies, drifting voice", "Bespoke collateral per property", "7-step booking flow", "No guidelines people used"],
    after: ["One system, local accents", "Modular templates", "3-step booking flow", "Brand Brain + training"],
    lessons: ["Consistency is a system", "Templates are freedom", "Book the guest, not the form"],
  },
  {
    slug: "manufacturer-automation",
    client: "Manufacturing group",
    industry: "Manufacturing",
    services: ["ai", "strategy"],
    challenge: "Eleven staff spending 30% of their week re-keying orders between email, ERP and spreadsheets. Errors shipped to customers weekly.",
    approach: [
      "Two-week process audit found 14 automatable steps",
      "Sequenced automations: quick wins funded the deep work",
      "Human-in-the-loop approvals for exceptions",
      "Team trained as automation owners, not victims",
    ],
    outcome: "30% of manual operations work removed — with zero layoffs, just redeployed to growth work.",
    metrics: [
      { label: "Manual hours / week", value: "−30%" },
      { label: "Order errors", value: "−94%" },
      { label: "Payback period", value: "11 wks" },
    ],
    before: ["Email → ERP re-keying", "Weekly error apologies", "No process documentation", "Tools nobody trusted"],
    after: ["Integrated order flow", "Errors caught upstream", "Documented + owned processes", "Team-run automations"],
    lessons: ["Process before platform", "Quick wins fund deep work", "Automate with the team, not at it"],
  },
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
