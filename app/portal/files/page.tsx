import { requirePortal, readWorkspace } from "@/lib/portal";
import { uploadFile } from "../actions";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Brand", "Guidelines", "Copy", "Documents", "Other"];

export default async function FilesPage() {
  const session = await requirePortal();
  const ws = await readWorkspace(session.slug);

  return (
    <div className="space-y-8">
      <header>
        <p className="kicker">Asset vault</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Files</h1>
        <p className="mt-2 max-w-lg text-sm text-mute">
          Logos, guidelines, approved copy, documents — everything the studio works from. Future projects start faster because this exists.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-coal p-6">
        <form action={uploadFile} className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <label htmlFor="file" className="mb-1.5 block text-xs font-medium text-mute">File (max 5 MB)</label>
            <input
              id="file"
              type="file"
              name="file"
              required
              className="w-full cursor-pointer rounded-xl border border-line bg-carbon px-4 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-1.5 file:font-display file:text-xs file:font-semibold file:text-accent-ink"
            />
          </div>
          <div>
            <label htmlFor="category" className="mb-1.5 block text-xs font-medium text-mute">Category</label>
            <select id="category" name="category" className="rounded-xl border border-line bg-carbon px-4 py-2.5 text-sm focus:border-accent/60 focus:outline-none">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold text-accent-ink">Upload</button>
        </form>
      </section>

      <section className="grid gap-3">
        {ws?.files.length ? (
          ws.files.map((f) => (
            <div key={f.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-coal p-4">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{f.name}</p>
                <p className="mt-1 font-mono text-[10px] text-mute">
                  {f.category} · {(f.size / 1024).toFixed(0)} KB · {new Date(f.uploadedAt).toLocaleDateString()}
                  {f.indexed ? <span className="ms-2 rounded-full border border-accent/50 px-2 py-0.5 text-accent">🧠 indexed · {f.indexed.engine} · {(f.indexed.chars / 1000).toFixed(1)}k chars</span> : null}
                </p>
              </div>
              <a href={`/portal/files/${f.id}`} className="rounded-full border border-line px-5 py-2 font-display text-xs hover:border-accent/50 hover:text-accent">
                Download
              </a>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-coal/50 p-10 text-center text-sm text-mute">
            No files yet — the studio may have placed shared assets here, or upload your own above.
          </p>
        )}
      </section>
    </div>
  );
}
