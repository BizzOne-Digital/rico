"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { formatProductPrice } from "@/lib/product-pricing";
import { formatPriceDollars } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { Minus, Plus } from "@/components/icons";

interface ProductDetailClientProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    shortDescription?: string;
    description?: string;
    featuredImage?: string;
    images?: { url: string; alt: string; order: number }[];
    benefits?: string[];
    ingredients?: string;
    suggestedUse?: string;
    warnings?: string;
    status: string;
    size?: string;
    format?: string;
    npn?: string;
    stock?: number;
    category?: { name?: string };
  };
  disclaimer: string;
}

export function ProductDetailClient({ product, disclaimer }: ProductDetailClientProps) {
  const images = product.images?.length
    ? [...product.images].sort((a, b) => a.order - b.order)
    : product.featuredImage
      ? [{ url: product.featuredImage, alt: product.name, order: 0 }]
      : [];

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const mainImage = images[activeImage]?.url || product.featuredImage || "";
  const canAdd = product.status === "active";

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6">
      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-soft-ivory">
            <ProductImage src={mainImage} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" priority />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                    i === activeImage ? "border-electric" : "border-soft-ivory"
                  }`}
                >
                  <ProductImage src={img.url} alt={img.alt} fill sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category?.name && (
            <span className="text-xs uppercase tracking-wider text-botanical">{product.category.name}</span>
          )}
          <h1 className="mt-2 font-serif text-3xl text-deep-forest md:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-deep-forest">
              {formatProductPrice(product.price, product.status)}
            </span>
            {product.status === "active" && product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-metallic-silver line-through">
                {formatPriceDollars(product.compareAtPrice)}
              </span>
            )}
            {product.status === "out_of_stock" && <Badge variant="warning">Out of Stock</Badge>}
            {product.status === "coming_soon" && <Badge variant="neutral">Coming Soon</Badge>}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-botanical leading-relaxed">{product.shortDescription}</p>
          )}

          <dl className="mt-6 space-y-2 text-sm">
            {product.size && (
              <div className="flex gap-2">
                <dt className="font-medium text-deep-forest">Size:</dt>
                <dd className="text-botanical">{product.size}</dd>
              </div>
            )}
            {product.format && (
              <div className="flex gap-2">
                <dt className="font-medium text-deep-forest">Format:</dt>
                <dd className="text-botanical">{product.format}</dd>
              </div>
            )}
            {product.npn && (
              <div className="flex gap-2">
                <dt className="font-medium text-deep-forest">NPN:</dt>
                <dd className="text-botanical">{product.npn}</dd>
              </div>
            )}
          </dl>

          {product.benefits && product.benefits.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-deep-forest">Key Benefits</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.benefits.map((b) => (
                  <li key={b}>
                    <Badge variant="success">{b}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {canAdd && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-soft-ivory">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-soft-ivory rounded-l-full"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-soft-ivory rounded-r-full"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <AddToCartButton
                product={{
                  productId: product._id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: mainImage,
                  size: product.size,
                  format: product.format,
                }}
                quantity={quantity}
                size="lg"
                className="flex-1"
              />
            </div>
          )}

          {product.description && (
            <div className="mt-10">
              <h3 className="font-serif text-xl text-deep-forest">Description</h3>
              <p className="mt-3 whitespace-pre-line text-sm text-botanical leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.ingredients && (
            <div className="mt-8">
              <h3 className="font-serif text-xl text-deep-forest">Ingredients</h3>
              <p className="mt-3 text-sm text-botanical leading-relaxed">{product.ingredients}</p>
            </div>
          )}

          {product.suggestedUse && (
            <div className="mt-8">
              <h3 className="font-serif text-xl text-deep-forest">Suggested Use</h3>
              <p className="mt-3 text-sm text-botanical leading-relaxed">{product.suggestedUse}</p>
            </div>
          )}

          {product.warnings && (
            <div className="mt-8">
              <h3 className="font-serif text-xl text-deep-forest">Warnings</h3>
              <p className="mt-3 text-sm text-botanical leading-relaxed">{product.warnings}</p>
            </div>
          )}

          <div className="mt-10 rounded-xl border border-soft-ivory bg-soft-ivory/50 p-6">
            <p className="text-xs text-botanical leading-relaxed">{disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
