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
- ⬜ Content calendar builder (P3+) — ✅ admin calendar + ICS shipped; public builder later

## Phase 3 — Intelligence & personalization

- ✅ **Real AI concierge** — chat-style UI + `/api/concierge`. LLM-backed via OPENAI_API_KEY / ANTHROPIC_API_KEY / GEMINI_API_KEY / any OpenAI-compatible endpoint (see `.env.example`); falls back to a strong deterministic rules engine (keyword scoring → primary/supporting services, rationale, phases, risks, open questions) — always answers, never breaks
- ✅ **Analytics events** — anonymous, DNT-respecting pageviews + named tool events (`/api/events` → `.data/events.jsonl`): discovery_goal, concierge_complete, assessment_complete, audit_complete, calculator_use, lead_submit, website_audit
- ✅ **CRM layer** — internal **Studio CRM at `/admin`** (token-gated via `ADMIN_TOKEN`, default `flagship-dev`): KPI dashboard (leads, 7-day leads, avg score, subscribers, pageviews, view→lead conversion), top pages, tool usage, pipeline funnel, and a leads inbox with computed lead score (0–100), estimated value, urgency, status pipeline (new→contacted→proposal→won→lost) + notes via server actions
- ✅ **Mini audits** — Website Audit (live: fetches the page, 14 checks across SEO/content/UX/conversion, SSRF-guarded), Presentation Audit, Brand Audit, Business Process Audit (questionnaire → dimension scores, findings, ranked fixes + lead capture)
- ⬜ Upload→analyze→transform (visitor uploads a document, system flags improvement opportunities)
- ⬜ Recommendation engine ("based on what you've explored…") — needs richer event store
- ⬜ Personalization (returning visitor greeting, segment variants)
- ⬜ Localization depth: full content translation (not just UI chrome), LKR/USD/GBP/EUR display

## Phase 4 — Client platform

- ✅ **Auth (magic links)** — `/portal/login` creates a single-use, 30-minute token (no passwords). Dev mode shows the link inline; production wires SMTP (env flag `PORTAL_DEV_LINKS=off`). Sessions are HMAC-signed cookies (`PORTAL_SECRET`), 7-day expiry
- ✅ **Client workspace** — `/portal`: project overview (stage, next action, milestone progress bar), milestone timeline with client **Approve** actions, deliverable statuses (draft→internal→client-review→revision→approved→final), revision requests with notes, comment threads, activity feed
- ✅ **File vault** — `/portal/files`: categorized uploads (5 MB cap), authenticated downloads via `/portal/files/[id]`, filenames sanitized, private storage under `.data/portal/{slug}/uploads`
- ✅ **Brand Brain** — `/portal/brain`: per-client knowledge base. Add knowledge (paste/upload text) → auto-chunked; ask questions → retrieval with matched passages, and LLM-grounded answers when a key is configured (`/api/portal/brain`)
- ✅ **Admin integration** — `/admin/clients`: create portal accounts (email + company + project → seeded workspace), generate login links; demo client auto-seeds (`demo@acme.example` / Acme Logistics with a live project)
- ✅ **Pixel-anchored document feedback** — `/portal/review/[id]`: reviewable document pages; click anywhere to pin a note (x/y-anchored pins, numbered); open/resolved threads with resolve/reopen; studio-side feedback inbox with resolve at `/admin/projects/[slug]`
- ✅ **Business Brain** — `/portal/business-brain`: the operations counterpart (policies, SOPs, processes, FAQs). Same ask/teach interaction as Brand Brain; both share `/api/portal/brain` (`which` param) with retrieval + optional LLM answers
- ✅ **SMTP email delivery** — nodemailer via env (`SMTP_HOST/PORT/USER/PASS/FROM`): magic links emailed as branded HTML (dev link also shown unless `PORTAL_DEV_LINKS=off`); optional `MAILER_NOTIFY_EMAIL` pings the studio on every new lead; failures degrade gracefully to the dev link
- ✅ **Studio project views** — `/admin/projects`: all client workspaces with progress + open-note counts; detail page with the feedback inbox, deliverable status controls (draft→…→final), milestones, brains, activity
- ✅ **Document intelligence** — uploads to the client vault are text-extracted locally (PDF via pdf-parse, DOCX via mammoth, plain text passthrough; no network calls) and auto-indexed into the matching Brain (brand uploads → Brand Brain, everything else → Business Brain); files show an indexed badge with engine + size; OCR for images on the roadmap

## Phase 5 — Agency operating system (internal /studio)

