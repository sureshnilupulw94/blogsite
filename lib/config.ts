const DEV_ADMIN_TOKEN = "flagship-dev";
const DEV_PORTAL_SECRET = "flagship-portal-dev-secret";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function requiredProduction(name: string, value: string, forbidden: string[] = []): string {
  if (isProduction() && forbidden.includes(value)) throw new Error(`${name} must be configured in production`);
  if (isProduction() && !value) throw new Error(`${name} must be configured in production`);
  return value;
}

export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theflagship.example";
  if (isProduction() && (!value.startsWith("https://") || value.includes(".example"))) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a real HTTPS URL in production");
  }
  return value.replace(/\/$/, "");
}

export function publicContact() {
  return {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@theflagship.example",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+94 77 000 0000",
  };
}

export function adminSecret() {
  return requiredProduction("ADMIN_TOKEN", process.env.ADMIN_TOKEN ?? DEV_ADMIN_TOKEN, [DEV_ADMIN_TOKEN]);
}

export function portalSecret() {
  return requiredProduction("PORTAL_SECRET", process.env.PORTAL_SECRET ?? DEV_PORTAL_SECRET, [DEV_PORTAL_SECRET]);
}

export function persistenceMode() {
  const mode = process.env.PERSISTENCE_MODE ?? "filesystem";
  if (!isProduction()) return mode;
  if (mode !== "durable") throw new Error("PERSISTENCE_MODE=durable is required in production");
  return mode;
}

export function assertProductionConfig() {
  siteUrl();
  adminSecret();
  portalSecret();
  persistenceMode();
}
