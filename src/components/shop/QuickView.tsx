"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatProductPrice } from "@/lib/product-pricing";
import { AddToCartButton } from "./AddToCartButton";
import type { ShopProduct } from "./ProductCard";

interface QuickViewProps {
  product: ShopProduct | null;
  open: boolean;
  onClose: () => void;
}

export function QuickView({ product, open, onClose }: QuickViewProps) {
  if (!product) return null;
  const image = product.featuredImage || product.images?.[0]?.url || "";

  return (
    <Modal open={open} onClose={onClose} title={product.name}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-soft-ivory">
          <ProductImage src={image} alt={product.name} fill sizes="400px" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-deep-forest">
            {formatProductPrice(product.price, product.status)}
          </p>
          {product.shortDescription && (
            <p className="mt-3 text-sm text-botanical leading-relaxed">{product.shortDescription}</p>
          )}
          {product.benefits && product.benefits.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-deep-forest">
              {product.benefits.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex gap-3">
            {product.status === "active" && (
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
              />
            )}
            <Link
              href={`/shop/${product.slug}`}
              onClick={onClose}
              className="inline-flex items-center text-sm uppercase tracking-wider text-burnt-orange hover:text-deep-forest"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
