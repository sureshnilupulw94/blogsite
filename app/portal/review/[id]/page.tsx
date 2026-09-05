import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePortal, readWorkspace } from "@/lib/portal";
import DocumentViewer from "@/components/DocumentViewer";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requirePortal();
  const ws = await readWorkspace(session.slug);
  const deliverable = ws?.deliverables.find((d) => d.id === id);
  if (!ws || !deliverable) notFound();

  if (!deliverable.pages?.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl font-bold">This deliverable has no review pages yet.</p>
        <p className="mt-3 text-sm text-mute">The studio will publish reviewable pages here when the next version is ready.</p>
        <Link href="/portal" className="mt-6 inline-block rounded-full border border-line px-6 py-3 font-display text-sm hover:border-accent/50">← Workspace</Link>
      </div>
    );
  }

  const comments = ws.comments
    .filter((c) => c.deliverableId === id)
    .map((c) => ({ ...c, mine: c.author === session.email }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Document review</p>
          <h1 className="mt-2 font-display text-3xl font-bold">{deliverable.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-accent/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">{deliverable.status}</span>
          <Link href="/portal" className="rounded-full border border-line px-5 py-2 font-display text-sm hover:border-accent/50">← Workspace</Link>
        </div>
      </header>
      <DocumentViewer deliverableId={deliverable.id} title={deliverable.title} pages={deliverable.pages} comments={comments} />
    </div>
  );
}
