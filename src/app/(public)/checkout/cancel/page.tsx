import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = createMetadata({
  title: "Checkout Cancelled",
  description: `Your checkout was cancelled at ${BRAND.name}.`,
  path: "/checkout/cancel",
  noIndex: true,
});

interface CancelPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutCancelPage({ searchParams }: CancelPageProps) {
  const params = await searchParams;

  return (
    <div className="page-shell">
      <PageHero size="compact" image={PAGE_IMAGES.oralDrops} imageAlt="Checkout cancelled">
        <h1 className="font-serif text-3xl md:text-4xl">Checkout Cancelled</h1>
      </PageHero>
      <div className="mx-auto max-w-lg px-4 py-10 text-center md:px-6">
        <p className="text-botanical leading-relaxed">
          Your payment was not completed. Your cart items are still available.
        </p>
        {params.order && (
          <p className="mt-4 text-sm text-metallic-silver">
            Reference: <span className="font-mono">{params.order}</span>
          </p>
        )}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/cart">
            <Button>Return to Cart</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
