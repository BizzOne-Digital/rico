import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { getSiteSettings } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { formatPriceDollars } from "@/lib/utils";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = createMetadata({
  title: "Shipping & Returns",
  description: `Shipping and return policy for ${BRAND.name}.`,
  path: "/shipping-returns",
});

export default async function ShippingReturnsPage() {
  let settings;
  try {
    await connectDB();
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  return (
    <div className="page-shell">
      <PageHero size="compact" image={PAGE_IMAGES.premiumProducts} imageAlt="Shipping and returns">
        <h1 className="font-serif text-3xl md:text-4xl">Shipping & Returns</h1>
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">

        <div className="mt-10 space-y-8 text-botanical leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-deep-forest">Shipping</h2>
            {settings?.shippingInfo ? (
              <p className="mt-3 whitespace-pre-line">{settings.shippingInfo}</p>
            ) : (
              <div className="mt-3 space-y-3">
                <p>
                  Standard shipping is available for all orders within the United States.
                  {settings && (
                    <> Flat rate shipping is {formatPriceDollars(settings.shippingFlatRate)}. Orders over {formatPriceDollars(settings.freeShippingThreshold)} qualify for free shipping.</>
                  )}
                </p>
                <p>Orders are typically processed within 1–3 business days. Delivery times vary by location.</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-forest">Returns</h2>
            <p className="mt-3">
              We want you to be satisfied with your purchase. If you receive a damaged or incorrect item,
              please contact us within 14 days of delivery at{" "}
              <a href={`mailto:${BRAND.salesEmail}`} className="text-electric hover:underline">{BRAND.salesEmail}</a>.
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Products must be unopened and in original packaging for returns</li>
              <li>Refunds are processed to the original payment method</li>
              <li>Return shipping costs may apply unless the item was damaged or incorrect</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-forest">Questions</h2>
            <p className="mt-3">
              For shipping or return inquiries, contact{" "}
              <a href={`mailto:${BRAND.salesEmail}`} className="text-electric hover:underline">{BRAND.salesEmail}</a>
              {" "}or call{" "}
              <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`} className="text-electric hover:underline">{BRAND.phone}</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
