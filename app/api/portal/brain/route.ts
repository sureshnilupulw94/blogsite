import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PORTAL_COOKIE, verifySessionToken, readWorkspace, searchBrain, queryTerms, firstMatchIndex } from "@/lib/portal";
import { llmAvailable, llmChat } from "@/lib/concierge/llm";

export async function POST(request: Request) {
  const store = await cookies();
  const session = verifySessionToken(store.get(PORTAL_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { q?: string; which?: string };
  const q = String(body.q ?? "").slice(0, 300).trim();
  const which = body.which === "business" ? "business" : "brand";
  if (q.length < 3) return NextResponse.json({ ok: false, error: "Ask something longer." }, { status: 400 });

  const ws = await readWorkspace(session.slug);
  if (!ws) return NextResponse.json({ ok: false, error: "no workspace" }, { status: 404 });

  const brain = which === "business" ? ws.businessBrain : ws.brain;
  const hits = searchBrain(brain, q);

  // center each snippet on the first matched term, not the chunk start
  const terms = queryTerms(q);
  const passages = hits.map((h) => {
    const idx = firstMatchIndex(h.chunk.toLowerCase(), terms);
    const start = Math.max(0, idx - 60);
    const snippet = (start > 0 ? "…" : "") + h.chunk.slice(start, start + 300);
    return { title: h.title, snippet };
  });

  let answer: string | null = null;
  if (hits.length && llmAvailable()) {
    const knowledge = hits.map((h, i) => `[${i + 1}] ${h.chunk}`).join("\n\n");
    const persona = which === "business"
      ? "You are the Business Brain for a company. Answer the team member's question using ONLY the provided company knowledge (policies, SOPs, processes). If the answer isn't in the knowledge, say so plainly. Keep answers under 120 words."
      : "You are the Brand Brain for a company. Answer the user's question using ONLY the provided brand knowledge. If the answer isn't in the knowledge, say so plainly. Keep answers under 120 words, in the brand's own voice where possible.";
    answer = await llmChat(persona, `KNOWLEDGE:\n${knowledge}\n\nQUESTION: ${q}`);
  }

  return NextResponse.json({ ok: true, which, passages, answer, engine: answer ? "llm" : "retrieval" });
}
