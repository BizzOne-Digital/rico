import { formatPriceDollars } from "@/lib/utils";
import type { ProductStatus } from "@/types";

/** Canonical catalogue prices (USD) */
export const CATALOGUE_PRICES = {
  capsules: 60,
  oralDrops: 65,
  powders: 60,
  mycoDose: 54,
  mycoMist: 30,
} as const;

export const CATALOGUE_PRICE_LABELS = {
  capsules: "$60 each",
  oralDrops: "$65 each",
  powders: "$60 each",
  mycoDose: "$54",
  mycoMist: "$30 each",
} as const;

/** Per-product slug → price (USD). Coming-soon items have no price. */
export const PRODUCT_PRICES: Record<string, number> = {
  "cordyceps-capsules": CATALOGUE_PRICES.capsules,
  "lions-mane-capsules": CATALOGUE_PRICES.capsules,
  "turkey-tail-capsules": CATALOGUE_PRICES.capsules,
  "my-gut-capsules": CATALOGUE_PRICES.capsules,
  "my-focus-oral-drops": CATALOGUE_PRICES.oralDrops,
  "my-fuel-oral-drops": CATALOGUE_PRICES.oralDrops,
  "my-vitality-oral-drops": CATALOGUE_PRICES.oralDrops,
  "cordyceps-mushroom-powder": CATALOGUE_PRICES.powders,
  "lions-mane-mushroom-powder": CATALOGUE_PRICES.powders,
  "turkey-tail-mushroom-powder": CATALOGUE_PRICES.powders,
  "function-mushroom-powder": CATALOGUE_PRICES.powders,
  "myco-dose": CATALOGUE_PRICES.mycoDose,
  "myco-mist-energy": CATALOGUE_PRICES.mycoMist,
  "myco-mist-focus": CATALOGUE_PRICES.mycoMist,
  "myco-mist-calm": CATALOGUE_PRICES.mycoMist,
  "myco-mist-immune": CATALOGUE_PRICES.mycoMist,
  "myco-mist-sleep": CATALOGUE_PRICES.mycoMist,
};

export function formatProductPrice(price: number, status?: ProductStatus | string): string {
  if (status === "coming_soon") return "Coming Soon";
  if (price <= 0) return "Coming Soon";
  return formatPriceDollars(price);
}

export function resolveProductPrice(slug: string, fallback = 0): number {
  return PRODUCT_PRICES[slug] ?? fallback;
}
