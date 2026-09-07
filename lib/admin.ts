import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-session";

export const ADMIN_COOKIE = "fs_admin";

export async function requireAdmin() {
  const store = await cookies();
  if (!verifyAdminSession(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }
}
