import { mkdir, appendFile } from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), ".data");

export async function recordLead(kind: "leads" | "subscribers", payload: Record<string, unknown>) {
  const entry = JSON.stringify({ at: new Date().toISOString(), ...payload }) + "\n";
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, `${kind}.jsonl`), entry, "utf8");
}
