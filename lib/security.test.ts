import test from "node:test";
import assert from "node:assert/strict";
import { resetRateLimits, rateLimit } from "./rate-limit.ts";
import { assertPublicUrl } from "./ssrf.ts";
import { persistenceMode, siteUrl } from "./config.ts";

test("rate limits repeated requests in a window", () => {
  resetRateLimits();
  assert.equal(rateLimit("test", 2, 60_000, 1).allowed, true);
  assert.equal(rateLimit("test", 2, 60_000, 2).allowed, true);
  assert.equal(rateLimit("test", 2, 60_000, 3).allowed, false);
  assert.equal(rateLimit("test", 2, 60_000, 60_001).allowed, true);
});

test("rejects unsafe URL protocols and local hosts", async () => {
  await assert.rejects(() => assertPublicUrl("file:///etc/passwd"));
  await assert.rejects(() => assertPublicUrl("http://127.0.0.1"));
  await assert.rejects(() => assertPublicUrl("http://localhost"));
});

test("keeps local defaults explicit", () => {
  assert.equal(siteUrl(), "https://theflagship.example");
  assert.equal(persistenceMode(), "filesystem");
});
