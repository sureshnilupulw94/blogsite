# THE FLAGSHIP — Master Website OS Blueprint

**Brand:** THE FLAGSHIP — AI Podcast & Studio
**Philosophy:** We make complex things clear. · **Tagline:** Signal, not noise.
**Stack:** Next.js (App Router) + Tailwind v4 + TypeScript · 7 locales (EN/DE/JA/FR/NL/AR/ES, AR = RTL)
**Evolution path:** agency brochure → authority platform → lead engine → sales system → client portal → agency operating system

Legend: ✅ shipped in V1 · 🟡 V1 shell (real logic later) · ⬜ planned (phase number)

---

## Phase 0 — Foundation ✅

- ✅ Next.js 15 + Tailwind v4 + TS scaffold
- ✅ Design system: dark editorial identity (ink/paper/signal-lime), Space Grotesk + Inter + Plex Mono (+ Noto AR/JP fallbacks), tokens in `globals.css`
- ✅ Component library: Section, PageHero, Card, Badge, Btn, Icon set, CheckList, Stat, Reveal (scroll animation), native `<details>` accordions
- ✅ i18n: `[locale]` routing, middleware w/ Accept-Language detection, locale switcher, `hreflang` alternates, RTL for Arabic, translated UI chrome (7 languages)
- ✅ Accessibility: skip link, focus-visible rings, reduced-motion support, keyboard-operable sliders, semantic HTML, aria attributes
- ✅ Security headers, robots.txt, sitemap.xml with language alternates, 404 boundary
- ✅ Lead capture API (`/api/leads`, `/api/subscribe` → `.data/*.jsonl`, gitignored)

## Phase 1 — The experience website ✅ (V1)

- ✅ **Discovery engine** ("What are you trying to achieve?") — home hero + `/discover`; 7 goals → recommended services (primary + support)
- ✅ **AI Concierge** — rule-based guided interview (accomplish → blocker → materials → deadline → budget) → recommended approach, phases, CTA
- ✅ **Transformation Map** (IDEA→CONFUSION→CLARITY→STRATEGY→CREATION→IMPLEMENTATION→TRANSFORMATION→GROWTH) — interactive, per-stage services
- ✅ **CREATE Framework™** + 5D model reference
- ✅ **Service matrix** (needs × disciplines table)
- ✅ 7 services w/ deliverables, process, FAQs, related work/articles: Writing, Design, Digital, Strategy&Transformation, AI&Automation, Podcast&Media, Training
- ✅ **Capability library** — 18 capabilities in 5 families, individual pages
- ✅ **Packages** (Starter/Launch/Growth/Transform/Enterprise) + **Retainers** (Creative/Business/Digital/AI Partner) + **Subscription** ("external creative & transformation department") + pricing philosophy page
- ✅ 13 **industry hubs** w/ challenges + what we do
- ✅ **Problems we solve** — 8 problem-first narratives
- ✅ **Work / case studies** — 4 interactive cases: challenge, approach, **before→after slider**, metrics, lessons, "why this design" section
- ✅ **Podcast** — episode index, episode pages (show notes, quote, waveform player shell 🟡 real audio feed next)
- ✅ **Ideas** — 10 short observations + marquee
- ✅ **Studio** (behind-the-scenes rooms) + **Lab** (experiments) — shells that grow into feeds
- ✅ **Knowledge hub** (`/insights`) — 6 seeded articles w/ full bodies; **Library** — 12 resources w/ format/topic filters + glossary
- ✅ **Newsletter** ("The Brief") — footer + inline forms
- ✅ Contact page + direct channels + brief-builder handoff

## Phase 2 — Lead-generation tools ✅ (V1, client-side)

- ✅ **Business Transformation Index™** — 16 questions, 8 dimensions, per-dimension scores, biggest opportunities, lead capture
- ✅ **AI Readiness Assessment** — 12 questions, 7 dimensions
- ✅ **AI ROI Calculator** (savings, hours, first-year ROI)
- ✅ **Productivity Calculator** (cost of manual work)
- ✅ **Website Project Estimator** (complexity → package suggestion)
- ✅ **Content Cost Calculator** (effort vs retainer)
- ✅ **Project Brief Generator** — 10-step builder → structured brief → copy or send to team
- ⬜ Mini audits: website audit, brand audit, presentation audit, process audit (P3)
- ⬜ Content calendar builder (P3)

