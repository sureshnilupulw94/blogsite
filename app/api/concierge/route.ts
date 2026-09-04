import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/leads";
import { recommendByRules, type ConciergeInput } from "@/lib/concierge/engine";
import { recommendWithLLM } from "@/lib/concierge/llm";

function clean(value: unknown, max = 300): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input: ConciergeInput = {
      goal: clean(body.goal, 120),
      blocker: clean(body.blocker, 60),
      materials: Array.isArray(body.materials)
        ? body.materials.filter((m): m is string => typeof m === "string").slice(0, 10).map((m) => m.slice(0, 100))
        : [],
      deadline: clean(body.deadline, 60),
      budget: clean(body.budget, 60),
      freeform: clean(body.freeform, 1000),
    };

    const recommendation = (await recommendWithLLM(input)) ?? recommendByRules(input);

    await recordEvent({
      type: "event",
      name: "concierge_complete",
      goal: input.goal ?? "",
      primary: recommendation.primaryService,
      engine: recommendation.engine,
    });

    return NextResponse.json({ ok: true, recommendation });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
