import type { LeadRecord } from "./leads";

const BUDGET_MAP: [match: RegExp, score: number, value: string][] = [
  [/25k\+/i, 40, "$25k+"],
  [/8k\s*[––-]\s*25k|\$?8k/i, 30, "$8k–25k"],
  [/2k\s*[––-]\s*8k/i, 20, "$2k–8k"],
  [/<\s*\$?2k/i, 10, "<$2k"],
];

const TIMELINE_MAP: [match: RegExp, score: number, urgency: string][] = [
  [/yesterday|asap|urgent/i, 20, "Emergency"],
  [/this month/i, 16, "Priority"],
  [/this quarter/i, 10, "Standard"],
  [/3\s*[––-]\s*6|months/i, 6, "Planned"],
  [/exploring/i, 3, "Exploring"],
];

export type EnrichedLead = LeadRecord & {
  score: number;
  value: string;
  urgency: string;
  interest: string;
};

function pickMap(text: string, map: [RegExp, number, string][]) {
  for (const [re, score, label] of map) {
    if (re.test(text)) return { score, label };
  }
  return { score: 0, label: "" };
}

export function enrichLead(lead: LeadRecord): EnrichedLead {
  const blob = JSON.stringify(lead).toLowerCase();
  let score = 0;

  if (lead.email) score += 15;
  if (lead.name) score += 10;
  if (lead.company) score += 10;

  const longText = [lead.message, lead.brief, lead.problem].filter((x) => typeof x === "string" && (x as string).length > 80);
  if (longText.length) score += 10;

  const budget = pickMap(blob, BUDGET_MAP);
  score += budget.score;

  const timeline = pickMap(blob, TIMELINE_MAP);
  score += timeline.score;

  if (/score/i.test(blob)) score += 10; // came through an assessment — high intent
  if (lead.type === "brief") score += 5;

  const interest =
    (lead.goal as string) ||
    (lead.tool as string) ||
    (Array.isArray(lead.services) ? (lead.services as string[]).join(", ") : "") ||
    (lead.type as string) ||
    "—";

  return {
    ...lead,
    score: Math.min(100, score),
    value: budget.label || "Unknown",
    urgency: timeline.label || "—",
    interest,
  };
}

export const LEAD_STATUSES = ["new", "contacted", "proposal", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