## Phase 3 — Intelligence & personalization

- ⬜ Upload→analyze→transform (visitor uploads a document, system flags improvement opportunities)
- ⬜ Recommendation engine ("based on what you've explored…") — needs analytics event store
- ⬜ Personalization (returning visitor greeting, segment variants)
- ⬜ Real AI concierge (LLM-backed, with guardrails) replacing rule-based version
- ⬜ Business analytics: most-viewed service, blog→lead conversion, tool usage funnels, quote abandonment
- ⬜ CRM layer: every interaction → lead record w/ scoring (source, interest, status, potential value)
- ⬜ Localization depth: full content translation (not just UI chrome), LKR/USD/GBP/EUR display

## Phase 4 — Client platform

- ⬜ Auth (magic links) + client accounts
- ⬜ Client workspace: project progress, stages, milestones, next actions
- ⬜ File vault (brand assets, guidelines, approved copy)
- ⬜ Feedback tools (click-on-document comments, resolve workflow)
- ⬜ Approval workflows (DRAFT→INTERNAL→CLIENT→REVISION→APPROVED→FINAL)
- ⬜ **Brand Brain** & **Business Brain** — per-client knowledge bases (RAG)
- ⬜ Document intelligence: upload docs → Company Knowledge Profile

## Phase 5 — Agency operating system (internal /studio)

- ⬜ Leads inbox + AI lead analysis (recommended services, effort, risks)
- ⬜ Proposal generator (brief → scope → pricing → timeline → terms)
- ⬜ Projects, tasks, time, finance, team, content pipeline
- ⬜ AI content factory pipeline (Brand Voice → Knowledge Base → draft → human review → client review → approved)

## Phase 6 — Audience & revenue products

- ⬜ Community (members area), events & ticketed workshops
- ⬜ Digital products, membership (Agency+), marketplace
- ⬜ Annual "State of…" research reports; press kit downloads (shells exist)
- ⬜ Careers experience & applicant tracking (careers page ✅ shell)

## Phase 7 — Operations

- ⬜ Real system status page wired to monitoring (static page ✅)
- ⬜ Project urgency tiers (standard/priority/urgent/emergency) in intake
- ⬜ Multi-currency & timezone-aware scheduling at intake

---

## Sitemap (V1)

```
/[locale]                     home + discovery hero
  /discover                   goals, service matrix, AI concierge, CREATE
  /map                        transformation map + stages + CREATE
  /services                   index + matrix        /services/[slug]
  /capabilities               library tree          /capabilities/[slug]
  /packages                   packages + retainers + pricing philosophy + subscription
  /retainers                  retainer detail
  /industries                 13 hubs               /industries/[slug]
  /problems                   8 problem narratives
  /work                       cases + BA slider     /work/[slug] interactive case
  /podcast                    episodes              /podcast/[slug]
  /ideas  /studio  /lab
  /insights                   knowledge hub         /insights/[slug]
  /library                    filters + glossary
  /tools                      hub                   /tools/[tool] → 2 assessments, 4 calculators, brief builder
  /about  /careers  /partners  /press  /roadmap  /status  /contact
  /legal                      trust centre          /legal/[slug] → 10 policies
```

## Data model (all content in `lib/data/*.ts` — CMS-swappable)

`site` · `services` + `capabilities` + matrix · `packages` + `retainers` + subscription ·
`industries` + `problems` · `podcast` episodes + `ideas` · `knowledge` posts/resources/glossary ·
`work` cases · `company` team/values/jobs/partners/press/roadmap/status/network/events ·
`tools` goals/stages/assessments/calculators · `legal` docs · leads (`.data/*.jsonl`)

## Build order log

1. ✅ Phase 0+1+2 — foundation, full public website, tools (this release)
2. ⬜ Phase 3 — analytics + CRM + real AI concierge
3. ⬜ Phase 4 — client platform (auth, workspace, Brains)
4. ⬜ Phase 5 — internal studio OS
5. ⬜ Phase 6/7 — products, community, ops depth
