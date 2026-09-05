"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import {
  PORTAL_COOKIE,
  signSession,
  requirePortal,
  mutateWorkspace,
  pushActivity,
  saveUpload,
  addBrainEntry,
  createLoginToken,
  MAX_UPLOAD_BYTES,
} from "@/lib/portal";

export type MagicLinkState = { ok: boolean; message: string; devLink?: string } | null;

export async function requestMagicLink(_prev: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, message: "Enter a valid email address." };

  const token = await createLoginToken(email);
  if (!token) {
    return { ok: false, message: "No portal account found for this email. Ask the studio to set one up." };
  }

  if (process.env.PORTAL_DEV_LINKS === "off") {
    return { ok: true, message: "Login link sent — check your inbox. It expires in 30 minutes." };
  }
  return {
    ok: true,
    message: "Dev mode: use the link below (in production this is emailed). Expires in 30 minutes, single use.",
    devLink: `/portal/auth?token=${token}`,
  };
}

export async function logoutPortal() {
  const store = await cookies();
  store.delete(PORTAL_COOKIE);
  redirect("/portal/login");
}

/* ---------- workspace actions ---------- */

export async function approveMilestone(formData: FormData) {
  const session = await requirePortal();
  const id = String(formData.get("id") ?? "");
  await mutateWorkspace(session.slug, (ws) => {
    const idx = ws.milestones.findIndex((m) => m.id === id);
    if (idx === -1) return;
    ws.milestones[idx].status = "done";
    ws.milestones[idx].awaiting = false;
    const next = ws.milestones[idx + 1];
    if (next && next.status === "todo") {
      next.status = "current";
      next.awaiting = true;
      ws.project.stage = next.title;
    } else {
      ws.project.stage = "Complete";
    }
    const done = ws.milestones.filter((m) => m.status === "done").length;
    const nextMilestone = ws.milestones.find((m) => m.status === "current");
    ws.project.nextAction = nextMilestone ? `Approve: ${nextMilestone.title}` : "Project complete — thank you";
    pushActivity(ws, `Milestone approved: ${ws.milestones[idx].title} (${done}/${ws.milestones.length}).`);
  });
  revalidatePath("/portal");
}

export async function approveDeliverable(formData: FormData) {
  const session = await requirePortal();
  const id = String(formData.get("id") ?? "");
  await mutateWorkspace(session.slug, (ws) => {
    const d = ws.deliverables.find((x) => x.id === id);
    if (!d) return;
    d.status = "final";
    d.updatedAt = new Date().toISOString();
    ws.comments.forEach((c) => {
      if (c.deliverableId === id) c.resolved = true;
    });
    pushActivity(ws, `Deliverable approved: ${d.title}.`);
  });
  revalidatePath("/portal");
}

export async function requestRevision(formData: FormData) {
  const session = await requirePortal();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  if (!note) return;
  await mutateWorkspace(session.slug, (ws) => {
    const d = ws.deliverables.find((x) => x.id === id);
    if (!d) return;
    d.status = "revision";
    d.updatedAt = new Date().toISOString();
    ws.comments.push({ id: randomUUID(), deliverableId: id, author: session.email, message: note, at: new Date().toISOString(), resolved: false });
    pushActivity(ws, `Revision requested on ${d.title}: “${note.slice(0, 80)}${note.length > 80 ? "…" : ""}”`);
  });
  revalidatePath("/portal");
}

/* ---------- files ---------- */

export async function uploadFile(formData: FormData) {
  const session = await requirePortal();
  const file = formData.get("file");
  const category = String(formData.get("category") ?? "Other");
  if (!(file instanceof File) || file.size === 0) return;
  if (file.size > MAX_UPLOAD_BYTES) return;
  const bytes = Buffer.from(await file.arrayBuffer());
  await saveUpload(session.slug, { name: file.name, size: file.size, bytes }, category);
  revalidatePath("/portal/files");
  revalidatePath("/portal");
}

/* ---------- brand brain ---------- */

export async function addKnowledge(formData: FormData) {
  const session = await requirePortal();
  const title = String(formData.get("title") ?? "").slice(0, 120);
  const text = String(formData.get("text") ?? "").slice(0, 20000);
  await addBrainEntry(session.slug, title, text);
  revalidatePath("/portal/brain");
  revalidatePath("/portal");
}
