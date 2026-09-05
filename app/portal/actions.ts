"use server";

import { cookies, headers } from "next/headers";
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
import { smtpConfigured, sendMail, magicLinkEmail } from "@/lib/mailer";

export type MagicLinkState = { ok: boolean; message: string; devLink?: string } | null;

async function baseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function requestMagicLink(_prev: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, message: "Enter a valid email address." };

  const token = await createLoginToken(email);
  if (!token) {
    return { ok: false, message: "No portal account found for this email. Ask the studio to set one up." };
  }

  const link = `${await baseUrl()}/portal/auth?token=${token}`;
  const hideDev = process.env.PORTAL_DEV_LINKS === "off";

  if (smtpConfigured()) {
    const mail = magicLinkEmail(link);
    const sent = await sendMail({ to: email, ...mail });
    if (sent) {
      return {
        ok: true,
        message: "Login link sent — check your inbox. It expires in 30 minutes.",
        devLink: hideDev ? undefined : link,
      };
    }
    return {
      ok: true,
      message: "The email couldn't be sent just now — use the link below this time.",
      devLink: link,
    };
  }

  if (hideDev) {
    return { ok: true, message: "Login link created but email isn't configured (SMTP_HOST/SMTP_FROM). Ask the studio." };
  }
  return {
    ok: true,
    message: "Dev mode (no SMTP configured): use the link below. It expires in 30 minutes, single use.",
    devLink: link,
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

/* ---------- pixel-anchored document feedback ---------- */

export async function addFeedback(formData: FormData) {
  const session = await requirePortal();
  const deliverableId = String(formData.get("deliverableId") ?? "");
  const message = String(formData.get("message") ?? "").trim().slice(0, 500);
  const page = Number(formData.get("page") ?? 0);
  const x = Number(formData.get("x") ?? 0);
  const y = Number(formData.get("y") ?? 0);
  if (!message || !deliverableId) return;
  await mutateWorkspace(session.slug, (ws) => {
    const d = ws.deliverables.find((x2) => x2.id === deliverableId);
    if (!d) return;
    ws.comments.push({
      id: randomUUID(),
      deliverableId,
      author: session.email,
      message,
      at: new Date().toISOString(),
      resolved: false,
      page: Number.isFinite(page) ? page : undefined,
      x: Number.isFinite(x) ? Math.min(100, Math.max(0, x)) : undefined,
      y: Number.isFinite(y) ? Math.min(100, Math.max(0, y)) : undefined,
    });
    pushActivity(ws, `Note added on ${d.title}${page ? ` — page ${page}` : ""}: “${message.slice(0, 60)}${message.length > 60 ? "…" : ""}”`);
  });
  revalidatePath(`/portal/review/${deliverableId}`);
  revalidatePath("/portal");
}

export async function resolveFeedback(formData: FormData) {
  const session = await requirePortal();
  const id = String(formData.get("id") ?? "");
  const deliverableId = String(formData.get("deliverableId") ?? "");
  await mutateWorkspace(session.slug, (ws) => {
    const c = ws.comments.find((x) => x.id === id);
    if (!c) return;
    c.resolved = !c.resolved;
    pushActivity(ws, `Note ${c.resolved ? "resolved" : "reopened"}: “${c.message.slice(0, 60)}…”`);
  });
  if (deliverableId) revalidatePath(`/portal/review/${deliverableId}`);
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

/* ---------- brains ---------- */

export async function addKnowledge(formData: FormData) {
  const session = await requirePortal();
  const which = String(formData.get("which") ?? "brand") === "business" ? "business" : "brand";
  const title = String(formData.get("title") ?? "").slice(0, 120);
  const text = String(formData.get("text") ?? "").slice(0, 20000);
  await addBrainEntry(session.slug, which, title, text);
  revalidatePath(which === "business" ? "/portal/business-brain" : "/portal/brain");
  revalidatePath("/portal");
}
