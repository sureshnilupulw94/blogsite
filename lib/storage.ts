import { persistenceMode } from "./config.ts";

export type StorageMode = "filesystem" | "durable";

export function storageMode(): StorageMode {
  return persistenceMode() as StorageMode;
}

export function assertStorageReady(mode = storageMode(), isProduction = process.env.NODE_ENV === "production"): StorageMode {
  if (isProduction && mode !== "durable") throw new Error("Production requires durable persistence");
  return mode;
}
