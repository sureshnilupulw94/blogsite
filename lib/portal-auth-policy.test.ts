import test from "node:test";
import assert from "node:assert/strict";
import { canExposeDevLink } from "./portal-auth-policy.ts";

test("never exposes development login links in production", () => {
  assert.equal(canExposeDevLink({ nodeEnv: "production", flag: undefined }), false);
  assert.equal(canExposeDevLink({ nodeEnv: "production", flag: "on" }), false);
});

test("allows development links locally unless disabled", () => {
  assert.equal(canExposeDevLink({ nodeEnv: "development", flag: undefined }), true);
  assert.equal(canExposeDevLink({ nodeEnv: "development", flag: "off" }), false);
});
