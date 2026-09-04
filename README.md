# THE FLAGSHIP — AI Podcast & Studio

> We make complex things clear. · Signal, not noise.

A complete agency-ecosystem website: discovery engine, AI concierge, transformation map,
interactive assessments and calculators, project brief generator, knowledge hub, podcast,
7 languages (EN/DE/JA/FR/NL/AR/ES) with full RTL support.

**Read [`BLUEPRINT.md`](./BLUEPRINT.md) for the full master plan** — every feature from V1 through the future client portal and agency OS, with phase status.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

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
