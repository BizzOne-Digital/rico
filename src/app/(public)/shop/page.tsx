import type { Metadata } from "next";
import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import { Product, ProductCategory } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ShopProduct } from "@/components/shop/ProductCard";
import Link from "next/link";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = createMetadata({
  title: "Shop",
  description: `Browse functional mushroom products from ${BRAND.name} — capsules, drops, powders, beverages and more.`,
  path: "/shop",
});

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    benefit?: string;
    format?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getProducts(params: Awaited<ShopPageProps["searchParams"]>) {
  await connectDB();

  const page = parseInt(params.page || "1");
  const limit = 12;
  const filter: Record<string, unknown> = { status: { $in: ["active", "out_of_stock", "coming_soon"] } };

  if (params.category) {
    const cat = await ProductCategory.findOne({ slug: params.category });
    if (cat) filter.category = cat._id;
  }
  if (params.benefit) filter.benefits = { $regex: params.benefit, $options: "i" };
  if (params.format) filter.format = { $regex: params.format, $options: "i" };
  if (params.search) {
    filter.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { shortDescription: { $regex: params.search, $options: "i" } },
      { benefits: { $regex: params.search, $options: "i" } },
    ];
  }
  if (params.minPrice) filter.price = { ...((filter.price as object) || {}), $gte: parseFloat(params.minPrice) };
  if (params.maxPrice) filter.price = { ...((filter.price as object) || {}), $lte: parseFloat(params.maxPrice) };

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (params.sort === "price-asc") sortOption = { price: 1 };
  if (params.sort === "price-desc") sortOption = { price: -1 };
  if (params.sort === "featured") sortOption = { featured: -1, displayOrder: 1 };
  if (params.sort === "name") sortOption = { name: 1 };

  const skip = (page - 1) * limit;
  const [products, total, categories] = await Promise.all([
    Product.find(filter).populate("category").sort(sortOption).skip(skip).limit(limit),
    Product.countDocuments(filter),
    ProductCategory.find({ active: true }).sort({ displayOrder: 1 }),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)) as ShopProduct[],
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { products, pagination, categories } = await getProducts(params);

  return (
    <div className="page-shell">
      <PageHero size="compact" align="left" image={PAGE_IMAGES.productsHero} imageAlt="Fungtional Wellness product collection">
        <h1 className="font-serif text-4xl md:text-5xl">Shop</h1>
        <p className="mt-3 max-w-xl text-metallic-silver">
          Functional mushroom products engineered for everyday wellness.
        </p>
      </PageHero>

      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            <ShopFilters categories={categories} />
          </Suspense>

          <div>
            <p className="mb-6 text-sm text-botanical">
              Showing {products.length} of {pagination.total} products
            </p>
            <ProductGrid products={products} columns={2} />

            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => {
                  const query = new URLSearchParams({ ...params, page: String(p) } as Record<string, string>);
                  return (
                    <Link
                      key={p}
                      href={`/shop?${query.toString()}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
                        p === pagination.page
                          ? "bg-deep-forest text-warm-white"
                          : "border border-soft-ivory text-deep-forest hover:bg-soft-ivory"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
