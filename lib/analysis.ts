import { services } from "./data/services";
import { recommendByRules, type ConciergeInput } from "./concierge/engine";
import { llmAvailable, llmChat } from "./concierge/llm";
import type { LeadRecord } from "./leads";

export type LeadAnalysis = {
  leadId: string;
  at: string;
  engine: "llm" | "rules";
  services: string[]; // slugs, primary first
  effortDays: number;
  priceBand: string;
  team: string[];
  risks: string[];
  notes: string;
};

const EFFORT_DAYS: Record<string, number> = {
  writing: 6, design: 10, digital: 20, strategy: 12, ai: 18, podcast: 8, training: 4,
};

const TEAM: Record<string, string[]> = {
  writing: ["Writer"],
  design: ["Designer"],
  digital: ["Engineer"],
  strategy: ["Strategist"],
  ai: ["Engineer", "Strategist"],
  podcast: ["Host", "Editor"],
  training: ["Strategist", "Writer"],
};

function priceBandFor(days: number) {
  if (days <= 8) return "Starter · $1.2k–3.8k";
  if (days <= 16) return "Launch · $3.8k–8.5k";
  if (days <= 32) return "Growth · $8.5k–18k";
  return "Transform · $18k+";
}

function leadText(lead: LeadRecord) {
  return [lead.goal, lead.problem, lead.success, lead.message, lead.brief, lead.services, lead.interest, lead.tool]
    .filter((x) => typeof x === "string" && x.length > 1)
    .join(". ");
}

function parseBudget(blob: string): number {
  const m = blob.match(/\$?\s?(\d{1,3})[.,]?\d*\s?(k|K)/);
  return m ? Number(m[1]) * 1000 : 0;
}

export async function analyzeLead(lead: LeadRecord): Promise<LeadAnalysis> {
  const blob = JSON.stringify(lead);
  const text = leadText(lead);
  const input: ConciergeInput = {
    goal: typeof lead.goal === "string" ? lead.goal : undefined,
    freeform: text.slice(0, 2000),
    deadline: /yesterday|asap|urgent|this month/i.test(blob) ? "This month" : undefined,
    budget: parseBudget(blob) ? "indicated" : undefined,
  };

  const fallback = recommendByRules(input);
  const base = [fallback.primaryService, ...fallback.supportingServices].filter((s, i, arr) => arr.indexOf(s) === i).slice(0, 4);
  const days = base.reduce((acc, slug) => acc + (EFFORT_DAYS[slug] ?? 6), 0);
  const team = Array.from(new Set(base.flatMap((s) => TEAM[s] ?? ["Strategist"])));

  const rulesResult: LeadAnalysis = {
    leadId: lead.id,
    at: new Date().toISOString(),
    engine: "rules",
    services: base,
    effortDays: days,
    priceBand: priceBandFor(days),
    team,
    risks: fallback.risks.slice(0, 3),
    notes: fallback.rationale.split(". ").slice(0, 2).join(". ") + ".",
  };

  if (!llmAvailable()) return rulesResult;

  const system = `You are the studio's lead analyst for The Flagship agency. Given a lead record (JSON), respond ONLY with JSON:
{"services": [slug,...], "effortDays": number, "risks": [string,...], "team": [string,...], "notes": string}
Allowed slugs: ${services.map((s) => s.slug).join(", ")}. effortDays = total studio working days. 2-3 concrete risks. team = roles (Writer, Designer, Engineer, Strategist, Host, Editor). notes = 2 sentences on how to win this engagement.`;
  const raw = await llmChat(system, JSON.stringify(lead).slice(0, 3000));
  if (!raw) return rulesResult;
  try {
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
    const valid = services.map((s) => s.slug);
    const slugs: string[] = Array.isArray(parsed.services) ? parsed.services.filter((s: string) => valid.includes(s)).slice(0, 4) : [];
    if (!slugs.length) return rulesResult;
    const effort = Number(parsed.effortDays);
    return {
      leadId: lead.id,
      at: new Date().toISOString(),
      engine: "llm",
      services: slugs,
      effortDays: Number.isFinite(effort) && effort > 0 ? Math.min(200, Math.round(effort)) : slugs.reduce((a, s) => a + (EFFORT_DAYS[s] ?? 6), 0),
      priceBand: priceBandFor(Number.isFinite(effort) && effort > 0 ? effort : 10),
      team: Array.isArray(parsed.team) ? parsed.team.slice(0, 5).map(String) : team,
      risks: Array.isArray(parsed.risks) ? parsed.risks.slice(0, 3).map(String) : fallback.risks.slice(0, 3),
      notes: typeof parsed.notes === "string" ? parsed.notes.slice(0, 400) : rulesResult.notes,
    };
  } catch {
    return rulesResult;
  }
}
