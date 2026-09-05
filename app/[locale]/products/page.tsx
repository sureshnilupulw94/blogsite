import { notFound } from "next/navigation";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { products, membership } from "@/lib/data/products";
import { Badge, Btn, Card, CheckList, PageHero, Section, SectionHeading, cx } from "@/components/ui";
import Reveal from "@/components/Reveal";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  return (
    <>
      <PageHero
        kicker="Digital products & membership"
        title="The studio's output, productised"
        sub="The exact systems, kits and templates we use in client work — plus Agency+, the membership that bundles them with humans."
      />

      <Section className="py-16">
        <Reveal>
          <SectionHeading kicker="Digital products" title="Buy the system, not just the hours" sub="Instant downloads. The same artefacts behind our case studies." />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 50}>
              <Card hover className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <Badge accent>{product.tag}</Badge>
                  <span className="font-mono text-sm text-accent">${product.priceUsd}</span>
                </div>
                <h2 className="mt-4 font-display text-lg font-bold">{product.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mute">{product.blurb}</p>
                <div className="mt-4 flex-1"><CheckList items={product.includes} /></div>
                <div className="mt-5">
                  <Btn href={p(`/checkout?item=${product.slug}`)}>Get it — ${product.priceUsd}</Btn>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 font-mono text-[11px] text-mute/70">Checkout is manual while the store is in beta — we send your files and an invoice within hours.</p>
      </Section>

      <div className="border-y border-line/60 bg-coal/30">
        <Section className="py-16">
          <Reveal>
            <SectionHeading kicker="Membership" title="Agency+" sub="Your external creative & transformation department — the subscription version of this studio." />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {membership.map((tier, i) => (
              <Reveal key={tier.slug} delay={i * 60}>
                <Card hover className={cx("flex h-full flex-col", tier.featured && "border-accent/50")}>
                  <div className="flex items-center justify-between">
                    {tier.featured ? <Badge accent>Most chosen</Badge> : <Badge>{tier.name}</Badge>}
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold">{tier.name}</h3>
                  <p className="mt-1 text-xs text-mute">{tier.blurb}</p>
                  <p className="mt-4 font-mono text-lg text-accent">
                    {tier.priceUsd ? `$${tier.priceUsd}${tier.cadence}` : "Custom"}
                  </p>
                  <div className="mt-5 flex-1"><CheckList items={tier.includes} /></div>
                  <div className="mt-5">
                    {tier.priceUsd ? (
                      <Btn href={p(`/checkout?item=${tier.slug}`)} variant={tier.featured ? "primary" : "ghost"}>Join {tier.name}</Btn>
                    ) : (
                      <Btn href={p("/contact")} variant="ghost">Talk to us</Btn>
                    )}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] text-mute/70">Pause or cancel any month. Members feed the product roadmap.</p>
        </Section>
      </div>

      <Section className="py-16">
        <Reveal>
          <Card className="border-accent/30 bg-accent/5">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl">
                <Badge accent>{d.common.soon}</Badge>
                <h2 className="mt-3 font-display text-2xl font-bold">The Studio Marketplace</h2>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Our products, partner products, and community-made templates in one place — with licences a business can actually trust.
                </p>
              </div>
              <Btn href={p("contact")} variant="ghost">Get notified</Btn>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
