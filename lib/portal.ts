import { createHmac, randomBytes, randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const portalDir = path.join(process.cwd(), ".data", "portal");

export const PORTAL_COOKIE = "fs_portal";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_TTL_MS = 30 * 60 * 1000;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/* ---------- types ---------- */

export type PortalClient = { slug: string; email: string; company: string; createdAt: string };
export type PortalSession = { email: string; slug: string; exp: number };
export type Milestone = { id: string; title: string; status: "done" | "current" | "todo"; awaiting?: boolean };
export type DeliverableStatus = "draft" | "internal" | "client-review" | "revision" | "approved" | "final";
export type DocPage = { n: number; title: string; body: string[] };
export type Deliverable = { id: string; title: string; status: DeliverableStatus; updatedAt: string; pages?: DocPage[] };
export type PortalFile = { id: string; name: string; size: number; category: string; uploadedAt: string; path: string };
export type BrainEntry = { id: string; title: string; addedAt: string; chunks: string[] };
export type PortalComment = { id: string; deliverableId: string; author: string; message: string; at: string; resolved: boolean; page?: number; x?: number; y?: number };
export type WorkspaceTask = { id: string; title: string; assignee?: string; done: boolean; createdAt: string };
export type TimeEntry = { id: string; date: string; minutes: number; who: string; note?: string };
export type Activity = { at: string; text: string };
export type Workspace = {
  project: { name: string; stage: string; nextAction: string; updatedAt: string };
  milestones: Milestone[];
  deliverables: Deliverable[];
  files: PortalFile[];
  brain: BrainEntry[];
  businessBrain: BrainEntry[];
  comments: PortalComment[];
  tasks: WorkspaceTask[];
  time: TimeEntry[];
  activity: Activity[];
};

type LoginToken = { token: string; email: string; slug: string; exp: number; used: boolean };

/* ---------- sessions (HMAC-signed cookie) ---------- */

function secret() {
  return process.env.PORTAL_SECRET ?? "flagship-portal-dev-secret";
}

export function signSession(email: string, slug: string) {
  const payload = Buffer.from(JSON.stringify({ email, slug, exp: Date.now() + SESSION_TTL_MS })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): PortalSession | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as PortalSession;
    if (!session.exp || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function timingSafeEqual(a: Buffer, b: Buffer) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

export async function getSession(): Promise<PortalSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(PORTAL_COOKIE)?.value);
}

export async function requirePortal(): Promise<PortalSession> {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  return session;
}

/* ---------- json store helpers ---------- */

async function readJson<T>(rel: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path.join(portalDir, rel), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(rel: string, data: unknown) {
  const full = path.join(portalDir, rel);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, JSON.stringify(data, null, 2), "utf8");
}

/* ---------- clients ---------- */

export async function listClients(): Promise<PortalClient[]> {
  return readJson<PortalClient[]>("clients.json", []);
}

async function saveClients(clients: PortalClient[]) {
  await writeJson("clients.json", clients);
}

export async function getClientByEmail(email: string): Promise<PortalClient | null> {
  const clients = await listClients();
  return clients.find((c) => c.email === email.toLowerCase()) ?? null;
}

function slugify(input: string) {
  const base = input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "client";
  return base;
}

export async function createPortalClient(input: { email: string; company: string; project?: string }): Promise<PortalClient | { error: string }> {
  const email = input.email.trim().toLowerCase();
  const company = input.company.trim();
  if (!email.includes("@") || !company) return { error: "Valid email and company name are required." };

  const clients = await listClients();
  if (clients.some((c) => c.email === email)) return { error: "A portal account already exists for this email." };

  let slug = slugify(company);
  while (clients.some((c) => c.slug === slug)) slug = `${slug}-${randomBytes(2).toString("hex")}`;

  const client: PortalClient = { slug, email, company, createdAt: new Date().toISOString() };
  clients.push(client);
  await saveClients(clients);
  await writeWorkspace(slug, defaultWorkspace(input.project?.trim() || "New Engagement"));
  return client;
}

/* ---------- workspace ---------- */

export function defaultWorkspace(projectName: string): Workspace {
  return {
    project: { name: projectName, stage: "Discovery", nextAction: "Kick-off call", updatedAt: new Date().toISOString() },
    milestones: [
      { id: randomUUID(), title: "Discovery", status: "current", awaiting: false },
      { id: randomUUID(), title: "Content", status: "todo" },
      { id: randomUUID(), title: "First design", status: "todo" },
      { id: randomUUID(), title: "Review", status: "todo" },
      { id: randomUUID(), title: "Final delivery", status: "todo" },
    ],
    deliverables: [],
    files: [],
    brain: [],
    businessBrain: [],
    comments: [],
    tasks: [],
    time: [],
    activity: [{ at: new Date().toISOString(), text: "Project workspace created." }],
  };
}

export async function readWorkspace(slug: string): Promise<Workspace | null> {
  return readJson<Workspace | null>(path.join(slug, "workspace.json"), null);
}

export async function writeWorkspace(slug: string, ws: Workspace) {
  await writeJson(path.join(slug, "workspace.json"), ws);
}

export async function mutateWorkspace(slug: string, fn: (ws: Workspace) => void): Promise<Workspace | null> {
  const ws = await readWorkspace(slug);
  if (!ws) return null;
  fn(ws);
  ws.project.updatedAt = new Date().toISOString();
  await writeWorkspace(slug, ws);
  return ws;
}

export function pushActivity(ws: Workspace, text: string) {
  ws.activity.unshift({ at: new Date().toISOString(), text });
  ws.activity = ws.activity.slice(0, 50);
}

/* ---------- uploads ---------- */

export function uploadsDir(slug: string) {
  return path.join(portalDir, slug, "uploads");
}

export async function saveUpload(slug: string, file: { name: string; size: number; bytes: Buffer }, category: string): Promise<PortalFile | { error: string }> {
  if (file.size > MAX_UPLOAD_BYTES) return { error: "File exceeds the 5 MB limit." };
  const safeName = file.name.replace(/[\\/]/g, "").replace(/[^\w.\- ]+/g, "_").slice(0, 120) || "file";
  const stored = `${randomUUID().slice(0, 8)}_${safeName}`;
  const dir = uploadsDir(slug);
  await mkdir(dir, { recursive: true });
  const { writeFile: write } = await import("fs/promises");
  await write(path.join(dir, stored), file.bytes);
  const meta: PortalFile = { id: randomUUID(), name: safeName, size: file.size, category: category || "Other", uploadedAt: new Date().toISOString(), path: stored };
  await mutateWorkspace(slug, (ws) => {
    ws.files.unshift(meta);
    pushActivity(ws, `File uploaded: ${safeName}`);
  });
  return meta;
}

/* ---------- brand brain ---------- */

export function chunkText(text: string): string[] {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    if ((current + " " + p).length > 800 && current) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? `${current}\n${p}` : p;
    }
  }
  if (current) chunks.push(current);
  return chunks.length ? chunks : [text.slice(0, 800)];
}

