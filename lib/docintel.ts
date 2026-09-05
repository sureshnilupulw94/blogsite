/**
 * Document intelligence — turn uploaded files into Business-Brain-readable text.
 * Pure local extraction (no network): PDF via pdf-parse, DOCX via mammoth,
 * plain text passthrough. Images: OCR planned.
 */

export type ExtractResult =
  | { ok: true; text: string; engine: "text" | "pdf" | "docx"; pages?: number }
  | { ok: false; reason: "unsupported" | "empty" | "failed"; detail?: string };

const MAX_EXTRACT_CHARS = 60_000;

function clean(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_EXTRACT_CHARS);
}

export function supportedKind(name: string): "pdf" | "docx" | "text" | "image" | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  if (/\.(txt|md|markdown|csv|json|html?)$/.test(lower)) return "text";
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(lower)) return "image";
  return null;
}

export async function extractText(name: string, bytes: Buffer): Promise<ExtractResult> {
  const kind = supportedKind(name);
  if (!kind || kind === "image") return { ok: false, reason: "unsupported", detail: kind === "image" ? "OCR for images is on the roadmap" : "unsupported file type" };
  try {
    if (kind === "pdf") {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse(new Uint8Array(bytes));
      try {
        const result = await parser.getText();
        const text = clean(result.text);
        return text ? { ok: true, text, engine: "pdf", pages: result.total ? Number(result.total) : undefined } : { ok: false, reason: "empty" };
      } finally {
        await parser.destroy();
      }
    }
    if (kind === "docx") {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer: bytes });
      const text = clean(result.value);
      return text ? { ok: true, text, engine: "docx" } : { ok: false, reason: "empty" };
    }
    const text = clean(bytes.toString("utf8"));
    return text ? { ok: true, text, engine: "text" } : { ok: false, reason: "empty" };
  } catch (error) {
    return { ok: false, reason: "failed", detail: error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200) };
  }
}

/** Is there enough signal to index into a Brain? */
export function worthIndexing(result: ExtractResult): result is { ok: true; text: string; engine: "text" | "pdf" | "docx"; pages?: number } {
  return result.ok && result.text.replace(/\s+/g, "").length >= 200;
}
