import { requireAdmin } from "@/lib/admin";
import { readJsonStore } from "@/lib/leads";
import { addContentItem, moveContentItem, deleteContentItem, type ContentItem } from "../actions";

export const dynamic = "force-dynamic";

const COLUMNS: { key: ContentItem["stage"]; label: string }[] = [
  { key: "idea", label: "Idea" },
  { key: "draft", label: "Draft" },
  { key: "review", label: "Review" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
];

export default async function ContentPage() {
  await requireAdmin();
  const items = await readJsonStore<ContentItem[]>("content.json", []);

  return (
    <div>
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio OS · content factory</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Content pipeline</h1>
        <p className="mt-2 text-sm text-mute">One idea → everywhere. Move items along the line as they progress.</p>
      </header>

      <form action={addContentItem} className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-line bg-coal p-5">
        <input name="title" required placeholder="New content idea — e.g. EP 007: The knowledge-architects follow-up" className="min-w-64 flex-1 rounded-xl border border-line bg-carbon px-4 py-2.5 text-sm focus:border-accent/60 focus:outline-none" />
        <input name="assignee" placeholder="owner" className="w-28 rounded-xl border border-line bg-carbon px-4 py-2.5 text-sm focus:border-accent/60 focus:outline-none" />
        <button type="submit" className="rounded-full bg-accent px-6 py-2.5 font-display text-sm font-semibold text-accent-ink">Add</button>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {COLUMNS.map((col) => {
          const colItems = items.filter((x) => x.stage === col.key);
          return (
            <section key={col.key} className="rounded-2xl border border-line bg-coal p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-mute">{col.label}</h2>
                <span className="font-mono text-xs text-accent">{colItems.length}</span>
              </div>
              <div className="space-y-3">
                {colItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-line/60 bg-carbon p-4">
                    <p className="text-sm leading-snug text-paper">{item.title}</p>
                    <p className="mt-1.5 font-mono text-[10px] text-mute">{item.assignee ?? "unassigned"} · {new Date(item.updatedAt).toLocaleDateString()}</p>
                    <div className="mt-3 flex items-center gap-2">
                      {col.key !== "idea" ? (
                        <form action={moveContentItem}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="dir" value="prev" />
                          <button type="submit" aria-label="Move back" className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute hover:text-paper">←</button>
                        </form>
                      ) : null}
                      {col.key !== "published" ? (
                        <form action={moveContentItem}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="dir" value="next" />
                          <button type="submit" aria-label="Move forward" className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute hover:text-accent">→</button>
                        </form>
                      ) : null}
                      <form action={deleteContentItem} className="ms-auto">
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" aria-label="Delete" className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-mute hover:text-red-300">✕</button>
                      </form>
                    </div>
                  </div>
                ))}
                {!colItems.length ? <p className="rounded-xl border border-dashed border-line/60 p-4 text-center text-xs text-mute/60">empty</p> : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
