import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product, Service } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { CATALOGUE_PRICE_LABELS, formatProductPrice } from "@/lib/product-pricing";
import { formatPriceDollars } from "@/lib/utils";
import Image from "next/image";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description: `View pricing for ${BRAND.name} functional mushroom products and wellness services.`,
  path: "/pricing",
});

const CATALOGUE_PRICING = [
  { category: "Mushroom Capsules", price: CATALOGUE_PRICE_LABELS.capsules },
  { category: "Mushroom Oral Drops", price: CATALOGUE_PRICE_LABELS.oralDrops },
  { category: "Mushroom Powders", price: CATALOGUE_PRICE_LABELS.powders },
  { category: "Myco Dose", price: `${CATALOGUE_PRICE_LABELS.mycoDose} — 12 × 2 oz bottles` },
];

export default async function PricingPage() {
  await connectDB();
  const [products, services] = await Promise.all([
    Product.find({ status: { $in: ["active", "out_of_stock", "coming_soon"] } })
      .populate("category")
      .sort({ displayOrder: 1, name: 1 }),
    Service.find({ active: true }).sort({ displayOrder: 1 }),
  ]);

  const productData = JSON.parse(JSON.stringify(products));
  const serviceData = JSON.parse(JSON.stringify(services));

  return (
    <div className="page-shell">
      <PageHero image={PAGE_IMAGES.premiumProducts} imageAlt="Premium Fungtional Wellness products">
        <h1 className="font-serif text-4xl md:text-5xl">Pricing</h1>
        <p className="mt-4 text-metallic-silver">Transparent pricing for products and services.</p>
      </PageHero>

      <section className="bg-page content-on-dark mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[PAGE_IMAGES.capsules, PAGE_IMAGES.oralDrops, PAGE_IMAGES.powder].map((img, i) => (
            <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image src={img} alt="Product pricing" fill sizes="400px" className="object-cover" />
            </div>
          ))}
        </div>
        <ScrollReveal>
          <h2 className="font-serif text-2xl text-warm-white">Catalogue Overview</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATALOGUE_PRICING.map((item) => (
              <div key={item.category} className="surface-card rounded-2xl p-6">
                <h3 className="font-medium text-warm-white">{item.category}</h3>
                <p className="mt-2 text-lg font-semibold text-electric">{item.price}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-12">
          <h2 className="font-serif text-2xl text-warm-white">All Products</h2>
          <div className="mt-8 w-full min-w-0 overflow-x-auto surface-card rounded-2xl p-4">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-deep-forest/50 text-xs uppercase tracking-wider text-metallic-silver">
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Format</th>
                  <th className="pb-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {productData.map((p: { _id: string; name: string; slug: string; price: number; format?: string; status: string; category?: { name?: string } }) => (
                  <tr key={p._id} className="border-b border-deep-forest/30">
                    <td className="py-4 pr-4">
                      <Link href={`/shop/${p.slug}`} className="font-medium text-warm-white hover:text-electric">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-metallic-silver">{p.category?.name || "—"}</td>
                    <td className="py-4 pr-4 text-metallic-silver">{p.format || "—"}</td>
                    <td className="py-4 font-semibold text-electric">
                      {formatProductPrice(p.price, p.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-12">
          <h2 className="font-serif text-2xl text-warm-white">Services</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {serviceData.map((s: { _id: string; title: string; price?: number; duration?: string }) => (
              <div key={s._id} className="surface-card rounded-2xl p-6">
                <h3 className="font-serif text-xl text-warm-white">{s.title}</h3>
                <p className="mt-3 text-lg font-semibold text-electric">
                  {s.price ? formatPriceDollars(s.price) : "Contact for pricing"}
                </p>
                {s.duration && <p className="mt-1 text-sm text-metallic-silver">{s.duration}</p>}
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-10 text-center">
          <Link href="/booking"><Button>Book an Assessment</Button></Link>
        </div>
      </section>
    </div>
  );
}
