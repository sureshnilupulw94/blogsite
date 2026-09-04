"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";
import { updateLeadStatus } from "@/lib/leads";

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

export async function setLeadStatus(formData: FormData) {
  const store = await cookies();
  if (store.get(ADMIN_COOKIE)?.value !== adminToken()) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  const note = String(formData.get("note") ?? "").slice(0, 500);
  if (id) await updateLeadStatus(id, status, note || undefined);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
