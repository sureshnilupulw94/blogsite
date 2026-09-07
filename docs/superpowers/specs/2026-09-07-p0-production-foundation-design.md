# P0 Production and Security Foundation

## Goal

Make the existing Next.js application safe to deploy as a real service without expanding its public content strategy. P0 establishes production configuration, secure request boundaries, hardened admin and portal access, durable persistence requirements, and automated release gates.

## Scope

### In scope

- Production environment validation for site identity and secrets.
- Security headers and private-response cache policy.
- Shared request validation and bounded in-process rate limiting for public endpoints.
- Redirect-aware SSRF protection for the website audit endpoint.
- Signed, expiring admin sessions with login throttling.
- Existing portal HMAC sessions hardened against missing production secrets and token replay accumulation.
- A persistence boundary that supports the current local JSON/filesystem adapter while requiring an explicit durable database configuration for production.
- Typecheck, lint, test, and build release commands.
- Unit and integration coverage for the new security boundaries.

### Out of scope

- SEO metadata and structured data expansion.
- Full multilingual content translation.
- Payment processor integration.
- A complete database migration for every existing domain model.
- New public content, visual redesign, or new monetization features.

## Architecture

### Configuration

Create a single server-only configuration module that reads `NEXT_PUBLIC_SITE_URL`, contact values, `ADMIN_TOKEN`, `PORTAL_SECRET`, and persistence settings. Development may use clearly marked local defaults; production must reject missing values, known development defaults, non-HTTPS site URLs, and filesystem-only persistence unless an explicit single-instance mode is enabled.

Site metadata should read the configured public URL and contact values rather than hardcoded `.example` values. The checked-in example environment file documents every required production value without containing real credentials.

### Security headers

Keep the existing baseline headers and add production-aware HSTS, Permissions Policy, and a restrictive Content Security Policy compatible with the current application. Admin, portal, proposal, and authenticated API responses must use `Cache-Control: private, no-store` and private routes must be marked `noindex` where metadata is available.

### Request protection

Add shared server utilities for:

- JSON/content-length limits.
- Required field and string-length validation.
- Origin checks for cookie-authenticated state changes.
- A bounded in-memory rate limiter suitable for a single process and documented as insufficient for multi-instance deployments until replaced by a shared store.

Apply protection to leads, subscriptions, events, concierge, website audit, and portal login/token endpoints. Return stable `400`, `403`, and `429` responses without exposing internal errors.

### SSRF protection

Parse and validate each outbound URL before fetching. Resolve hostnames and reject loopback, private, link-local, multicast, unspecified, reserved, and IPv4-mapped IPv6 destinations. Redirects must be handled manually so every destination is validated. Enforce redirect count, response size, timeout, and allowed protocols.

### Admin and portal access

Admin login will issue an opaque random session identifier stored server-side through the persistence boundary, with an `httpOnly`, `sameSite=lax`, secure-in-production cookie and an expiration. Authorization will validate the session in every layout/action/page boundary. Login attempts will be throttled and successful/failed attempts recorded without storing credentials in logs.

Portal sessions retain HMAC signing but require `PORTAL_SECRET` in production. Login tokens are single-use, time-limited, and pruned during reads/writes. Production must not display development magic links.

### Persistence boundary

Introduce a small storage contract around the existing lead/event/JSON-store operations and portal records. Keep the filesystem implementation for local development and tests. Add a production readiness check requiring a configured durable storage provider identifier, with an explicit adapter seam for the managed SQL/object-storage implementation to follow. Do not silently claim that local disk is durable.

## Data flow

1. Incoming request reaches a route or server action.
2. Route validates origin, size, shape, and rate-limit allowance.
3. Business logic reads/writes through the storage boundary.
4. External fetches, email delivery, and LLM calls occur only after bounded inputs pass validation.
5. Errors are converted to safe public responses and recorded in bounded operational logs.

## Error handling

- Configuration failures fail fast in production startup/build checks.
- Invalid user input returns `400` with field-neutral messages.
- Failed origin checks return `403`.
- Rate-limited requests return `429` with `Retry-After`.
- SSRF and unsafe redirects return a generic audit failure without disclosing network details.
- Storage failures do not expose filesystem paths, provider credentials, or stack traces.
- Authentication failures redirect or return `401` consistently according to the existing route contract.

## Verification

Add tests for:

- Production configuration rejection and valid configuration.
- Rate-limit windows and bounded key cleanup.
- Origin and payload checks.
- Private IPv4, IPv6, mapped IPv6, DNS, redirect, timeout, and protocol SSRF cases.
- Admin session expiry, tampering, logout, and authorization.
- Portal token expiry, single-use consumption, and pruning.
- Persistence adapter behavior and local fallback rules.

Release commands must include:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

The build must not suppress lint failures. Browser-level verification of the public homepage, localized route, admin login, portal login, checkout inquiry, and website audit form will be performed after the implementation slices are complete.

## Rollout order

1. Configuration and headers.
2. Request protection and SSRF hardening.
3. Admin and portal session hardening.
4. Persistence boundary and production readiness checks.
5. Tests, scripts, and build/lint enforcement.

This order keeps each security boundary independently verifiable and prevents later work from depending on unsafe defaults.
