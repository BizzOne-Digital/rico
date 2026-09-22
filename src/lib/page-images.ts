import { CATEGORY_IMAGE_PATHS } from "./product-images";

export const PAGE_IMAGES = {
  hero: "/images/hero-bg.jpg",
  capsules: CATEGORY_IMAGE_PATHS["mushroom-capsules"],
  oralDrops: CATEGORY_IMAGE_PATHS["mushroom-oral-drops"],
  powder: CATEGORY_IMAGE_PATHS["mushroom-powders"],
  mycoDose: CATEGORY_IMAGE_PATHS.beverages,
  mushroomsMacro: CATEGORY_IMAGE_PATHS["product-development"],
  wellnessResearch: "/images/wellness-research.jpg",
  productsHero: "/images/products/collection-hero.jpg",
  mushroomExtracts: "/images/mushroom-extracts.jpg",
  premiumProducts: "/images/products/collection-hero.jpg",
} as const;

export const CATEGORY_IMAGES: Record<string, string> = CATEGORY_IMAGE_PATHS;
