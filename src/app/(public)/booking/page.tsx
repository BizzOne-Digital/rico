import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Service } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = createMetadata({
  title: "Book an Assessment",
  description: `Schedule a wellness assessment with ${BRAND.name}. Share your goals and preferred time.`,
  path: "/booking",
});

export default async function BookingPage() {
  await connectDB();
  const services = await Service.find({ active: true }).sort({ displayOrder: 1 });
  const serviceData = JSON.parse(JSON.stringify(services));

  return (
    <div className="page-shell">
      <PageHero
        size="compact"
        align="center"
        image={PAGE_IMAGES.wellnessResearch}
        imageAlt="Wellness assessment consultation"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-electric">Wellness Consultation</p>
        <h1 className="mt-3 font-serif text-4xl text-warm-white md:text-5xl">Book an Assessment</h1>
        <p className="mt-4 mx-auto max-w-2xl text-base leading-relaxed text-metallic-silver">
          Request a wellness consultation. Availability will be confirmed by our team — not a medical
          diagnosis.
        </p>
      </PageHero>

      <section className="bg-page mx-auto w-full min-w-0 max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="surface-card rounded-2xl p-6 md:p-8 shadow-lg">
          <BookingForm services={serviceData.length > 0 ? serviceData : [{ title: "Wellness Assessment" }, { title: "Personal Optimization" }]} />
        </div>
      </section>
    </div>
  );
}
