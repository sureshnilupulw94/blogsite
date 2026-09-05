import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { readJsonStore } from "@/lib/leads";
import { episodes } from "@/lib/data/podcast";
import { pressItems as news } from "@/lib/data/company";
import type { ContentItem } from "../actions";

export const dynamic = "force-dynamic";

type Entry = { date: string; label: string; kind: "content" | "episode" | "news"; detail?: string };

const KIND_STYLE: Record<Entry["kind"], string> = {
  content: "border-accent/50 text-accent",
  episode: "border-sky/50 text-sky",
  news: "border-line text-mute",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function monthMatrix(year: number, month: number): (Date | null)[] {
  const first = new Date(Date.UTC(year, month, 1));
  const startPad = (first.getUTCDay() + 6) % 7; // Monday-first
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(Date.UTC(year, month, d)));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  await requireAdmin();
  const { m } = await searchParams;
  const today = new Date();
  const parsed = m && /^(\d{4})-(\d{2})$/.test(m) ? m.split("-").map(Number) : [today.getFullYear(), today.getMonth() + 1];
  const [year, month] = parsed;
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  const items = await readJsonStore<ContentItem[]>("content.json", []);
  const entries: Entry[] = [
    ...items.filter((x) => x.publishAt).map((x) => ({ date: x.publishAt as string, label: x.title, kind: "content" as const, detail: x.stage })),
    ...episodes.map((e) => ({ date: e.date, label: `EP ${String(e.number).padStart(3, "0")}: ${e.title}`, kind: "episode" as const, detail: e.guest })),
    ...news.map((n) => ({ date: n.date, label: n.title, kind: "news" as const, detail: n.outlet })),
  ].filter((e) => e.date.startsWith(monthKey));

  const byDay = new Map<number, Entry[]>();
  for (const e of entries) {
    const day = Number(e.date.slice(8, 10));
    byDay.set(day, [...(byDay.get(day) ?? []), e]);
  }

  const cells = monthMatrix(year, month - 1);
  const prev = month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;
  const next = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio OS · content factory</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{MONTHS[month - 1]} {year}</h1>
          <p className="mt-2 text-sm text-mute">
            {entries.length} entries · publish dates pinned on the <Link href="/admin/content" className="text-accent hover:underline">pipeline</Link> appear here. Public ICS feed: <a href="/api/calendar.ics" className="font-mono text-accent hover:underline">/api/calendar.ics</a>
          </p>
        </div>
        <div className="flex gap-2 font-mono text-xs">
          <Link href={`/admin/calendar?m=${prev}`} className="rounded-full border border-line px-4 py-2 text-mute hover:text-paper">← {prev}</Link>
          <Link href={`/admin/calendar?m=${next}`} className="rounded-full border border-line px-4 py-2 text-mute hover:text-paper">{next} →</Link>
        </div>
      </header>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-coal p-4">
        <div className="grid min-w-[720px] grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="pb-2 text-center font-mono text-[10px] uppercase tracking-widest text-mute">{d}</div>
          ))}
          {cells.map((cell, i) => {
            const dayEntries = cell ? byDay.get(cell.getUTCDate()) ?? [] : [];
            const isToday = cell && cell.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);
            return (
              <div key={i} className={`min-h-24 rounded-xl border p-2 ${cell ? "border-line/60 bg-carbon/60" : "border-transparent"}`}>
                {cell && (
                  <>
                    <p className={`font-mono text-[10px] ${isToday ? "text-accent" : "text-mute/70"}`}>{String(cell.getUTCDate()).padStart(2, "0")}{isToday ? " · today" : ""}</p>
                    <div className="mt-1 space-y-1">
                      {dayEntries.map((e, j) => (
                        <p key={j} title={e.detail} className={`truncate rounded border px-1.5 py-0.5 text-[10px] leading-tight ${KIND_STYLE[e.kind]}`}>{e.label}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 font-mono text-[11px] text-mute/70">
        <span className="text-accent">■ content</span> · <span className="text-sky">■ episodes</span> · <span>■ news</span>
      </p>
    </div>
  );
}
