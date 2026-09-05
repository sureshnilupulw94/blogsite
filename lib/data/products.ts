export type Product = {
  slug: string;
  name: string;
  tag: "Template" | "Kit" | "System" | "Pack";
  blurb: string;
  includes: string[];
  priceUsd: number;
};

export const products: Product[] = [
  { slug: "deck-system", name: "The Deck System", tag: "System", blurb: "The slide architecture behind our pitch decks — grids, type scale, storyline scaffold.", includes: ["Slide master (Figma + PPT)", "Storyline scaffold", "Data-viz rules", "90-second test checklist"], priceUsd: 79 },
  { slug: "document-kit", name: "Business Document Kit", blurb: "Proposals, reports and one-pagers that look like they cost 10x more.", tag: "Kit", includes: ["12 document templates", "Style tokens", "Page architecture guide"], priceUsd: 59 },
  { slug: "brand-kit", name: "Brand Starter Kit", blurb: "Everything a small business needs to look consistent from day one.", tag: "Kit", includes: ["Logo & usage system", "Colour + type tokens", "Voice worksheet", "Social templates"], priceUsd: 89 },
  { slug: "sop-system", name: "SOP System (Notion)", blurb: "The knowledge-architecture structure we install for clients, ready to run.", tag: "System", includes: ["Knowledge map canvas", "SOP template set", "Review-cycle rules", "Onboarding flow"], priceUsd: 49 },
  { slug: "ai-prompt-pack", name: "Studio AI Prompt Pack", blurb: "The prompts behind our writing and analysis workflows — tuned, tested, honest.", tag: "Pack", includes: ["40+ operational prompts", "Voice-cloning patterns", "Review guardrails"], priceUsd: 39 },
  { slug: "research-template", name: "Research Report Template", blurb: "Structure a credible research report — from question to findings to decision.", tag: "Template", includes: ["Report skeleton", "Findings frameworks", "Charts library"], priceUsd: 45 },
];

export type MembershipTier = {
  slug: string;
  name: string;
  priceUsd: number;
  cadence: string;
  blurb: string;
  includes: string[];
  featured?: boolean;
};

export const membership: MembershipTier[] = [
  {
    slug: "member",
    name: "Member",
    priceUsd: 29,
    cadence: "/mo",
    blurb: "The library, live.",
    includes: ["All templates & frameworks", "Monthly brief + research drops", "Members-only articles"],
  },
  {
    slug: "studio",
    name: "Studio+",
    priceUsd: 99,
    cadence: "/mo",
    blurb: "Tools + humans.",
    includes: ["Everything in Member", "All interactive tools, unlimited", "Monthly office hours", "Workshop recordings", "Priority tool support"],
    featured: true,
  },
  {
    slug: "team",
    name: "Team",
    priceUsd: 0,
    cadence: "custom",
    blurb: "For organisations.",
    includes: ["Everything in Studio+", "Team seats & shared workspace", "Private workshops", "Quarterly transformation review"],
  },
];
