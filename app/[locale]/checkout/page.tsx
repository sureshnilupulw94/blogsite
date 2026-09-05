import { notFound, redirect } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { products, membership } from "@/lib/data/products";
import { createOrder, getOrder, type OrderItem } from "@/lib/orders";
import { recordEvent, recordLead } from "@/lib/leads";
import { Badge, Btn, Card, CheckList, PageHero, Section } from "@/components/ui";
import { NewsletterForm } from "@/components/forms";
import Reveal from "@/components/Reveal";

type Search = { item?: string; done?: string };

function findItem(slug?: string): OrderItem | null {
  if (!slug) return null;
  const product = products.find((p) => p.slug === slug);
  if (product) return { kind: "product", slug: product.slug, title: product.name, priceUsd: product.priceUsd };
  const tier = membership.find((t) => t.slug === slug);
  if (tier) return { kind: "membership", slug: tier.slug, title: `${tier.name} — Agency+`, priceUsd: tier.priceUsd, recurring: tier.cadence };
  return null;
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);
  const { item, done } = await searchParams;

  /* ---------- confirmation ---------- */
  if (done) {
    const order = await getOrder(done);
    return (
      <>
        <PageHero
          kicker="Order received"
          title={order ? `Reserved — ${order.ref}` : "Order received"}
          sub={order ? `We've reserved ${order.item.title} for ${order.email}. A payment link and delivery details are on the way — usually within one working day.` : "Thanks — we'll be in touch shortly."}
        />
        <Section className="py-16">
          <Reveal>
            <Card className="mx-auto max-w-xl">
              {order ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-mute">Reference</dt><dd className="font-mono">{order.ref}</dd></div>
                  <div className="flex justify-between"><dt className="text-mute">Item</dt><dd>{order.item.title}</dd></div>
                  <div className="flex justify-between"><dt className="text-mute">Amount</dt><dd className="font-mono">{order.item.priceUsd === 0 ? "Custom quote" : `$${order.item.priceUsd}${order.item.recurring ?? ""}`}</dd></div>
                  <div className="flex justify-between"><dt className="text-mute">Status</dt><dd><Badge accent>reserved</Badge></dd></div>
                </dl>
              ) : (
                <p className="text-sm text-mute">We couldn't find that order reference, but your request reached the studio.</p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Btn href={p("/products")}>Back to products</Btn>
                <Btn href={p("/contact")} variant="ghost">Talk to the studio</Btn>
              </div>
              <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-mute">
                Payments run manually while the store is in beta — no card is charged today. Questions? <span className="text-accent">hello@theflagship.example</span>
              </p>
            </Card>
          </Reveal>
        </Section>
      </>
    );
  }

  /* ---------- item lookup ---------- */
  const orderItem = findItem(item);
  const tier = item ? membership.find((t) => t.slug === item) : undefined;
  const includes = products.find((x) => x.slug === item)?.includes ?? tier?.includes ?? [];

  async function placeOrder(formData: FormData) {
    "use server";
    const localeRaw = String(formData.get("locale") || "en");
    const locale = (isLocale(localeRaw) ? localeRaw : "en") as Locale;
    const slug = String(formData.get("item") || "");
    const resolved = findItem(slug);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    if (!resolved || !name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      redirect(localePath(locale, `/checkout?item=${encodeURIComponent(slug)}`));
    }
    const order = await createOrder({
      item: resolved,
      name,
      email,
      company: String(formData.get("company") || ""),
      note: String(formData.get("note") || ""),
    });
    await recordLead("leads", {
      type: resolved.kind === "membership" ? "membership" : "order",
      item: resolved.slug,
      ref: order.ref,
      orderId: order.id,
      name,
      email,
      company: order.company,
      message: order.note || `${resolved.title} order`,
    });
    await recordEvent({ type: "event", name: "order_placed", company: order.company ?? name, value: resolved.priceUsd });
    redirect(localePath(locale, `/checkout?done=${order.id}`));
  }

  if (item && !orderItem) {
    return (
      <>
        <PageHero kicker="Checkout" title="We couldn't find that item" sub="The link may be mistyped — the full catalogue is one click away." />
        <Section className="py-16">
          <Reveal>
            <Card className="mx-auto max-w-xl text-center">
              <p className="text-sm text-mute">Browse products and membership, then check out from there.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Btn href={p("/products")}>Products & membership</Btn>
              </div>
            </Card>
          </Reveal>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        kicker="Checkout"
        title="Reserve your copy"
        sub="No card today — the store runs on manual fulfilment while in beta. Reserve here and we email a payment link; delivery follows the moment it clears."
      />
      <Section className="py-16">
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <Card className="h-full">
              {orderItem ? (
                <>
                  <div className="flex items-center justify-between">
                    <Badge accent>{orderItem.kind === "membership" ? "Membership" : "Product"}</Badge>
                    <span className="font-mono text-sm text-accent">{orderItem.priceUsd === 0 ? "custom" : `$${orderItem.priceUsd}${orderItem.recurring ?? ""}`}</span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold">{orderItem.title}</h2>
                  {includes.length > 0 && (
                    <div className="mt-4"><CheckList items={includes} /></div>
                  )}
                  <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-mute">
                    14-day guarantee on every product. Cancel membership any time — no lock-in, no awkward calls.
                  </p>
                </>
              ) : (
                <>
                  <Badge accent>Cart</Badge>
                  <h2 className="mt-4 font-display text-xl font-bold">Pick what you need</h2>
                  <p className="mt-2 text-sm text-mute">Arrive from a product or membership page and your item appears here, ready to reserve.</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Btn href={p("/products")} variant="ghost">Products</Btn>
                  </div>
                </>
              )}
            </Card>
          </Reveal>
          <Reveal delay={80}>
            <Card className="h-full">
              {orderItem ? (
                <form action={placeOrder} className="space-y-4">
                  <input type="hidden" name="item" value={orderItem.slug} />
                  <input type="hidden" name="locale" value={locale} />
                  <div>
                    <label htmlFor="co-name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-mute">Name *</label>
                    <input id="co-name" name="name" required maxLength={120} className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm text-paper placeholder:text-mute/60 focus:border-accent/60 focus:outline-none" placeholder="Nadia Fernando" />
                  </div>
                  <div>
                    <label htmlFor="co-email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-mute">Email *</label>
                    <input id="co-email" name="email" type="email" required maxLength={160} className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm text-paper placeholder:text-mute/60 focus:border-accent/60 focus:outline-none" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label htmlFor="co-company" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-mute">Company</label>
                    <input id="co-company" name="company" maxLength={120} className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm text-paper placeholder:text-mute/60 focus:border-accent/60 focus:outline-none" placeholder="Optional" />
                  </div>
                  <div>
                    <label htmlFor="co-note" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-mute">Note</label>
                    <textarea id="co-note" name="note" rows={3} maxLength={600} className="w-full rounded-xl border border-line bg-carbon px-4 py-3 text-sm text-paper placeholder:text-mute/60 focus:border-accent/60 focus:outline-none" placeholder="Anything we should know?" />
                  </div>
                  <button type="submit" className="w-full rounded-xl bg-accent px-6 py-3 font-display text-sm font-bold text-accent-ink transition-transform hover:-translate-y-0.5">Reserve — {orderItem.priceUsd === 0 ? "request quote" : `$${orderItem.priceUsd}${orderItem.recurring ?? ""}`}</button>
                  <p className="text-center text-xs text-mute">You'll get a payment link by email. Nothing is charged now.</p>
                </form>
              ) : (
                <div className="flex h-full flex-col justify-center gap-4">
                  <p className="text-sm text-mute">The Brief — one clarity email a month. No noise, no funnel nonsense.</p>
                  <NewsletterForm dict={d} />
                </div>
              )}
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
