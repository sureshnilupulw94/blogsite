export type Report = {
  slug: string;
  title: string;
  year: string;
  status: "upcoming" | "available";
  summary: string;
  findings: string[];
  contents: string[];
  fieldwork: string;
};

export const reports: Report[] = [
  {
    slug: "state-of-business-ai-2027",
    title: "State of Business AI Adoption",
    year: "2027",
    status: "available",
    summary:
      "Our annual study of how mid-sized businesses actually adopt AI — not the hype version. What changed, what stalled, and what the top quartile does differently.",
    findings: [
      "68% of companies bought an AI tool before mapping the process it was meant to improve — and 4 in 5 of those tools were abandoned within six months.",
      "The strongest predictor of AI ROI wasn't budget or data volume — it was documentation quality.",
      "Teams that fixed one workflow end-to-end before expanding were 3.2× more likely to report measurable savings.",
      "Average time-to-first-automation-value fell from 5 months (2025) to 7 weeks (2026) for businesses following a structured readiness path.",
    ],
    contents: ["Readiness index by sector", "The documentation dividend", "Automation sequencing patterns", "Failure modes & early warnings", "90-day adoption playbook"],
    fieldwork: "Methodology: 214 mid-sized businesses (10–500 staff) across 9 industries; structured interviews with 37 operations leaders; Q1–Q2 2027.",
  },
];

export function getReport(slug: string) {
  return reports.find((r) => r.slug === slug);
}
