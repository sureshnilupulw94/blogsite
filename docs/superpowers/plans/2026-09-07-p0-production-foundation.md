# P0 Production Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the existing Next.js blogsite for production by removing unsafe defaults, protecting public boundaries, improving session security, and adding explicit QA gates.

**Architecture:** Add small server-only utilities for configuration, request protection, rate limiting, SSRF validation, and session handling. Preserve the existing local filesystem adapter for development while making production persistence requirements explicit instead of falsely treating local disk as durable. Apply changes to existing routes with minimal refactoring.

**Tech Stack:** Next.js App Router, TypeScript, React, Node.js crypto/net/url APIs, ESLint, TypeScript compiler, Node test runner.

---

### Task 1: Configuration and site identity

**Files:**
- Create: `lib/config.ts`
- Modify: `lib/data/site.ts`
- Modify: `.env.example`
- Modify: `next.config.ts`
- Test: `lib/config.test.ts`

- [ ] Add typed environment helpers for `NEXT_PUBLIC_SITE_URL`, public contact values, `ADMIN_TOKEN`, `PORTAL_SECRET`, and `PERSISTENCE_MODE`.
- [ ] Reject missing or known development secrets when `NODE_ENV=production`; reject non-HTTPS production site URLs.
- [ ] Replace hardcoded `.example` site URL, email, and phone reads with environment-backed values while preserving safe local defaults.
- [ ] Document production values and persistence mode in `.env.example`.
- [ ] Add tests for development defaults, valid production settings, missing secrets, and insecure production URL.
- [ ] Run `npm test -- lib/config.test.ts` and verify all cases pass.

### Task 2: Security headers and private route metadata

**Files:**
- Modify: `next.config.ts`
- Modify: `app/admin/layout.tsx`
- Modify: `app/portal/layout.tsx`
- Modify: `app/admin/login/page.tsx`
- Modify: `app/portal/login/page.tsx`
- Test: `lib/security-headers.test.ts`

- [ ] Add `Permissions-Policy`, production-only HSTS, and a CSP compatible with current Next.js inline/runtime behavior.
- [ ] Add `Cache-Control: private, no-store` for `/admin`, `/portal`, `/p`, and authenticated API responses.
- [ ] Add `robots: { index: false, follow: false }` metadata to private layouts/pages where supported.
- [ ] Preserve existing nosniff, referrer, and frame protections.
- [ ] Test the header generator for development and production differences.
- [ ] Run lint and targeted tests.

### Task 3: Shared request guards and rate limiting

**Files:**
- Create: `lib/request-guard.ts`
- Create: `lib/rate-limit.ts`
- Modify: `app/api/leads/route.ts`
- Modify: `app/api/subscribe/route.ts`
- Modify: `app/api/events/route.ts`
- Modify: `app/api/concierge/route.ts`
- Modify: `app/api/audit/website/route.ts`
- Modify: `app/portal/auth/route.ts`
- Test: `lib/request-guard.test.ts`
- Test: `lib/rate-limit.test.ts`

- [ ] Implement bounded JSON body parsing with content-length and serialized payload limits.
- [ ] Implement origin validation for cookie-authenticated state-changing requests, allowing same-origin requests and configured site origin.
- [ ] Implement a bounded in-process fixed-window limiter keyed by route and client IP, with cleanup of expired keys.
- [ ] Return stable `400`, `403`, and `429` responses and `Retry-After` for rate limits.
- [ ] Apply route-specific conservative limits: audit/concierge/login stricter than analytics/leads.
- [ ] Add tests for body limits, origin handling, rate windows, cleanup, and IP fallback behavior.
- [ ] Run targeted tests and lint.

### Task 4: Redirect-aware SSRF protection

**Files:**
- Create: `lib/ssrf.ts`
- Modify: `app/api/audit/website/route.ts`
- Test: `lib/ssrf.test.ts`

