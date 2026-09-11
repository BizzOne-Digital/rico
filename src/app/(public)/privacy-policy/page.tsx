import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${BRAND.name}.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="page-shell">
      <PageHero size="compact" image={PAGE_IMAGES.mushroomsMacro} imageAlt="Privacy">
        <h1 className="font-serif text-3xl md:text-4xl">Privacy Policy</h1>
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 prose-policy">
        <p className="text-sm text-metallic-silver">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-botanical leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-deep-forest">Introduction</h2>
            <p className="mt-3">
              {BRAND.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This policy describes how we collect,
              use, and protect your personal information when you visit our website or purchase our products.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-deep-forest">Information We Collect</h2>
            <p className="mt-3">
              We collect information you provide directly, such as name, email, phone, shipping address, and order details
              when you make a purchase, book a consultation, or contact us.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-deep-forest">How We Use Your Information</h2>
            <p className="mt-3">
              We use your information to process orders, respond to inquiries, send transactional emails, and improve our services.
              We do not sell your personal information to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-deep-forest">Contact</h2>
            <p className="mt-3">
              For privacy-related questions, contact us at {BRAND.email}.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
