import { access, constants } from "fs/promises";
import path from "path";
import { llmAvailable } from "./concierge/llm";

export type SystemState = "operational" | "degraded" | "planned";
export type SystemCheck = { name: string; state: SystemState; note: string };

async function writable(dir: string) {
  try {
    await access(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

async function readable(file: string) {
  try {
    await access(file, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function getSystemStatus(): Promise<{ checks: SystemCheck[]; checkedAt: string; allOperational: boolean }> {
  const dataDir = path.join(process.cwd(), ".data");

  const [leadsOk, portalOk, uploadsOk, ai] = await Promise.all([
    writable(dataDir),
    readable(path.join(dataDir, "portal", "clients.json")),
    writable(path.join(dataDir, "portal")),
    Promise.resolve(llmAvailable()),
  ]);

  const checks: SystemCheck[] = [
    { name: "Website", state: "operational", note: "You're reading it." },
    {
      name: "Tools & assessments",
      state: leadsOk ? "operational" : "degraded",
      note: leadsOk ? "All calculators, audits and assessments running." : "Lead capture degraded — data store not writable.",
    },
    {
      name: "Client portal",
      state: portalOk ? "operational" : "degraded",
      note: portalOk ? "Workspaces, files and Brains serving." : "Seeding on first visit; if this persists, contact the studio.",
    },
    {
      name: "File delivery",
      state: uploadsOk ? "operational" : "degraded",
      note: uploadsOk ? "Vault uploads and downloads healthy." : "Upload storage not writable.",
    },
    {
      name: "AI services",
      state: ai ? "operational" : "operational",
      note: ai ? "LLM-backed concierge, analyses and Brains." : "Running on deterministic engines — set an LLM key for model-grade answers.",
    },
    {
      name: "Marketplace & payments",
      state: leadsOk ? "operational" : "degraded",
      note: leadsOk
        ? "Store and checkout live — manual payments while in beta."
        : "Order capture degraded — data store not writable.",
    },
  ];

  return {
    checks,
    checkedAt: new Date().toISOString(),
    allOperational: checks.every((c) => c.state !== "degraded"),
  };
}
