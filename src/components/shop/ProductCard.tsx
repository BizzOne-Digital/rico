"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { formatProductPrice } from "@/lib/product-pricing";
import { formatPriceDollars } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { QuickView } from "./QuickView";

export interface ShopProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  featuredImage?: string;
  images?: { url: string; alt: string; order: number }[];
  benefits?: string[];
  status: string;
  size?: string;
  format?: string;
  category?: { name?: string };
}

export type ProductCardData = ShopProduct;

interface ProductCardProps {
  product: ShopProduct;
  onQuickView?: (product: ShopProduct) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const image = product.featuredImage || product.images?.[0]?.url || "";
  const canAdd = product.status === "active";

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-soft-ivory bg-warm-white transition-all hover:border-electric hover:shadow-lg">
        <Link href={`/shop/${product.slug}`} className="relative aspect-square overflow-hidden bg-soft-ivory">
          <ProductImage
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          {product.status === "out_of_stock" && (
            <Badge className="absolute left-3 top-3" variant="warning">Out of Stock</Badge>
          )}
          {product.status === "coming_soon" && (
            <Badge className="absolute left-3 top-3" variant="neutral">Coming Soon</Badge>
          )}
        </Link>
        <div className="flex flex-1 flex-col p-3 sm:p-5">
          {product.category?.name && (
            <span className="text-[10px] uppercase tracking-wider text-botanical">{product.category.name}</span>
          )}
          <Link href={`/shop/${product.slug}`}>
            <h3 className="mt-1 font-serif text-base leading-snug text-deep-forest hover:text-botanical transition-colors sm:text-lg">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm font-semibold text-deep-forest">
            {formatProductPrice(product.price, product.status)}
            {product.status === "active" && product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="ml-2 text-xs text-metallic-silver line-through">
                {formatPriceDollars(product.compareAtPrice)}
              </span>
            )}
          </p>
          {product.benefits && product.benefits.length > 0 && (
            <p className="mt-2 text-xs text-metallic-silver line-clamp-2">
              {product.benefits.slice(0, 3).join(" • ")}
            </p>
          )}
          <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row">
            {canAdd && (
              <AddToCartButton
                product={{
                  productId: product._id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image,
                  size: product.size,
                  format: product.format,
                }}
                size="sm"
                className="w-full sm:flex-1"
              />
            )}
            <button
              type="button"
              onClick={() => (onQuickView ? onQuickView(product) : setQuickViewOpen(true))}
              className="w-full rounded-full border border-soft-ivory px-3 py-2 text-[10px] uppercase tracking-wider text-deep-forest hover:bg-soft-ivory transition-colors sm:w-auto sm:px-4 sm:text-xs"
            >
              Quick View
            </button>
          </div>
        </div>
      </article>
      <QuickView product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
