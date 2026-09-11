import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";

export const metadata: Metadata = createMetadata({
  title: "Order Confirmed",
  description: `Your order has been placed successfully at ${BRAND.name}.`,
  path: "/checkout/success",
  noIndex: true,
});

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string; order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  return (
    <div className="page-shell">
      <PageHero size="compact" image={PAGE_IMAGES.mycoDose} imageAlt="Order confirmed">
        <h1 className="font-serif text-3xl md:text-4xl">Thank You!</h1>
      </PageHero>
      <div className="mx-auto max-w-lg px-4 py-10 text-center md:px-6">
        <div className="relative mx-auto mb-8 aspect-[16/10] max-w-sm overflow-hidden rounded-xl">
          <Image src={PAGE_IMAGES.capsules} alt="Your order" fill sizes="400px" className="object-cover" />
        </div>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-electric/20">
          <Check size={32} className="text-electric" />
        </div>
        <p className="text-botanical leading-relaxed">
          Your payment was successful. A confirmation email will be sent shortly.
        </p>
        {params.order && (
          <p className="mt-4 text-sm text-metallic-silver">
            Order: <span className="font-mono text-deep-forest">{params.order}</span>
          </p>
        )}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {params.order && (
            <Link href={`/order/${params.order}`}>
              <Button variant="outline">Track Order</Button>
            </Link>
          )}
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
