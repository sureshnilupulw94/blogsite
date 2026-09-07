import test from "node:test";
import assert from "node:assert/strict";
import { signAdminSession, verifyAdminSession } from "./admin-session.ts";

test("signs and verifies an admin session", () => {
  process.env.ADMIN_TOKEN = "test-admin-secret";
  const session = signAdminSession();
  assert.equal(verifyAdminSession(session), true);
});

test("rejects tampered admin sessions", () => {
  process.env.ADMIN_TOKEN = "test-admin-secret";
  const session = signAdminSession();
  assert.equal(verifyAdminSession(`${session}x`), false);
  assert.equal(verifyAdminSession("not-a-session"), false);
});
