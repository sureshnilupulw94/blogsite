export type LegalDoc = { slug: string; title: string; updated: string; sections: { h: string; p: string[] }[] };

const contact = ["hello@theflagship.example", "Colombo, Sri Lanka"];

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "2026-09-01",
    sections: [
      { h: "What we collect", p: ["Contact details you give us (name, email, company, message) when you use a form, tool or assessment.", "Anonymous usage analytics to understand which pages and tools help people.", "Assessment answers — used to generate your result and, only if you submit it, to follow up."] },
      { h: "What we never do", p: ["Sell your data. Ever.", "Use your submitted materials to train public models.", "Share your brief or assessment outside the team handling your inquiry."] },
      { h: "Retention & rights", p: ["Inquiry data is kept for 24 months, then deleted.", "You may request access, correction or deletion anytime at " + contact[0] + "."] },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use",
    updated: "2026-09-01",
    sections: [
      { h: "The site", p: ["Content is provided for general information. Tools produce estimates, not quotations — real proposals follow a real conversation."] },
      { h: "Intellectual property", p: ["Our frameworks, articles and designs belong to The Flagship. Quoting with attribution is welcome; republishing wholesale is not."] },
      { h: "Liability", p: ["Estimates from calculators carry no warranty. Decisions made from them are yours — talk to us before committing budget."] },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    updated: "2026-09-01",
    sections: [
      { h: "What we set", p: ["A preference cookie remembering your language choice.", "Anonymous analytics cookies, aggregate only."] },
      { h: "What we don't set", p: ["Advertising trackers.", "Cross-site profiling cookies of any kind."] },
      { h: "Control", p: ["Block or clear cookies in your browser; the site keeps working. Your language choice simply resets."] },
    ],
  },
  {
    slug: "service-terms",
    title: "Service Terms",
    updated: "2026-09-01",
    sections: [
      { h: "Engagements", p: ["Work proceeds under a signed proposal defining scope, timeline, price and revision rounds. No surprise scope."] },
      { h: "Payments", p: ["Typically 50% to schedule, 50% on delivery unless the proposal states otherwise. Retainers bill monthly in advance."] },
      { h: "Ownership", p: ["On final payment, deliverables and source files are yours. Our reusable internal systems remain ours — that's what keeps quality high."] },
    ],
  },
  {
    slug: "ip",
    title: "Intellectual Property",
    updated: "2026-09-01",
    sections: [
      { h: "Client work", p: ["You own the final deliverables. We show anonymised work in our portfolio unless you ask us not to."] },
      { h: "Our frameworks", p: ["Transformation Map, CREATE and the Index family are Flagship methodologies. Engagements license their use within your organisation."] },
      { h: "Third-party assets", p: ["Fonts, stock and licensed components are passed through under their licenses, clearly documented."] },
    ],
  },
  {
    slug: "confidentiality",
    title: "Confidentiality",
    updated: "2026-09-01",
    sections: [
      { h: "Default posture", p: ["Everything you share is confidential by default. NDAs available on request — we sign them weekly."] },
      { h: "Materials", p: ["Briefs, uploads and brand materials are stored access-controlled and used only for your engagement."] },
    ],
  },
  {
    slug: "data-processing",
    title: "Data Processing",
    updated: "2026-09-01",
    sections: [
      { h: "Principles", p: ["Data minimisation: we collect what the work needs and nothing more.", "Purpose limitation: assessment data scores assessments; it doesn't feed ad platforms."] },
      { h: "Sub-processors", p: ["Hosting, email and analytics providers are vetted and listed on request. International transfers use standard contractual clauses."] },
    ],
  },
  {
    slug: "refunds",
    title: "Refund & Cancellation",
    updated: "2026-09-01",
    sections: [
      { h: "Projects", p: ["Cancel before work begins: full refund of the deposit. After kickoff, completed milestones are billed; the rest is refunded."] },
      { h: "Retainers & subscription", p: ["Pause or cancel any month with 14 days' notice. No lock-in — the model has to be worth staying for."] },
    ],
  },
  {
    slug: "ai-policy",
    title: "AI Usage Policy",
    updated: "2026-09-01",
    sections: [
      { h: "Our stance", p: ["Human expertise amplified by intelligent systems. AI drafts, researches and accelerates; humans decide, edit and own the output."] },
      { h: "Your data", p: ["Client materials never go into public model training. Where AI APIs are used, they operate under zero-retention terms."] },
      { h: "Disclosure", p: ["If you want to know exactly where AI touched your deliverable, we'll tell you. Just ask."] },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    updated: "2026-09-01",
    sections: [
      { h: "Our commitment", p: ["This site targets WCAG 2.2 AA: keyboard navigable, screen-reader friendly, 4.5:1 contrast, reduced-motion support, semantic HTML and scalable typography."] },
      { h: "Known limits", p: ["Before/after sliders and interactive tools have keyboard equivalents. If anything blocks you, tell us and we fix it — accessibility is a principle here, not a checkbox."] },
      { h: "Contact", p: ["Report issues at " + contact[0] + " — we respond within two working days."] },
    ],
  },
];

export function getLegalDoc(slug: string) {
  return legalDocs.find((d) => d.slug === slug);
}
