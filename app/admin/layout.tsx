import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">{children}</div>
    </div>
  );
}
