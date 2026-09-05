"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";
import { updateLeadStatus } from "@/lib/leads";
import { createPortalClient, createLoginToken, mutateWorkspace, pushActivity, type DeliverableStatus } from "@/lib/portal";

export async function login(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (token !== adminToken()) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
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
  if (store.get(ADMIN_COOKIE)?.value !== adminToken()) redirect("/admin/login");
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
