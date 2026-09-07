export function adminLoginDecision(token: string, expected: string, attemptsRemain: boolean) {
  if (!attemptsRemain) return { ok: false as const, reason: "limited" as const };
  if (token !== expected) return { ok: false as const, reason: "invalid" as const };
  return { ok: true as const };
}
