import { services } from "@/lib/data/services";
import type { ConciergeInput, Recommendation } from "./engine";
import { isValidRecommendation } from "./engine";

/**
 * Provider-agnostic LLM call. Configure via env:
 *   OPENAI_API_KEY                     → OpenAI (gpt-4o-mini)
 *   ANTHROPIC_API_KEY                  → Anthropic (claude-3-5-haiku)
 *   GEMINI_API_KEY                     → Google Gemini
 *   CONCIERGE_API_URL + _KEY + _MODEL  → any OpenAI-compatible endpoint
 * If no key is set — or anything fails — callers fall back to the rules engine.
 */

const TIMEOUT_MS = 12_000;

const SYSTEM_PROMPT = `You are the AI Concierge for The Flagship, a writing/design/digital/strategy/AI agency.
Given a client intake, recommend an approach. Respond ONLY with valid JSON of shape:
{"primaryService": slug, "supportingServices": [slug, slug], "headline": string, "rationale": string, "phases": string[], "risks": string[], "questions": string[], "nextStep": string}
Allowed service slugs: ${services.map((s) => s.slug).join(", ")}.
Rules: rationale is 2-3 sentences referencing what the client actually said; 3-5 phases; 1-3 concrete risks; 1-3 questions still open; nextStep is one actionable sentence.`;

function extractJson(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("no json");
  return JSON.parse(match[0]);
}

function config() {
  if (process.env.CONCIERGE_API_URL && process.env.CONCIERGE_API_KEY) {
    return { kind: "openai-compatible" as const, url: process.env.CONCIERGE_API_URL, key: process.env.CONCIERGE_API_KEY, model: process.env.CONCIERGE_MODEL ?? "gpt-4o-mini" };
  }
  if (process.env.OPENAI_API_KEY) {
    return { kind: "openai-compatible" as const, url: "https://api.openai.com/v1/chat/completions", key: process.env.OPENAI_API_KEY, model: process.env.CONCIERGE_MODEL ?? "gpt-4o-mini" };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { kind: "anthropic" as const, url: "https://api.anthropic.com/v1/messages", key: process.env.ANTHROPIC_API_KEY, model: process.env.CONCIERGE_MODEL ?? "claude-3-5-haiku-latest" };
  }
  if (process.env.GEMINI_API_KEY) {
    return { kind: "gemini" as const, url: "", key: process.env.GEMINI_API_KEY, model: process.env.CONCIERGE_MODEL ?? "gemini-1.5-flash" };
  }
  return null;
}

export function llmAvailable() {
  return config() !== null;
}

/** Provider-agnostic chat call. Returns null on any failure — callers handle fallback. */
export async function llmChat(system: string, user: string, maxTokens = 700): Promise<string | null> {
  const cfg = config();
  if (!cfg) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    if (cfg.kind === "anthropic") {
      const res = await fetch(cfg.url, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", "x-api-key": cfg.key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: cfg.model, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] }),
      });
      if (!res.ok) throw new Error(`anthropic ${res.status}`);
      const data = await res.json();
      return data.content?.[0]?.text ?? null;
    }
    if (cfg.kind === "gemini") {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent?key=${cfg.key}`, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ parts: [{ text: user }] }] }),
      });
      if (!res.ok) throw new Error(`gemini ${res.status}`);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    }
    const res = await fetch(cfg.url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify({ model: cfg.model, temperature: 0.4, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    if (!res.ok) throw new Error(`openai ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function recommendWithLLM(input: ConciergeInput): Promise<Recommendation | null> {
  const cfg = config();
  if (!cfg) return null;

  try {
    const text = await llmChat(SYSTEM_PROMPT, JSON.stringify(input));
    if (!text) return null;
    const parsed = extractJson(text);
    if (!isValidRecommendation(parsed)) throw new Error("invalid shape");
    return { ...parsed, engine: "llm" };
  } catch {
    return null; // always fall back to rules engine
  }
}
