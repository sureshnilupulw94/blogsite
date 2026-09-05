# THE FLAGSHIP — AI Podcast & Studio

> We make complex things clear. · Signal, not noise.

A complete agency-ecosystem website: discovery engine, **AI concierge (LLM-backed with a rules-engine fallback)**, transformation map,
interactive assessments, calculators, **4 mini-audits incl. a live website audit**, project brief generator, knowledge hub, podcast,
**anonymous analytics + an internal Studio CRM (`/admin`)**, 7 languages (EN/DE/JA/FR/NL/AR/ES) with full RTL support.

**Read [`BLUEPRINT.md`](./BLUEPRINT.md) for the full master plan** — every feature from V1 through the future client portal and agency OS, with phase status.

## Run

```bash
npm install
cp .env.example .env.local   # optional: ADMIN_TOKEN + LLM keys for the concierge
npm run dev      # http://localhost:3000
npm run build && npm start
```

- **Studio CRM**: visit `/admin` (dev token: `flagship-dev` — set `ADMIN_TOKEN` in production). Leads (+ AI analysis), analytics, proposals (**shareable client links**), orders, projects (tasks/time/feedback), clients, finance, content pipeline (+ **repurposing engine** and **publish calendar**)
- **Revenue layer**: `/products` (digital products + Agency+ membership), `/checkout` (reserve orders, manual fulfilment in beta), `/events`, `/research` (2027 report), `/community`, `/team` (public rate card), currency switcher on `/packages`
- **Client portal**: visit `/portal/login` and use the seeded demo `demo@acme.example` (dev mode shows the one-time login link inline — or set SMTP env vars to email it). Workspace, approvals, **click-on-page document review**, files, Brand Brain & Business Brain
- **AI Concierge**: works out of the box (rules engine); set any LLM key from `.env.example` for LLM-grade recommendations — the same key powers both Brains

## Structure

```
app/[locale]/…   all pages (24 routes, locale-prefixed, AR = rtl)
app/api/…        lead capture (leads, newsletter)
components/…     design system + interactive tools
lib/data/…       all content (CMS-swappable)
lib/i18n.ts      locales & routing helpers
lib/dictionaries.ts  7-language UI dictionaries
```

## Stack

Next.js 15 · React 19 · Tailwind CSS v4 · TypeScript · zero runtime deps
