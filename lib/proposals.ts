import { randomBytes, randomUUID } from "crypto";
import { readJsonStore, writeJsonStore } from "./leads";
import { getService } from "./data/services";

export type ProposalStatus = "draft" | "sent" | "accepted" | "declined";

export type Proposal = {
  id: string;
  createdAt: string;
  status: ProposalStatus;
  shareToken?: string;
  sharedAt?: string;
  client: { name: string; company: string; email: string };
  objective: string;
  services: string[];
  timelineWeeks: number;
  price: number;
  currency: string;
  scope: string[];
  phases: string[];
  terms: string[];
  notes: string;
};

const STANDARD_TERMS = [
  "50% to schedule, 50% on delivery unless agreed otherwise; retainers bill monthly in advance.",
  "Two structured revision rounds per deliverable are included; further rounds are a scope change we'll quote transparently.",
  "On final payment, all deliverables and source files are yours. Flagship methodologies remain licensed for your internal use.",
  "Everything you share is confidential by default. NDAs available on request.",
];

export function buildProposal(input: {
  client: { name: string; company: string; email: string };
  objective: string;
  services: string[];
  timelineWeeks: number;
  price: number;
  notes?: string;
}): Proposal {
  const scope = Array.from(
    new Set(input.services.flatMap((slug) => getService(slug)?.deliverables.slice(0, 3) ?? []))
  ).slice(0, 12);
  const phases = ["Clarify", "Research", "Engineer", "Activate", "Transform", "Evolve"];

  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "draft",
    client: input.client,
    objective: input.objective,
    services: input.services,
    timelineWeeks: Math.min(52, Math.max(1, input.timelineWeeks || 4)),
    price: Math.max(0, input.price || 0),
    currency: "USD",
    scope: scope.length ? scope : ["Scope to be defined in discovery."],
    phases,
    terms: STANDARD_TERMS,
    notes: input.notes?.slice(0, 600) ?? "",
  };
}

export async function listProposals(): Promise<Proposal[]> {
  return readJsonStore<Proposal[]>("proposals.json", []);
}

export async function saveProposal(p: Proposal) {
  const all = await listProposals();
  all.unshift(p);
  await writeJsonStore("proposals.json", all);
  return p;
}

export async function getProposal(id: string): Promise<Proposal | null> {
  return (await listProposals()).find((p) => p.id === id) ?? null;
}

export async function setProposalStatus(id: string, status: ProposalStatus) {
  const all = await listProposals();
  const p = all.find((x) => x.id === id);
  if (!p) return;
  p.status = status;
  await writeJsonStore("proposals.json", all);
}

export async function createShareToken(id: string): Promise<string | null> {
  const all = await listProposals();
  const p = all.find((x) => x.id === id);
  if (!p) return null;
  if (p.shareToken) return p.shareToken;
  p.shareToken = randomBytes(12).toString("hex");
  p.sharedAt = new Date().toISOString();
  if (p.status === "draft") p.status = "sent";
  await writeJsonStore("proposals.json", all);
  return p.shareToken;
}

export async function getProposalByToken(token: string): Promise<Proposal | null> {
  if (!/^[a-f0-9]{24}$/i.test(token)) return null;
  return (await listProposals()).find((p) => p.shareToken === token) ?? null;
}
