import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PORTAL_COOKIE, verifySessionToken, readWorkspace, searchBrain } from "@/lib/portal";
import { llmAvailable, llmChat } from "@/lib/concierge/llm";

export async function POST(request: Request) {
  const store = await cookies();
  const session = verifySessionToken(store.get(PORTAL_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { q?: string };
  const q = String(body.q ?? "").slice(0, 300).trim();
  if (q.length < 3) return NextResponse.json({ ok: false, error: "Ask something longer." }, { status: 400 });

  const ws = await readWorkspace(session.slug);
  if (!ws) return NextResponse.json({ ok: false, error: "no workspace" }, { status: 404 });

  const hits = searchBrain(ws.brain, q);
  const passages = hits.map((h) => ({ title: h.title, snippet: h.chunk.slice(0, 320) }));

  let answer: string | null = null;
  if (hits.length && llmAvailable()) {
    const knowledge = hits.map((h, i) => `[${i + 1}] ${h.chunk}`).join("\n\n");
    answer = await llmChat(
      "You are the Brand Brain for a company. Answer the user's question using ONLY the provided brand knowledge. If the answer isn't in the knowledge, say so plainly. Keep answers under 120 words, in the brand's own voice where possible.",
      `BRAND KNOWLEDGE:\n${knowledge}\n\nQUESTION: ${q}`
    );
  }

  return NextResponse.json({ ok: true, passages, answer, engine: answer ? "llm" : "retrieval" });
}
