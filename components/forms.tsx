"use client";

import { useState, type FormEvent } from "react";
import type { Dict } from "@/lib/dictionaries";
import { track } from "@/lib/analytics";
import { cx } from "./ui";

async function post(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("request failed");
  return res.json();
}

const inputCls =
  "w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm text-paper placeholder:text-mute/60 focus:border-accent/60 focus:outline-none";

export function NewsletterForm({ dict }: { dict: Dict }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setState("sending");
    try {
      await post("/api/subscribe", { email });
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="font-display text-sm text-accent">{dict.common.success}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="nl-email">{dict.home.emailPlaceholder}</label>
      <input id="nl-email" name="email" type="email" required placeholder={dict.home.emailPlaceholder} className={cx(inputCls, "sm:max-w-64")} />
      <button type="submit" disabled={state === "sending"} className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60">
        {state === "sending" ? dict.common.sending : dict.home.subscribe}
      </button>
    </form>
  );
}

export function ContactForm({ dict }: { dict: Dict }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      await post("/api/leads", { type: "contact", ...data });
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-accent/40 bg-coal p-8 text-center">
        <p className="font-display text-xl font-semibold text-accent">{dict.common.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-medium text-mute">{dict.common.name}</label>
          <input id="cf-name" name="name" required className={inputCls} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-medium text-mute">{dict.common.email}</label>
          <input id="cf-email" name="email" type="email" required className={inputCls} autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="cf-company" className="mb-1.5 block text-xs font-medium text-mute">{dict.common.company} <span className="text-mute/50">({dict.common.optional})</span></label>
        <input id="cf-company" name="company" className={inputCls} autoComplete="organization" />
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-xs font-medium text-mute">{dict.common.message}</label>
        <textarea id="cf-message" name="message" required rows={5} className={inputCls} />
      </div>
      {state === "error" ? <p className="text-sm text-red-400">{dict.common.error}</p> : null}
      <button type="submit" disabled={state === "sending"} className="justify-self-start rounded-full bg-accent px-8 py-3.5 font-display text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60">
        {state === "sending" ? dict.common.sending : dict.common.send}
      </button>
    </form>
  );
}

export function MiniCapture({ dict, cta, payload }: { dict: Dict; cta: string; payload: Record<string, unknown> }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setState("sending");
    try {
      await post("/api/leads", { type: "tool", ...payload, ...data });
      track("lead_submit", { tool: typeof payload.tool === "string" ? payload.tool : typeof payload.type === "string" ? payload.type : "tool" });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="font-display text-sm text-accent">{dict.common.success}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-3 rounded-2xl border border-accent/30 bg-carbon/60 p-5 sm:grid-cols-[1fr_1fr_auto]">
      <input name="name" required placeholder={dict.common.name} aria-label={dict.common.name} className={inputCls} />
      <input name="email" type="email" required placeholder={dict.common.email} aria-label={dict.common.email} className={inputCls} />
      <button type="submit" disabled={state === "sending"} className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink disabled:opacity-60">
        {state === "sending" ? dict.common.sending : cta}
      </button>
      {state === "error" ? <p className="text-sm text-red-400 sm:col-span-3">{dict.common.error}</p> : null}
    </form>
  );
}
