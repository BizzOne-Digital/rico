import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product, ProductCategory, getSiteSettings } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BenefitExplorer } from "@/components/home/BenefitExplorer";
import { SourceToRitual } from "@/components/home/SourceToRitual";
import { MycoDoseFeature } from "@/components/home/MycoDoseFeature";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { SplitImageSection } from "@/components/layout/SplitImageSection";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import type { ShopProduct } from "@/components/shop/ProductCard";

export const metadata: Metadata = createMetadata({
  title: `${BRAND.name} | ${BRAND.headline}`,
  description:
    "Optimized living through functional mushrooms, intentional wellness products, personalized assessment and everyday performance support.",
  path: "/",
});

async function getHomeData() {
  await connectDB();
  const settings = await getSiteSettings();

  const [featuredProducts, allProducts, categories] = await Promise.all([
    Product.find({ featured: true, status: { $in: ["active", "out_of_stock"] } })
      .populate("category")
      .sort({ displayOrder: 1 })
      .limit(8),
    Product.find({ status: { $in: ["active", "out_of_stock"] } })
      .populate("category")
      .limit(50),
    ProductCategory.find({ active: true }).sort({ displayOrder: 1 }),
  ]);

  return {
    settings: JSON.parse(JSON.stringify(settings)),
    featuredProducts: JSON.parse(JSON.stringify(featuredProducts)) as ShopProduct[],
    allProducts: JSON.parse(JSON.stringify(allProducts)) as ShopProduct[],
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export default async function HomePage() {
  const { settings, featuredProducts, allProducts, categories } = await getHomeData();

  return (
    <>
      <HeroSection />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <SplitImageSection image={PAGE_IMAGES.mushroomExtracts} alt="Functional mushroom products">
        <h2 className="font-serif text-3xl md:text-4xl">Optimized Living Story</h2>
        <p className="mt-4 text-lg leading-relaxed">
          Fungtional Labs Inc. created Fungtional Wellness to make the benefits of functional and
          gourmet mushrooms accessible through clean, natural and thoughtfully developed products.
        </p>
        <Link
          href="/about"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-electric/60 px-8 text-sm font-medium uppercase tracking-[0.06em] text-warm-white transition-colors hover:border-electric hover:bg-deep-forest/40"
        >
          Our Story
        </Link>
      </SplitImageSection>
      <BenefitExplorer products={allProducts} />
      <SourceToRitual />
      <section className="section-spacing bg-obsidian text-warm-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl">Wellness Services</h2>
            <p className="mt-4 max-w-2xl text-metallic-silver">
              Products, assessments and personal optimization to support your wellness journey.
            </p>
          </ScrollReveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { title: "Wellness Products", desc: "Curated functional mushroom products for daily use.", href: "/shop", img: PAGE_IMAGES.capsules },
              { title: "Wellness Assessment", desc: "A consultation to understand your objectives and routines.", href: "/booking", img: PAGE_IMAGES.wellnessResearch },
              { title: "Personal Optimization", desc: "Guided support selecting suitable wellness routines.", href: "/services", img: PAGE_IMAGES.premiumProducts },
            ].map((service) => (
              <ScrollReveal key={service.title}>
                <Link
                  href={service.href}
                  className="group block overflow-hidden rounded-2xl border border-deep-forest bg-carbon transition-colors hover:border-electric"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={service.img} alt={service.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-electric">{service.title}</h3>
                    <p className="mt-2 text-sm text-metallic-silver">{service.desc}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <MycoDoseFeature />
      <TestimonialsSection testimonials={settings.testimonials || []} />
      <NewsletterSection />
    </>
  );
}
