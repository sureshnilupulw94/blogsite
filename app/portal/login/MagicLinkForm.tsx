"use client";

import { useActionState } from "react";
import { requestMagicLink, type MagicLinkState } from "../actions";

export default function MagicLinkForm() {
  const [state, action, pending] = useActionState<MagicLinkState, FormData>(requestMagicLink, null);

  return (
    <div>
      <form action={action} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm focus:border-accent/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="whitespace-nowrap rounded-full bg-accent px-7 py-3 font-display text-sm font-semibold text-accent-ink disabled:opacity-60"
        >
          {pending ? "Creating link…" : "Send login link"}
        </button>
      </form>

      {state ? (
        <div className={`mt-4 rounded-xl border p-4 text-sm ${state.ok ? "border-accent/40 bg-accent/5 text-paper" : "border-red-400/40 bg-red-400/5 text-red-300"}`}>
          <p>{state.message}</p>
          {state.devLink ? (
            <a href={state.devLink} className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-sm font-semibold text-accent-ink">
              Open portal →
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