export async function addBrainEntry(slug: string, which: "brand" | "business", title: string, text: string): Promise<BrainEntry | { error: string }> {
  if (text.trim().length < 20) return { error: "Add at least a few sentences of knowledge." };
  const entry: BrainEntry = { id: randomUUID(), title: title.trim() || "Untitled note", addedAt: new Date().toISOString(), chunks: chunkText(text) };
  await mutateWorkspace(slug, (ws) => {
    if (which === "business") {
      ws.businessBrain.unshift(entry);
      pushActivity(ws, `Business Brain updated: ${entry.title}`);
    } else {
      ws.brain.unshift(entry);
      pushActivity(ws, `Brand Brain updated: ${entry.title}`);
    }
  });
  return entry;
}

const STOPWORDS = new Set([
  "the", "and", "for", "are", "was", "were", "has", "had", "have", "what", "which", "who", "whom",
  "how", "does", "did", "do", "you", "your", "our", "ours", "with", "from", "that", "this", "these",
  "those", "there", "here", "when", "where", "why", "will", "would", "can", "could", "should",
  "about", "into", "over", "under", "again", "then", "them", "they", "their", "been", "being",
  "any", "all", "each", "more", "most", "other", "some", "such", "only", "own", "same", "than",
  "too", "very", "just", "also", "get", "got", "use", "using", "one", "two",
]);

export function queryTerms(query: string): string[] {
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter((t) => t.length > 2 && !STOPWORDS.has(t))
    )
  );
}

/** Index of the first occurrence of any term (or its 5-char stem) — for snippet centering. -1 if none. */
export function firstMatchIndex(lowerHaystack: string, terms: string[]): number {
  let best = -1;
  for (const t of terms) {
    const probes = t.length > 5 ? [t, t.slice(0, 5)] : [t];
    for (const p of probes) {
      const i = lowerHaystack.indexOf(p);
      if (i !== -1 && (best === -1 || i < best)) best = i;
    }
  }
  return best;
}

