import test from "node:test";
import assert from "node:assert/strict";
import { adminLoginDecision } from "./admin-auth-policy.ts";

test("rejects an incorrect admin token", () => {
  assert.deepEqual(adminLoginDecision("wrong", "expected", true), { ok: false, reason: "invalid" });
});

test("rejects a login when the attempt limiter is exhausted", () => {
  assert.deepEqual(adminLoginDecision("expected", "expected", false), { ok: false, reason: "limited" });
});

test("accepts the expected token when attempts remain", () => {
  assert.deepEqual(adminLoginDecision("expected", "expected", true), { ok: true });
});
