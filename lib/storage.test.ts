import test from "node:test";
import assert from "node:assert/strict";
import { assertStorageReady, storageMode } from "./storage.ts";

test("uses filesystem storage by default outside production", () => {
  assert.equal(storageMode(), "filesystem");
  assert.equal(assertStorageReady(), "filesystem");
});

test("requires durable storage in production", () => {
  assert.throws(() => assertStorageReady("filesystem", true), /Production requires durable persistence/);
  assert.equal(assertStorageReady("durable", true), "durable");
});
