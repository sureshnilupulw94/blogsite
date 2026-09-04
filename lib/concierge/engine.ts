import { goals } from "@/lib/data/tools";
import { services } from "@/lib/data/services";

export type ConciergeInput = {
  goal?: string; // goal slug or free text
  blocker?: string;
  materials?: string[];
  deadline?: string;
  budget?: string;
  freeform?: string;
};

export type Recommendation = {
  primaryService: string; // slug
  supportingServices: string[]; // slugs
  headline: string;
  rationale: string;
  phases: string[];
  risks: string[];
  questions: string[];
  nextStep: string;
  engine: "llm" | "rules";
};

/* keyword → service slug weights */
const KEYWORDS: [RegExp, string, number][] = [
  [/website|web site|landing|web page|seo|site:/i, "digital", 3],
  [/redesign|rebrand|re-brand/i, "design", 3],
  [/deck|presentation|slides|pitch/i, "design", 3],
  [/logo|brand|identity|visual/i, "design", 2],
  [/copy|writing|write|content|blog|article|profile|brochure/i, "writing", 3],
  [/proposal|report|document|documentation|sop/i, "writing", 2],
  [/investor|fundrais|raise/i, "writing", 2],
  [/automat|workflow|ai|chatbot|agent|assistant|llm|gpt/i, "ai", 3],
  [/process|efficien|bottleneck|operat|transform|scale|growth/i, "strategy", 3],
  [/strategy|position|market|research/i, "strategy", 2],
  [/podcast|episode|show|interview|media/i, "podcast", 3],
  [/train|workshop|coach|upskill|team/i, "training", 2],
  [/e-?commerce|shop|store|checkout/i, "digital", 2],
  [/knowledge|wiki|brain/i, "ai", 2],
];

const RISK_BY_BLOCKER: Record<string, string> = {
  time: "Capacity risk: with the team at capacity, scope must start small or a dedicated production slot is needed.",
  clarity: "Direction risk: the approach isn't settled — discovery should precede any production work.",
  skills: "Capability risk: in-house skills don't cover this — knowledge transfer should be built into the engagement.",
  quality: "Quality risk: existing materials may anchor expectations — an audit first prevents polishing the wrong thing.",
  chaos: "Process risk: automating or designing on top of broken processes multiplies the mess.",
  nothing: "Low risk — this is a straightforward production engagement.",
};

const RISK_BY_DEADLINE: Record<string, string> = {
  Yesterday: "Timeline risk: emergency pace requires dedicated capacity and decisive feedback loops.",
  "This month": "Timeline risk: tight — scope must be frozen early; changes become phase 2.",
};

function scoreServices(input: ConciergeInput): Map<string, number> {
  const scores = new Map<string, number>();
  const add = (slug: string, n: number) => scores.set(slug, (scores.get(slug) ?? 0) + n);

  const goal = goals.find((g) => g.slug === input.goal);
  if (goal) {
    goal.services.forEach((s, i) => add(s, i === 0 ? 5 : 3));
  }
  if (input.blocker === "chaos") add("strategy", 3);
  if (input.blocker === "quality") add("strategy", 2);
  if (input.blocker === "skills") add("training", 2);

  const text = `${input.goal ?? ""} ${input.freeform ?? ""} ${(input.materials ?? []).join(" ")}`;
  for (const [re, slug, weight] of KEYWORDS) {
    if (re.test(text)) add(slug, weight);
  }
  return scores;
}

export function recommendByRules(input: ConciergeInput): Recommendation {
  const scores = scoreServices(input);
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const valid = ranked.filter(([slug]) => services.some((s) => s.slug === slug));
  const primary = valid[0]?.[0] ?? "strategy";
  const supporting = valid.slice(1, 3).map(([slug]) => slug);
  if (!supporting.length) {
    const goal = goals.find((g) => g.slug === input.goal);
    supporting.push(...(goal ? goal.services.filter((s) => s !== primary).slice(0, 2) : ["writing", "design"]));
  }

  const primaryService = services.find((s) => s.slug === primary)!;
  const goalLabel = goals.find((g) => g.slug === input.goal)?.label ?? input.freeform?.slice(0, 80) ?? "your goal";

  const risks = [
    ...(input.blocker ? [RISK_BY_BLOCKER[input.blocker] ?? RISK_BY_BLOCKER.nothing] : []),
    ...(input.deadline ? [RISK_BY_DEADLINE[input.deadline]].filter(Boolean) : []),
    ...(input.budget === "Not sure yet" ? ["Budget risk: undefined budget — the discovery phase should end with a costed roadmap, not an open tab."] : []),
  ].filter((x): x is string => Boolean(x));

  const questions: string[] = [];
  if (!(input.materials ?? []).length) questions.push("Do any existing materials (brand, site, docs) exist — even rough ones?");
  if (!input.deadline) questions.push("Is there a date this must ship against?");
  if (!input.budget) questions.push("What budget range makes this a no-brainer for you?");
  questions.push(`Who besides you needs to approve ${primaryService.short.toLowerCase()} work?`);

  const phases = ["Discovery", "Audit", "Strategy", "Implementation"];
  if (input.deadline === "Yesterday") phases.unshift("Fast-track sprint (2 weeks)");

  return {
    primaryService: primary,
    supportingServices: supporting.slice(0, 2),
    headline: `${primaryService.title} — ${goalLabel}`,
    rationale: `Based on what you told us — "${goalLabel}"${input.blocker ? `, blocked by ${input.blocker === "nothing" ? "nothing — you just need it done" : input.blocker}` : ""} — ${primaryService.title.toLowerCase()} carries the outcome: ${primaryService.summary.split(".")[0].toLowerCase()}. ${supporting.length ? `Supporting work in ${supporting.map((s) => services.find((x) => x.slug === s)?.short).join(" and ")} makes it stick.` : ""}`.replace(/\s+/g, " "),
    phases,
    risks,
    questions,
    nextStep: input.budget === "Not sure yet" || input.deadline === "Exploring for now"
      ? "Start with a discovery call — we'll scope honestly before anything is committed."
      : "Turn this into a project brief and we'll respond within one working day.",
    engine: "rules",
  };
}

/* ---------- validation for LLM output ---------- */

const SLUGS = new Set(services.map((s) => s.slug));

export function isValidRecommendation(value: unknown): value is Recommendation {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<Recommendation>;
  return (
    typeof r.primaryService === "string" &&
    SLUGS.has(r.primaryService) &&
    Array.isArray(r.supportingServices) &&
    r.supportingServices.every((s) => typeof s === "string" && SLUGS.has(s)) &&
    typeof r.rationale === "string" &&
    Array.isArray(r.phases) &&
    r.phases.every((p) => typeof p === "string")
  );
}
