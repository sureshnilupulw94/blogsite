import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "fs_admin";

export function adminToken() {
  return process.env.ADMIN_TOKEN ?? "flagship-dev";
}

export async function requireAdmin() {
  const store = await cookies();
  if (store.get(ADMIN_COOKIE)?.value !== adminToken()) {
    redirect("/admin/login");
  }
}
