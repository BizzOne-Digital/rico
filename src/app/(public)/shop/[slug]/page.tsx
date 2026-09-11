import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Product, getSiteSettings } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND, DEFAULT_DISCLAIMER } from "@/lib/constants";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductGrid } from "@/components/shop/ProductGrid";
import type { ShopProduct } from "@/components/shop/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug }).populate("category");
  if (!product) return null;

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: { $in: ["active", "out_of_stock"] },
  })
    .populate("category")
    .limit(4);

  const settings = await getSiteSettings();

  return {
    product: JSON.parse(JSON.stringify(product)),
    related: JSON.parse(JSON.stringify(related)) as ShopProduct[],
    disclaimer: settings.medicalDisclaimer || DEFAULT_DISCLAIMER,
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return createMetadata({ title: "Product Not Found", description: "", path: `/shop/${slug}` });

  const { product } = data;
  return createMetadata({
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.shortDescription || `${product.name} from ${BRAND.name}`,
    path: `/shop/${slug}`,
    image: product.featuredImage || product.images?.[0]?.url,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();

  const { product, related, disclaimer } = data;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.featuredImage || product.images?.[0]?.url,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability:
        product.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="page-shell page-offset">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailClient product={product} disclaimer={disclaimer} />

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <h2 className="font-serif text-2xl text-deep-forest md:text-3xl">Related Products</h2>
          <div className="mt-8">
            <ProductGrid products={related} columns={4} />
          </div>
        </section>
      )}
    </div>
  );
}