export function searchBrain(brain: BrainEntry[], query: string, limit = 6) {
  const tokens = queryTerms(query);
  if (!tokens.length) return [];
  const hits: { title: string; chunk: string; score: number }[] = [];
  for (const entry of brain) {
    for (const chunk of entry.chunks) {
      const lower = chunk.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        // exact match counts full; fall back to a 5-char stem prefix (cheap stemming)
        const probes = t.length > 5 ? [t, t.slice(0, 5)] : [t];
        probes.forEach((probe, weight) => {
          let idx = lower.indexOf(probe);
          while (idx !== -1) {
            score += weight === 0 ? 2 : 1;
            idx = lower.indexOf(probe, idx + probe.length);
          }
        });
      }
      if (score > 0) hits.push({ title: entry.title, chunk, score });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/* ---------- magic-link tokens ---------- */

export async function createLoginToken(email: string): Promise<string | null> {
  const client = await getClientByEmail(email);
  if (!client) return null;
  const tokens = await readJson<LoginToken[]>("tokens.json", []);
  const token = randomBytes(24).toString("hex");
  tokens.push({ token, email: client.email, slug: client.slug, exp: Date.now() + TOKEN_TTL_MS, used: false });
  await writeJson("tokens.json", tokens);
  return token;
}

export async function consumeLoginToken(token: string): Promise<{ email: string; slug: string } | null> {
  const tokens = await readJson<LoginToken[]>("tokens.json", []);
  const hit = tokens.find((t) => t.token === token && !t.used && t.exp > Date.now());
  if (!hit) return null;
  hit.used = true;
  await writeJson("tokens.json", tokens);
  return { email: hit.email, slug: hit.slug };
}

/* ---------- demo seed ---------- */

const ACME_BRAIN = `Tagline: "Forward, together." — always sentence case, always with the period.

Voice: plain, confident, warm. Short sentences. We explain logistics like a smart friend would — no jargon walls, no hype. If a sentence would embarrass us read aloud at a client dinner, it does not ship.

Colours: Deep Harbours Green #0E7C66 (primary), Warm Paper #F5F2EA (background), Ink #111418 (text), Signal Lime #D6FF3F (accents only, never body text).

Typography: Söhne for headlines (fallback: Inter), Inter for body. Line length maximum 72 characters. Never use more than two typefaces in one document.

Banned words: "solutions provider", "synergy", "world-class", "seamless", "best-in-class", "leverage" as a verb. Approved alternatives: partner, together, reliable, end-to-end.

Company facts: founded 2014 · 48 staff · offices in Colombo and Kandy · services: warehousing, last-mile delivery, customs clearance, cold chain. ISO 9001 certified since 2019.

Signature rules: every email ends with "Forward, together." on its own line, then name and role. No inspirational quotes in signatures.`;

const ACME_BUSINESS_BRAIN = `Order intake SOP: All orders arrive via the portal, email or phone. Phone orders must be entered in the portal before 4pm the same day. Always confirm the customer code, delivery address and time window. Flag any order above LKR 500,000 for finance review before confirmation.

Refund policy: full refund if cancelled before dispatch. After dispatch a 15% restocking fee applies to standard goods; cold chain goods are non-refundable once dispatched. Refunds are processed within 7 working days to the original payment method.

Delayed shipment escalation: if a delivery slips more than 2 hours past the window — 1) the driver calls dispatch, 2) dispatch informs the customer with a new ETA, 3) any slip over 6 hours escalates to the operations manager, and the account manager sends a written apology with a LKR 2,500 service credit.

Discount approvals: sales reps may offer up to 5%. 5–10% requires the sales manager. Above 10% requires a director. Every discount is recorded in the CRM with a reason code.

Company FAQ: offices in Colombo (HQ) and Kandy · 14 cold-chain vehicles · 3 warehouses totalling 22,000 sqm · 48 staff · ISO 9001 since 2019 · average on-time delivery 96.4%.`;

const PROFILE_PAGES: DocPage[] = [
  {
    n: 1,
    title: "ACME LOGISTICS",
    body: ["Company Profile — 2026", "Forward, together."],
  },
  {
    n: 2,
    title: "Who we are",
    body: [
      "Acme Logistics moves what matters across Sri Lanka — reliably, visibly, and without drama. Since 2014 we have grown from one warehouse in Colombo to a national network covering warehousing, last-mile delivery, customs clearance and cold chain.",
      "48 people, three warehouses, fourteen cold-chain vehicles, and one conviction: logistics is a promise kept on a schedule.",
    ],
  },
  {
    n: 3,
    title: "What we do",
    body: [
      "Warehousing — 22,000 sqm across three sites, ISO 9001 certified since 2019.",
      "Last-mile delivery — nationwide coverage with live tracking and 96.4% on-time performance.",
      "Customs clearance — in-house brokerage team, average clearance under 24 hours.",
      "Cold chain — temperature-controlled transport for food and pharma, end-to-end monitored.",
    ],
  },
  {
    n: 4,
    title: "Why Acme",
    body: [
      "One accountable partner from port to doorstep.",
      "Live visibility on every shipment — no chasing, no guessing.",
      "96.4% on-time. Audited. Insured. Obsessive about it.",
      "Let's move what matters. hello@acme.example · +94 11 000 0000",
    ],
  },
];

export async function ensureSeeded() {
  const clients = await listClients();

  // migrate + self-heal existing workspaces
  for (const c of clients) {
    const ws = await readWorkspace(c.slug);
    if (!ws) {
      await writeWorkspace(c.slug, defaultWorkspace("New Engagement"));
      continue;
    }
    let dirty = false;
    if (!Array.isArray(ws.businessBrain)) {
      ws.businessBrain = [];
      dirty = true;
    }
    if (!Array.isArray(ws.tasks)) {
      ws.tasks = [];
      dirty = true;
    }
    if (!Array.isArray(ws.time)) {
      ws.time = [];
      dirty = true;
    }
    const profile = ws.deliverables.find((d) => d.title.startsWith("Company Profile"));
    if (profile && !profile.pages) {
      profile.pages = PROFILE_PAGES;
      dirty = true;
    }
    if (dirty) await writeWorkspace(c.slug, ws);
  }
  if (clients.length) return;

  const created = await createPortalClient({ email: "demo@acme.example", company: "Acme Logistics", project: "Company Profile Redesign" });
  if ("error" in created) return;

  await mutateWorkspace(created.slug, (ws) => {
    ws.project = { name: "Company Profile Redesign", stage: "Design Review", nextAction: "Approve Version 03 of the company profile", updatedAt: new Date().toISOString() };
    ws.milestones = [
      { id: randomUUID(), title: "Discovery", status: "done" },
      { id: randomUUID(), title: "Content", status: "done" },
      { id: randomUUID(), title: "First design", status: "done" },
      { id: randomUUID(), title: "Review", status: "current", awaiting: true },
      { id: randomUUID(), title: "Final delivery", status: "todo" },
    ];
    ws.deliverables = [
      { id: randomUUID(), title: "Company Profile — v03", status: "client-review", updatedAt: new Date().toISOString(), pages: PROFILE_PAGES },
      { id: randomUUID(), title: "Website copy — v02", status: "approved", updatedAt: new Date().toISOString() },
      { id: randomUUID(), title: "Investor one-pager — v01", status: "draft", updatedAt: new Date().toISOString() },
    ];
    const profileId = ws.deliverables[0].id;
    ws.brain = [{ id: randomUUID(), title: "ACME Brand Guidelines (summary)", addedAt: new Date().toISOString(), chunks: chunkText(ACME_BRAIN) }];
    ws.businessBrain = [{ id: randomUUID(), title: "ACME Operations Knowledge", addedAt: new Date().toISOString(), chunks: chunkText(ACME_BUSINESS_BRAIN) }];
    ws.comments = [
      { id: randomUUID(), deliverableId: profileId, author: "demo@acme.example", message: "Can we make this heading stronger? 'Who we are' feels flat.", at: new Date().toISOString(), resolved: false, page: 2, x: 50, y: 12 },
      { id: randomUUID(), deliverableId: profileId, author: "demo@acme.example", message: "Add the Kandy warehouse here too, please.", at: new Date().toISOString(), resolved: false, page: 3, x: 28, y: 46 },
      { id: randomUUID(), deliverableId: profileId, author: "demo@acme.example", message: "Tagline could be bigger on the cover.", at: new Date().toISOString(), resolved: true, page: 1, x: 50, y: 78 },
    ];
    ws.activity = [
      { at: new Date().toISOString(), text: "Company Profile v03 moved to client review." },
      { at: new Date().toISOString(), text: "Business Brain initialised from operations handbook." },
      { at: new Date().toISOString(), text: "Brand Brain initialised from brand guidelines." },
      { at: new Date().toISOString(), text: "Website copy v02 approved." },
    ];
  });
}
