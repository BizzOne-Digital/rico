import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { createMetadata } from "@/lib/metadata";
import { Mail, Phone } from "@/components/icons";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: `Get in touch with ${BRAND.name}. Email, phone and contact form.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="page-shell">
      <PageHero image={PAGE_IMAGES.premiumProducts} imageAlt="Contact Fungtional Wellness">
        <h1 className="font-serif text-4xl md:text-5xl">Contact Us</h1>
        <p className="mt-4 text-metallic-silver">We&apos;d love to hear from you.</p>
      </PageHero>

      <section className="bg-page mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid w-full min-w-0 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl text-warm-white">Get in Touch</h2>
            <ul className="mt-8 space-y-6">
              <li className="flex items-start gap-4">
                <Mail size={20} className="mt-1 text-electric shrink-0" />
                <div>
                  <p className="font-medium text-warm-white">General Inquiries</p>
                  <a href={`mailto:${BRAND.email}`} className="text-sm text-botanical hover:text-electric">
                    {BRAND.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={20} className="mt-1 text-electric shrink-0" />
                <div>
                  <p className="font-medium text-warm-white">Product Sales</p>
                  <a href={`mailto:${BRAND.salesEmail}`} className="text-sm text-botanical hover:text-electric">
                    {BRAND.salesEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={20} className="mt-1 text-electric shrink-0" />
                <div>
                  <p className="font-medium text-warm-white">Phone</p>
                  <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`} className="text-sm text-botanical hover:text-electric">
                    {BRAND.phone}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-8 shadow-lg">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
