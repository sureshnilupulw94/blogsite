"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE } from "@/lib/admin";
import { signAdminSession, verifyAdminSession } from "@/lib/admin-session";
import { adminSecret } from "@/lib/config";
import { updateLeadStatus, readLeadById, readJsonStore, writeJsonStore } from "@/lib/leads";
import { createPortalClient, createLoginToken, mutateWorkspace, pushActivity, type DeliverableStatus } from "@/lib/portal";
import { analyzeLead, type LeadAnalysis } from "@/lib/analysis";
import { buildProposal, saveProposal, setProposalStatus, createShareToken, type ProposalStatus } from "@/lib/proposals";
import { draftFromIdea } from "@/lib/repurpose";

export async function login(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (token !== adminSecret()) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, signAdminSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

async function assertAdmin() {
  const store = await cookies();
  if (!verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) redirect("/admin/login");
}

export async function setLeadStatus(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  const note = String(formData.get("note") ?? "").slice(0, 500);
  if (id) await updateLeadStatus(id, status, note || undefined);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function createClientAccount(formData: FormData) {
  await assertAdmin();
  const email = String(formData.get("email") ?? "");
  const company = String(formData.get("company") ?? "");
  const project = String(formData.get("project") ?? "");
  const result = await createPortalClient({ email, company, project });
  if ("error" in result) {
    redirect(`/admin/clients?error=${encodeURIComponent(result.error)}`);
  }
  revalidatePath("/admin/clients");
  redirect(`/admin/clients?created=${encodeURIComponent(company)}`);
}

export async function makeLoginLink(formData: FormData) {
  await assertAdmin();
  const email = String(formData.get("email") ?? "");
  const token = await createLoginToken(email);
  if (!token) {
    redirect(`/admin/clients?error=${encodeURIComponent("No account for that email.")}`);
  }
  redirect(`/admin/clients?link=${encodeURIComponent(`/portal/auth?token=${token}`)}`);
}

/* ---------- studio-side project management ---------- */

export async function setDeliverableStatus(formData: FormData) {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const allowed: DeliverableStatus[] = ["draft", "internal", "client-review", "revision", "approved", "final"];
  if (!slug || !id || !allowed.includes(status as DeliverableStatus)) return;
  await mutateWorkspace(slug, (ws) => {
    const d = ws.deliverables.find((x) => x.id === id);
    if (!d) return;
    d.status = status as DeliverableStatus;
    d.updatedAt = new Date().toISOString();
    pushActivity(ws, `Studio moved ${d.title} to “${status}”.`);
  });
  revalidatePath(`/admin/projects/${slug}`);
}

export async function toggleFeedback(formData: FormData) {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!slug || !id) return;
  await mutateWorkspace(slug, (ws) => {
    const c = ws.comments.find((x) => x.id === id);
    if (!c) return;
    c.resolved = !c.resolved;
    pushActivity(ws, `Studio ${c.resolved ? "resolved" : "reopened"} a note: “${c.message.slice(0, 60)}…”`);
  });
  revalidatePath(`/admin/projects/${slug}`);
}

/* ---------- AI lead analysis ---------- */

export async function analyzeLeadAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const lead = await readLeadById(id);
  if (!lead) return;
  const analysis = await analyzeLead(lead);
  const store = await readJsonStore<Record<string, LeadAnalysis>>("analyses.json", {});
  store[id] = analysis;
  await writeJsonStore("analyses.json", store);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

/* ---------- proposals ---------- */

export async function createProposal(formData: FormData) {
  await assertAdmin();
  const services = formData.getAll("services").map(String).filter(Boolean);
  if (!services.length) redirect("/admin/proposals/new?error=services");
  const proposal = buildProposal({
    client: {
      name: String(formData.get("name") ?? "").slice(0, 120),
      company: String(formData.get("company") ?? "").slice(0, 120),
      email: String(formData.get("email") ?? "").slice(0, 160),
    },
    objective: String(formData.get("objective") ?? "").slice(0, 600),
    services,
    timelineWeeks: Number(formData.get("timelineWeeks") ?? 4),
    price: Number(formData.get("price") ?? 0),
    notes: String(formData.get("notes") ?? "").slice(0, 600),
  });
  await saveProposal(proposal);
  revalidatePath("/admin/proposals");
  redirect(`/admin/proposals/${proposal.id}`);
}

export async function markProposal(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ProposalStatus;
  if (!["draft", "sent", "accepted", "declined"].includes(status)) return;
  await setProposalStatus(id, status);
  revalidatePath("/admin/proposals");
  revalidatePath(`/admin/proposals/${id}`);
  revalidatePath("/admin/finance");
}

export async function shareProposal(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  await createShareToken(id);
  revalidatePath(`/admin/proposals/${id}`);
  revalidatePath("/admin/proposals");
}

/* ---------- project tasks & time ---------- */

export async function addTask(formData: FormData) {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const assignee = String(formData.get("assignee") ?? "").trim().slice(0, 80);
  if (!slug || !title) return;
  await mutateWorkspace(slug, (ws) => {
    ws.tasks.push({ id: crypto.randomUUID(), title, assignee: assignee || undefined, done: false, createdAt: new Date().toISOString() });
  });
  revalidatePath(`/admin/projects/${slug}`);
}

export async function toggleTask(formData: FormData) {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  const id = String(formData.get("id") ?? "");
  if (!slug || !id) return;
  await mutateWorkspace(slug, (ws) => {
    const t = ws.tasks.find((x) => x.id === id);
    if (t) t.done = !t.done;
  });
  revalidatePath(`/admin/projects/${slug}`);
}

export async function logTime(formData: FormData) {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  const minutes = Math.round(Number(formData.get("minutes") ?? 0));
  const who = String(formData.get("who") ?? "studio").slice(0, 80);
  const note = String(formData.get("note") ?? "").slice(0, 200);
  if (!slug || !Number.isFinite(minutes) || minutes <= 0 || minutes > 24 * 60) return;
  await mutateWorkspace(slug, (ws) => {
    ws.time.push({ id: crypto.randomUUID(), date: new Date().toISOString(), minutes, who, note: note || undefined });
  });
  revalidatePath(`/admin/projects/${slug}`);
  revalidatePath("/admin/finance");
}

/* ---------- content pipeline ---------- */

export type ContentItem = { id: string; title: string; stage: "idea" | "draft" | "review" | "scheduled" | "published"; assignee?: string; updatedAt: string; draft?: string; publishAt?: string };
const STAGES: ContentItem["stage"][] = ["idea", "draft", "review", "scheduled", "published"];

export async function addContentItem(formData: FormData) {
  await assertAdmin();
  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const assignee = String(formData.get("assignee") ?? "").trim().slice(0, 80);
  if (!title) return;
  const items = await readJsonStore<ContentItem[]>("content.json", []);
  items.unshift({ id: crypto.randomUUID(), title, stage: "idea", assignee: assignee || undefined, updatedAt: new Date().toISOString() });
  await writeJsonStore("content.json", items);
  revalidatePath("/admin/content");
}

export async function moveContentItem(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "next");
  const items = await readJsonStore<ContentItem[]>("content.json", []);
  const item = items.find((x) => x.id === id);
  if (!item) return;
  const idx = STAGES.indexOf(item.stage);
  const next = dir === "prev" ? idx - 1 : idx + 1;
  if (next >= 0 && next < STAGES.length) {
    item.stage = STAGES[next];
    item.updatedAt = new Date().toISOString();
    await writeJsonStore("content.json", items);
  }
  revalidatePath("/admin/content");
}

