import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { FAQ } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";
import { FAQAccordion } from "./FAQAccordion";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description: `Frequently asked questions about ${BRAND.name} products, orders, bookings and wellness support.`,
  path: "/faq",
});

export default async function FAQPage() {
  await connectDB();
  const faqs = await FAQ.find({ active: true }).sort({ displayOrder: 1 });
  const data = JSON.parse(JSON.stringify(faqs));

  return (
    <div className="page-shell">
      <PageHero image={PAGE_IMAGES.mushroomsMacro} imageAlt="Functional mushrooms">
        <h1 className="font-serif text-4xl md:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-metallic-silver">Answers to common questions about our products and services.</p>
      </PageHero>

      <section className="mx-auto w-full min-w-0 max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {data.length === 0 ? (
          <p className="text-center text-botanical">No FAQs available yet. Check back soon.</p>
        ) : (
          <FAQAccordion faqs={data} />
        )}
      </section>
    </div>
  );
}
