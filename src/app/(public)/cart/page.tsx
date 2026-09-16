import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";
import { CartContent } from "./CartContent";

export const metadata: Metadata = createMetadata({
  title: "Cart",
  description: `Review your cart and checkout at ${BRAND.name}.`,
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="page-shell">
      <PageHero size="compact" image={PAGE_IMAGES.productsHero} imageAlt="Your cart">
        <h1 className="font-serif text-3xl md:text-4xl">Your Cart</h1>
        <p className="mt-3 text-metallic-silver">Review your selections and proceed to checkout.</p>
      </PageHero>

      <section className="bg-page mx-auto max-w-7xl px-4 py-10 md:px-6">
        <CartContent />
      </section>
    </div>
  );
}