- ✅ **AI lead analysis** — one click per lead in `/admin/leads`: recommended services (primary first), studio-day effort estimate, indicative price band, suggested team, risks, and win-notes. LLM-backed when a key is set, deterministic engine otherwise
- ✅ **Proposal generator** — `/admin/proposals/new`: client + objective + services + commercials → auto-drafted scope (from service deliverables), CREATE phases, standard terms → printable/PDF proposal page; status pipeline draft→sent→accepted/declined
- ✅ **Projects, tasks & time** — task board and time log per project in `/admin/projects/[slug]`
- ✅ **Finance** — `/admin/finance`: accepted value, pipeline, logged hours, delivery cost (`STUDIO_HOURLY_COST`), gross margin, per-client table, win rate
- ✅ **Content factory pipeline** — `/admin/content`: idea→draft→review→scheduled→published board
- ✅ **Studio OS shell** — sticky admin nav across dashboard, leads, projects, clients, proposals, finance, content
- ✅ **Client-facing proposal share links** — unguessable `/p/{token}` pages: the client reads the branded proposal and can **Accept/Decline** directly (status + analytics flow back to the studio); generated from the proposal detail page
- ✅ **Team directory & public rate card** — `/team`: every member with craft, rate per hour and booking note; estimate-first billing explained; direct booking capture per person
- ✅ **AI content factory automation** — "Draft it" on ideas stamps a structured draft skeleton (hook/thesis/sections/close + voice check) and auto-advances the board; drafts stored per item
- ✅ **Content repurposing engine** — `/admin/repurpose`: one source (episode, case or raw idea) → LinkedIn post, thread, newsletter blurb, quote cards, SEO pair; deterministic rules honoring brand voice, LLM-polished when a key is set; one click drops channel versions onto the board
- ✅ **Content calendar** — `/admin/calendar` month grid (Monday-first) of pinned publish dates, episodes and news; public machine-readable **ICS feed** at `/api/calendar.ics` (all-day events, correct DTEND), linked from the podcast page

## Phase 6 — Audience & revenue products

- ✅ **Digital products** — `/products`: six studio artefacts productised (Deck System, Document Kit, Brand Kit, SOP System, AI Prompt Pack, Research Template) with buy-interest capture (manual checkout while beta)
- ✅ **Membership: Agency+** — three tiers (Member $29 / Studio+ $99 / Team custom) with join capture; subscription philosophy page cross-linked
- ✅ **Events & workshops** — `/events`: open sessions with register-interest + private corporate program path
- ✅ **Annual research report** — `/research`: "State of Business AI Adoption 2027" with findings preview, contents and email-gated full report
- ✅ **Marketplace teaser** — announced on /products; full store later
- ✅ **Marketplace checkout** — `/checkout?item={slug}`: reserve products & membership with no card (manual fulfilment while beta); orders stored, referenced (`FS-XXXX`), visible in admin with paid/fulfilled/cancelled workflow
- ✅ **Community hub** — `/community`: perks with substance (office hours, workshop room, members' shelf), founding-cohort capture, house rules
- ⬜ Community forums (member discussions)
- ⬜ Stripe payments (card capture at checkout)
- ⬜ Careers experience deepening (applicant tracking exists via leads)

## Phase 7 — Operations

- ✅ **Live status page** — `/status` + machine-readable `/api/status`: real checks (lead store writable, portal seeded, uploads writable, AI engine mode) run per request
- ✅ **Project urgency tiers** — brief builder step: Standard / Priority (+25%) / Urgent (+50%) / Emergency (custom), included in the brief and lead payload
- ✅ **Multi-currency display** — packages page currency switcher (USD/LKR/GBP/EUR, indicative conversion)
- ⬜ Timezone-aware scheduling (calendar integration)
- ⬜ Payments (Stripe) for products & membership

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

## Phase 3 — Intelligence (shipped)

- ✅ AI concierge (chat UI, LLM w/ rules fallback) — `/api/concierge`
- ✅ Analytics events (`/api/events`) + Studio CRM (`/admin`, `ADMIN_TOKEN`)
- ✅ 4 mini audits: website (live fetch), presentation, brand, process

## Phase 4 — Client platform (shipped)

- ✅ Magic-link auth (`/portal`, HMAC sessions, no passwords) — SMTP delivery + dev-link fallback
- ✅ Workspace: milestones + approvals, deliverable pipeline, revisions, activity
- ✅ File vault (uploads + authenticated downloads)
- ✅ Brand Brain & Business Brain (per-client knowledge bases, retrieval + optional LLM answers)
- ✅ Pixel-anchored document feedback (client pins + studio inbox with resolve workflow)
- ✅ Admin client management (`/admin/clients`) + studio project views (`/admin/projects`) + demo seed (`demo@acme.example`)

## Build order log

1. ✅ Phase 0+1+2 — foundation, full public website, tools
2. ✅ Phase 3 — AI concierge, analytics + CRM layer, mini audits
3. ✅ Phase 4 — client platform: magic-link auth, workspace + approvals, file vault, Brand Brain, admin client management
4. ✅ Phase 5 — Studio OS core: AI lead analysis, proposal generator, tasks/time, finance, content pipeline
5. ⬜ Phase 6/7 — products, community, ops depth
4. ⬜ Phase 5 — internal studio OS
5. ⬜ Phase 6/7 — products, community, ops depth
