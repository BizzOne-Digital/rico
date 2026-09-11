import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description: `Terms of service for ${BRAND.name}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="page-shell">
      <PageHero size="compact" image={PAGE_IMAGES.productsHero} imageAlt="Terms of service">
        <h1 className="font-serif text-3xl md:text-4xl">Terms of Service</h1>
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <p className="mt-4 text-sm text-metallic-silver">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-botanical leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-deep-forest">Agreement</h2>
            <p className="mt-3">
              By accessing or using the {BRAND.name} website, you agree to these Terms of Service. If you do not
              agree, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-forest">Products & Services</h2>
            <p className="mt-3">
              Our products are dietary supplements and wellness products. They are not intended to diagnose,
              treat, cure, or prevent any disease. Product information is for general informational purposes
              and is not a substitute for professional medical advice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-forest">Orders & Payment</h2>
            <p className="mt-3">
              All orders are subject to acceptance and availability. Prices are listed in USD and may change
              without notice. Payment is processed securely through Stripe. We reserve the right to refuse or
              cancel orders at our discretion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-forest">Bookings</h2>
            <p className="mt-3">
              Wellness assessments and consultations are not medical diagnoses. Booking requests are subject to
              confirmation. We do not guarantee availability until confirmed by our team.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-forest">Limitation of Liability</h2>
            <p className="mt-3">
              {BRAND.name} and Fungtional Labs Inc. shall not be liable for any indirect, incidental, or
              consequential damages arising from use of our website or products.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-forest">Contact</h2>
            <p className="mt-3">
              Questions about these terms? Contact{" "}
              <a href={`mailto:${BRAND.email}`} className="text-electric hover:underline">{BRAND.email}</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
