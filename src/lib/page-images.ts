export const PAGE_IMAGES = {
  hero: "/images/hero-bg.jpg",
  capsules: "/images/capsules-jars.jpg",
  oralDrops: "/images/oral-drops.jpg",
  powder: "/images/mushroom-powder.jpg",
  mycoMist: "/images/myco-mist.jpg",
  mycoDose: "/images/myco-dose.jpg",
  mushroomsMacro: "/images/mushrooms-macro.jpg",
  wellnessResearch: "/images/wellness-research.jpg",
  productsHero: "/images/products-hero.jpg",
  mushroomExtracts: "/images/mushroom-extracts.jpg",
  premiumProducts: "/images/premium-products.jpg",
} as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  "mushroom-capsules": PAGE_IMAGES.capsules,
  "mushroom-oral-drops": PAGE_IMAGES.oralDrops,
  "mushroom-powders": PAGE_IMAGES.powder,
  beverages: PAGE_IMAGES.mycoDose,
  "myco-mist": PAGE_IMAGES.mycoMist,
  "product-development": PAGE_IMAGES.mushroomsMacro,
};
