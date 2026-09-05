import { episodes } from "@/lib/data/podcast";
import { pressItems as news } from "@/lib/data/company";
import { readJsonStore } from "@/lib/leads";

export const dynamic = "force-dynamic";

function icsDate(date: string): string {
  return date.replace(/-/g, "");
}

function esc(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function event(uid: string, date: string, summary: string, description: string): string[] {
  const end = new Date(`${date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1); // DTEND is exclusive for all-day events
  return [
    "BEGIN:VEVENT",
    `UID:${uid}@theflagship.example`,
    `DTSTAMP:${icsDate(new Date().toISOString().slice(0, 10))}T090000Z`,
    `DTSTART;VALUE=DATE:${icsDate(date)}`,
    `DTEND;VALUE=DATE:${icsDate(end.toISOString().slice(0, 10))}`,
    `SUMMARY:${esc(summary)}`,
    `DESCRIPTION:${esc(description)}`,
    "END:VEVENT",
  ];
}

export async function GET() {
  const items = await readJsonStore<{ publishAt?: string; title: string; stage: string }[]>("content.json", []);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//THE FLAGSHIP//Content Calendar//EN",
    "CALSCALE:GREGORIAN",
  ];

  for (const item of items) {
    if (!item.publishAt) continue;
    lines.push(...event(`content-${item.title.slice(0, 24)}`, item.publishAt, `Publish: ${item.title}`, `Stage: ${item.stage}`));
  }
  for (const ep of episodes) {
    lines.push(...event(`episode-${ep.slug}`, ep.date, `THE FLAGSHIP AI Podcast · EP ${String(ep.number).padStart(3, "0")}: ${ep.title}`, `${ep.guest} — ${ep.role}. ${ep.teaser}`));
  }
  for (const n of news) {
    lines.push(...event(`news-${n.date}-${n.outlet.slice(0, 12)}`, n.date, n.title, n.outlet));
  }

  lines.push("END:VCALENDAR");

  return new Response(lines.join("\r\n"), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'inline; filename="flagship-calendar.ics"',
    },
  });
}
