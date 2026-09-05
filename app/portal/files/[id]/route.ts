import { readFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { PORTAL_COOKIE, verifySessionToken, readWorkspace, uploadsDir } from "@/lib/portal";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await cookies();
  const session = verifySessionToken(store.get(PORTAL_COOKIE)?.value);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const ws = await readWorkspace(session.slug);
  const file = ws?.files.find((f) => f.id === id);
  if (!file) return new Response("Not found", { status: 404 });

  const filePath = path.join(uploadsDir(session.slug), path.basename(file.path));
  try {
    const bytes = await readFile(filePath);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("File missing on disk", { status: 404 });
  }
}