export async function deleteContentItem(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const items = (await readJsonStore<ContentItem[]>("content.json", [])).filter((x) => x.id !== id);
  await writeJsonStore("content.json", items);
  revalidatePath("/admin/content");
}

/** AI factory: stamp a structured draft from a bare idea and advance it. */
export async function generateDraft(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const items = await readJsonStore<ContentItem[]>("content.json", []);
  const item = items.find((x) => x.id === id);
  if (!item) return;
  item.draft = draftFromIdea(item.title);
  if (item.stage === "idea") item.stage = "draft";
  item.updatedAt = new Date().toISOString();
  await writeJsonStore("content.json", items);
  revalidatePath("/admin/content");
}

/** Calendar builder: pin a publish date on an item. */
export async function scheduleContentItem(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const date = String(formData.get("date") ?? "").trim();
  const items = await readJsonStore<ContentItem[]>("content.json", []);
  const item = items.find((x) => x.id === id);
  if (!item) return;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) item.publishAt = date;
  else delete item.publishAt;
  item.updatedAt = new Date().toISOString();
  await writeJsonStore("content.json", items);
  revalidatePath("/admin/content");
  revalidatePath("/admin/calendar");
}

/** Repurposing: drop channel-specific versions onto the board as new ideas. */
export async function repurposeToBoard(formData: FormData) {
  await assertAdmin();
  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const channels = formData.getAll("channel").map(String).filter(Boolean);
  if (!title || channels.length === 0) return;
  const items = await readJsonStore<ContentItem[]>("content.json", []);
  const label: Record<string, string> = { linkedin: "LinkedIn", thread: "Thread", newsletter: "Newsletter" };
  for (const channel of channels) {
    items.unshift({
      id: crypto.randomUUID(),
      title: `[${label[channel] ?? channel}] ${title}`.slice(0, 200),
      stage: "idea",
      updatedAt: new Date().toISOString(),
    });
  }
  await writeJsonStore("content.json", items);
  revalidatePath("/admin/content");
}
