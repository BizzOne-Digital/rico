"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ArrowRight } from "@/components/icons";
import { ProductGrid } from "@/components/shop/ProductGrid";
import type { ShopProduct } from "@/components/shop/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export interface FeaturedProductsProps {
  products: ShopProduct[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FeaturedProducts({
  products,
  title = "Featured Products",
  subtitle = "Curated essentials for energy, focus, and everyday wellness.",
  className,
}: FeaturedProductsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);

  if (products.length === 0) return null;

  return (
    <section className={cn("section-spacing bg-gradient-section", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-electric">
                Best Sellers
              </p>
              <h2 className="mt-3 font-serif text-3xl text-deep-forest sm:text-4xl">
                {title}
              </h2>
              <p className="mt-2 max-w-lg text-sm text-botanical">{subtitle}</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] uppercase text-deep-forest transition-colors hover:text-electric"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <ProductGrid
          products={products}
          onQuickView={setQuickViewProduct}
          columns={4}
        />
      </div>

      <QuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
