import { persistenceMode } from "@/lib/config";

export function assertStorageReady() {
  const mode = persistenceMode();
  if (process.env.NODE_ENV === "production" && mode !== "durable") {
    throw new Error("Production requires durable persistence");
  }
  return mode;
}