- [ ] Parse only `http:` and `https:` URLs and reject credentials, localhost, loopback, private, link-local, multicast, unspecified, reserved, and IPv4-mapped IPv6 destinations.
- [ ] Resolve hostnames before each request and validate every resolved address.
- [ ] Replace automatic redirects with manual redirect handling, validating every `Location` target and enforcing a finite redirect count.
- [ ] Preserve timeout and response-size caps.
- [ ] Add tests for public URLs, blocked address ranges, mapped IPv6, unsupported protocols, credentials, and unsafe redirects.
- [ ] Run SSRF tests and lint.

### Task 5: Admin session hardening

**Files:**
- Create: `lib/admin-session.ts`
- Modify: `lib/admin.ts`
- Modify: `app/admin/actions.ts`
- Modify: `app/admin/layout.tsx`
- Modify: `app/admin/login/page.tsx`
- Test: `lib/admin-session.test.ts`

- [ ] Issue random opaque admin session IDs with expiry instead of storing the raw admin token in the cookie.
- [ ] Store sessions through the existing JSON-store boundary for local development and require `PERSISTENCE_MODE=durable` in production.
- [ ] Make `requireAdmin` validate session state rather than cookie presence/value equality.
- [ ] Add logout/revocation and login-attempt throttling.
- [ ] Remove any production-visible development token hint from the login UI.
- [ ] Ensure admin layout uses the same authorization result as protected pages.
- [ ] Test session creation, expiry, revocation, tampering, and invalid login attempts.
- [ ] Run targeted tests and lint.

### Task 6: Portal token hygiene and production secret enforcement

**Files:**
- Modify: `lib/portal.ts`
- Modify: `app/portal/auth/route.ts`
- Test: `lib/portal.test.ts`

- [ ] Replace the production fallback secret with a configuration error while retaining local development behavior.
- [ ] Prune expired and consumed login tokens whenever tokens are read or written.
- [ ] Keep single-use semantics and enforce login request throttling through the shared limiter.
- [ ] Prevent development magic-link display when `PORTAL_DEV_LINKS=off` or in production.
- [ ] Test expiry, replay rejection, pruning, missing production secret, and cookie flags.
- [ ] Run targeted tests and lint.

### Task 7: Persistence readiness boundary

**Files:**
- Create: `lib/storage.ts`
- Modify: `lib/leads.ts`
- Modify: `lib/portal.ts`
- Modify: `.env.example`
- Test: `lib/storage.test.ts`

- [ ] Define a narrow storage mode/readiness contract used by server modules.
- [ ] Keep the current filesystem implementation for development and tests.
- [ ] Add a production guard that rejects filesystem mode unless explicitly configured as a single-instance deployment.
- [ ] Avoid claiming a database migration that cannot be completed without selecting a provider; expose a clear adapter seam and deployment error.
- [ ] Test mode selection and production readiness failures.
- [ ] Run targeted tests and lint.

### Task 8: QA scripts and release checks

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Create: `tests/smoke.test.ts`
- Modify: `tsconfig.json` if needed

- [ ] Add `typecheck`, `test`, and `test:watch` scripts using the Node test runner and TypeScript-compatible test setup already supported by the project.
- [ ] Make lint failures visible to CI/build validation rather than silently ignored.
- [ ] Add smoke tests for route-independent security utilities and safe production configuration.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- [ ] Fix only issues introduced or exposed by the P0 changes; do not broaden scope into SEO/content work.

### Task 9: Final verification

**Files:**
- No code changes unless verification identifies a P0 defect.

- [ ] Run `git diff --check`.
- [ ] Run all release commands from a clean environment configuration.
- [ ] Start the dev server and verify homepage, localized route, admin login, portal login, checkout inquiry, and audit form behavior.
- [ ] Confirm no real secrets or `.data` files are tracked.
- [ ] Summarize remaining deployment prerequisites: durable provider selection, real domain/contact values, SMTP, and payment provider.
