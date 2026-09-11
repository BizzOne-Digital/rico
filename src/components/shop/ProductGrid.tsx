"use client";

import { ProductCard, type ShopProduct } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ShopProduct[];
  onQuickView?: (product: ShopProduct) => void;
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function ProductGrid({ products, onQuickView, columns = 4 }: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="py-12 text-center text-metallic-silver">No products found.</p>
    );
  }

  return (
    <div className={cn("grid w-full min-w-0 gap-4 sm:gap-6", columnClasses[columns])}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
