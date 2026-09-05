import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { listOrders, setOrderStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  reserved: "border-sky/50 text-sky",
  paid: "border-accent/50 text-accent",
  fulfilled: "border-line text-mute",
  cancelled: "border-red-400/40 text-red-300",
};

async function advance(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as "paid" | "fulfilled" | "cancelled";
  if (id && ["paid", "fulfilled", "cancelled"].includes(status)) {
    await setOrderStatus(id, status);
  }
  revalidatePath("/admin/orders");
}

export default async function OrdersPage() {
  await requireAdmin();
  const orders = await listOrders();
  const open = orders.filter((o) => o.status === "reserved" || o.status === "paid");
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.item.priceUsd, 0);

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">Studio OS · orders</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{orders.length} orders</h1>
          <p className="mt-2 font-mono text-xs text-mute">
            open <span className="text-paper">{open.length}</span> · catalog value <span className="text-accent">${revenue.toLocaleString()}</span> · manual fulfilment
          </p>
        </div>
      </header>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-coal p-8 text-sm text-mute">
          No orders yet. Reserves from the public checkout land here — mark them paid once the invoice clears, fulfilled once delivered.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-line bg-coal p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold">
                    {o.item.title}
                    <span className="ms-3 font-mono text-xs text-mute">{o.ref}</span>
                  </h2>
                  <p className="mt-1 text-sm text-mute">
                    {o.name}{o.company ? ` · ${o.company}` : ""} · <span className="font-mono text-xs">{o.email}</span>
                  </p>
                  {o.note && <p className="mt-2 max-w-xl line-clamp-2 text-xs text-mute/80">“{o.note}”</p>}
                </div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <span className="text-accent">{o.item.priceUsd === 0 ? "custom" : `$${o.item.priceUsd}${o.item.recurring ?? ""}`}</span>
                  <span className="text-mute">{new Date(o.at).toISOString().slice(0, 10)}</span>
                  <span className={`rounded-full border px-3 py-1 uppercase tracking-widest ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                </div>
              </div>
              {o.status !== "fulfilled" && o.status !== "cancelled" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  {o.status === "reserved" && (
                    <form action={advance}>
                      <input type="hidden" name="id" value={o.id} />
                      <input type="hidden" name="status" value="paid" />
                      <button className="rounded-full border border-accent/50 px-4 py-1.5 font-mono text-xs text-accent hover:bg-accent/10">Mark paid</button>
                    </form>
                  )}
                  <form action={advance}>
                    <input type="hidden" name="id" value={o.id} />
                    <input type="hidden" name="status" value="fulfilled" />
                    <button className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-mute hover:text-paper">Mark fulfilled</button>
                  </form>
                  <form action={advance}>
                    <input type="hidden" name="id" value={o.id} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button className="rounded-full border border-red-400/30 px-4 py-1.5 font-mono text-xs text-red-300/80 hover:bg-red-400/10">Cancel</button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
