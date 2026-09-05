"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-line px-5 py-2.5 font-display text-xs font-semibold text-mute hover:text-paper"
    >
      Print / PDF
    </button>
  );
}
