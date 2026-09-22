/** Client product photography — paths under /public */
export type ProductImageEntry = {
  featured: string;
  gallery?: string[];
  /** Crop focal point when featured is the shared Myco Mist lineup */
  objectPosition?: string;
};

export const PRODUCT_IMAGES: Record<string, ProductImageEntry> = {
  "cordyceps-capsules": {
    featured: "/images/products/cordyceps-capsules.jpg",
    gallery: ["/images/products/cordyceps-capsules-marketing.jpg"],
  },
  "lions-mane-capsules": {
    featured: "/images/products/lions-mane-capsules.jpg",
    gallery: ["/images/products/lions-mane-capsules-marketing.jpg"],
  },
  "turkey-tail-capsules": {
    featured: "/images/products/turkey-tail-capsules.jpg",
    gallery: ["/images/products/turkey-tail-capsules-marketing.jpg"],
  },
  "my-gut-capsules": {
    featured: "/images/products/my-gut-capsules.jpg",
    gallery: ["/images/products/my-gut-capsules-marketing.jpg"],
  },
  "my-focus-oral-drops": {
    featured: "/images/products/my-focus-oral-drops.jpg",
    gallery: ["/images/products/my-focus-oral-drops-marketing.jpg"],
  },
  "my-fuel-oral-drops": {
    featured: "/images/products/my-fuel-oral-drops.jpg",
    gallery: ["/images/products/my-fuel-oral-drops-marketing.jpg"],
  },
  "my-vitality-oral-drops": {
    featured: "/images/products/my-vitality-oral-drops.jpg",
    gallery: ["/images/products/my-vitality-oral-drops-marketing.jpg"],
  },
  "cordyceps-mushroom-powder": {
    featured: "/images/products/cordyceps-mushroom-powder.jpg",
    gallery: ["/images/products/cordyceps-mushroom-powder-marketing.jpg"],
  },
  "lions-mane-mushroom-powder": {
    featured: "/images/products/lions-mane-mushroom-powder.jpg",
    gallery: ["/images/products/lions-mane-mushroom-powder-marketing.jpg"],
  },
  "turkey-tail-mushroom-powder": {
    featured: "/images/products/turkey-tail-mushroom-powder.jpg",
    gallery: ["/images/products/turkey-tail-mushroom-powder-marketing.jpg"],
  },
  "function-mushroom-powder": {
    featured: "/images/products/function-mushroom-powder.jpg",
    gallery: ["/images/products/function-mushroom-powder-marketing.jpg"],
  },
  "myco-dose": {
    featured: "/images/products/myco-dose.jpg",
  },
  "myco-mist-energy": {
    featured: "/images/products/myco-mist-energy.jpg",
    gallery: ["/images/products/myco-mist.jpg"],
  },
  "myco-mist-focus": {
    featured: "/images/products/myco-mist-focus.jpg",
    gallery: ["/images/products/myco-mist.jpg"],
  },
  "myco-mist-calm": {
    featured: "/images/products/myco-mist-calm.jpg",
    gallery: ["/images/products/myco-mist.jpg"],
  },
  "myco-mist-immune": {
    featured: "/images/products/myco-mist.jpg",
    objectPosition: "68% 42%",
    gallery: ["/images/products/myco-mist.jpg"],
  },
  "myco-mist-sleep": {
    featured: "/images/products/myco-mist.jpg",
    objectPosition: "90% 48%",
    gallery: ["/images/products/myco-mist.jpg"],
  },
};

export const CATEGORY_IMAGE_PATHS: Record<string, string> = {
  "mushroom-capsules": "/images/categories/mushroom-capsules.jpg",
  "mushroom-oral-drops": "/images/categories/mushroom-oral-drops.jpg",
  "mushroom-powders": "/images/categories/mushroom-powders.jpg",
  beverages: "/images/categories/beverages.jpg",
  "myco-mist": "/images/categories/myco-mist.jpg",
  "product-development": "/images/categories/product-development.jpg",
};

export function productImageUrls(slug: string, name: string, categoryFallback: string) {
  const entry = PRODUCT_IMAGES[slug];
  const featured = entry?.featured ?? categoryFallback;
  const urls = [featured, ...(entry?.gallery ?? [])];
  const images = urls.map((url, order) => ({ url, alt: name, order }));
  return { featuredImage: featured, images };
}

export function productImageObjectPosition(slug: string): string | undefined {
  return PRODUCT_IMAGES[slug]?.objectPosition;
}
