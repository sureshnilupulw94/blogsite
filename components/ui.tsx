import Link from "next/link";
import type { ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const iconPaths: Record<string, ReactNode> = {
  pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1Z" /></>,
  spark: <><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><path d="M12 19v3" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  check: <><path d="m4 12.5 5 5L20 6.5" /></>,
  play: <><path d="m6 4 14 8-14 8V4Z" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  wrench: <><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7Z" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M7 15v-4M12 15V7M17 15v-6" /></>,
  doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path d="M14 2v6h6" /></>,
  users: <><circle cx="9" cy="8" r="4" /><path d="M2 21v-1a7 7 0 0 1 14 0v1" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /><path d="M22 21v-1a6.9 6.9 0 0 0-4-6.3" /></>,
  flask: <><path d="M9 2v6L4 19a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 19L15 8V2" /><path d="M8 2h8" /><path d="M6.5 14h11" /></>,
  zap: <><path d="M13 2 3 14h8l-1 8 11-13h-8l0-7Z" /></>,
};

export function Icon({ name, className = "size-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {iconPaths[name] ?? iconPaths.arrow}
    </svg>
  );
}

export function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cx("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}

export function SectionHeading({ kicker, title, sub, center }: { kicker?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={cx("mb-10 max-w-2xl", center && "mx-auto text-center")}>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {sub ? <p className="mt-4 text-base leading-relaxed text-mute">{sub}</p> : null}
    </div>
  );
}

export function Badge({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <span className={cx(
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest",
      accent ? "border-accent/40 text-accent" : "border-line text-mute"
    )}>
      {children}
    </span>
  );
}

export function Btn({ href, children, variant = "primary", className, external }: { href: string; children: ReactNode; variant?: "primary" | "ghost" | "soft"; className?: string; external?: boolean }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold transition-transform hover:-translate-y-0.5";
  const styles = {
    primary: "bg-accent text-accent-ink hover:opacity-90",
    ghost: "border border-line text-paper hover:border-accent/50",
    soft: "bg-carbon text-paper hover:bg-line",
  } as const;
  if (external) {
    return <a href={href} className={cx(base, styles[variant], className)}>{children}</a>;
  }
  return <Link href={href} className={cx(base, styles[variant], className)}>{children}</Link>;
}

export function Card({ children, className, hover }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cx("rounded-2xl border border-line bg-coal p-6", hover && "card-hover", className)}>
      {children}
    </div>
  );
}

export function Divider() {
  return <hr className="my-16 border-line/60" />;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-coal p-6">
      <div className="font-display text-3xl font-bold text-accent">{value}</div>
      <div className="mt-1 text-sm text-mute">{label}</div>
    </div>
  );
}

export function PageHero({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <header className="glow border-b border-line/60">
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
        <Kicker>{kicker}</Kicker>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">{title}</h1>
        {sub ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">{sub}</p> : null}
      </div>
    </header>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-mute">
          <span className="mt-0.5 text-accent"><Icon name="check" className="size-4" /></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
