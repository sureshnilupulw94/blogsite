import { llmAvailable, llmChat } from "./concierge/llm";

export type SourceKind = "podcast" | "case" | "article";

export type RepurposeSource = {
  kind: SourceKind;
  title: string;
  who?: string; // guest / client
  summary: string;
  points: string[]; // 3–5 takeaways
};

export type RepurposeOutput = {
  linkedin: string;
  thread: string[];
  newsletter: string;
  quotes: string[];
  seo: { title: string; meta: string };
  engine: "rules" | "llm";
};

const BANNED = ["solutions provider", "synergy", "world-class", "seamless", "best-in-class", "leverage"];

function clean(text: string): string {
  let out = text;
  for (const word of BANNED) out = out.replace(new RegExp(word, "gi"), "clear");
  return out.replace(/\s+/g, " ").trim();
}

function lead(kind: SourceKind, src: RepurposeSource): string {
  if (kind === "podcast") return `New episode: ${src.title}${src.who ? ` with ${src.who}` : ""}.`;
  if (kind === "case") return `Case study: ${src.title}${src.who ? ` — ${src.who}` : ""}.`;
  return `${src.title}.`;
}

export function repurposeRules(src: RepurposeSource): RepurposeOutput {
  const opener = lead(src.kind, src);
  const bullets = src.points.slice(0, 5).map((p) => clean(p));

  const linkedin = clean(
    [
      opener,
      "",
      src.summary,
      "",
      "What stood out:",
      ...bullets.map((b) => `• ${b}`),
      "",
      src.kind === "case"
        ? "We make complex things clear — this one took method, not magic."
        : "If this landed, the full conversation is one click away.",
    ].join("\n")
  );

  const thread = [
    `${opener} ${src.summary} 🧵`,
    "",
    ...bullets.flatMap((b, i) => [`${i + 1}/ ${b}`, ""]),
    `That's the thread. ${src.kind === "podcast" ? "Full episode in the replies." : "Full breakdown on the site."} We make complex things clear.`,
  ];

  const newsletter = clean(
    [
      `${src.title}${src.who ? ` — ${src.who}` : ""}`,
      src.summary,
      bullets.length ? `Three things worth stealing:\n${bullets.slice(0, 3).map((b) => `- ${b}`).join("\n")}` : "",
      src.kind === "podcast" ? "Listen: theflagship.example/podcast" : "Read the full version on the site.",
    ].filter(Boolean).join("\n\n")
  );

  const quotes = bullets.slice(0, 3).map((b) => (b.length > 90 ? `${b.slice(0, 87)}…` : b));

  const seoTitle = clean(src.title).slice(0, 60);
  const seoMeta = clean(`${src.summary} ${bullets[0] ?? ""}`).slice(0, 155);

  return { linkedin, thread, newsletter, quotes, seo: { title: seoTitle, meta: seoMeta }, engine: "rules" };
}

/** Deterministic first; LLM polish only when a key is configured. Never throws. */
export async function repurpose(src: RepurposeSource): Promise<RepurposeOutput> {
  const base = repurposeRules(src);
  if (!llmAvailable()) return base;
  try {
    const system =
      "You are the content repurposing engine of THE FLAGSHIP, a clarity studio. Brand voice: plain, confident, warm. Short sentences. Never the words: " +
      BANNED.join(", ") +
      '. Respond with JSON only: {"linkedin": string, "thread": string[], "newsletter": string, "seo": {"title": string, "meta": string}}. LinkedIn max 1300 chars, thread 5-8 posts, newsletter max 120 words.';
    const user = `Source (${src.kind}): ${src.title}${src.who ? ` — ${src.who}` : ""}\nSummary: ${src.summary}\nTakeaways:\n${src.points.map((p) => `- ${p}`).join("\n")}`;
    const raw = await llmChat(system, user, 1200);
    if (!raw) return base;
    const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json) as Partial<RepurposeOutput>;
    return {
      linkedin: clean(String(parsed.linkedin ?? base.linkedin)),
      thread: Array.isArray(parsed.thread) && parsed.thread.length ? parsed.thread.map((t) => clean(String(t))).slice(0, 10) : base.thread,
      newsletter: clean(String(parsed.newsletter ?? base.newsletter)),
      quotes: base.quotes,
      seo: parsed.seo?.title ? { title: clean(parsed.seo.title).slice(0, 60), meta: clean(parsed.seo.meta ?? base.seo.meta).slice(0, 155) } : base.seo,
      engine: "llm",
    };
  } catch {
    return base;
  }
}

/** Structured first draft from a bare idea title — the factory's stamping machine. */
export function draftFromIdea(title: string, kind: SourceKind = "article"): string {
  const t = clean(title);
  const structure = [
    `DRAFT SKELETON — ${t}`,
    "",
    "Hook (2 sentences max)",
    `Open with the moment this got interesting. If ${t.toLowerCase()} matters, show it costing someone time or money first.`,
    "",
    "Thesis (1 sentence)",
    "One claim a reader can disagree with. If they can't, it isn't a thesis.",
    "",
    "Section 1 — The problem, named",
    "• What it looks like day to day\n• The hidden cost\n• Why the usual fix fails",
    "",
    "Section 2 — The method",
    "• What we do instead, step by step\n• One concrete example\n• The decision this forces",
    "",
    "Section 3 — Proof",
    "• A number that moved\n• A quote, if we have one\n• What would make it false",
    "",
    "Close (3 sentences)",
    kind === "podcast" ? "Point to the episode. One ask: subscribe." : "One ask only. No funnel gymnastics.",
    "",
    "Voice check: short sentences · no banned words · would this survive being read aloud at a client dinner?",
  ];
  return structure.join("\n");
}
