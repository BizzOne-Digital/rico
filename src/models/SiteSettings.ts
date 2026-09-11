import mongoose, { Schema, type Document, type Model } from "mongoose";
import { BRAND, DEFAULT_ANNOUNCEMENT, DEFAULT_DISCLAIMER } from "@/lib/constants";

export interface ISiteSettings extends Document {
  businessName: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  salesEmail: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  announcement: string;
  shippingInfo: string;
  taxRate: number;
  currency: string;
  shippingFlatRate: number;
  freeShippingThreshold: number;
  featuredProductIds: string[];
  sectionVisibility: Record<string, boolean>;
  medicalDisclaimer: string;
  seoDefaults: { title: string; description: string };
  footerContent: string;
  testimonials: {
    name: string;
    role?: string;
    content: string;
    rating: number;
    active: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: BRAND.name },
    logo: { type: String, default: "/images/logo.png" },
    favicon: { type: String, default: "/images/logo.png" },
    contactEmail: { type: String, default: BRAND.email },
    salesEmail: { type: String, default: BRAND.salesEmail },
    phone: { type: String, default: BRAND.phone },
    address: { type: String, default: "" },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
      tiktok: String,
    },
    announcement: { type: String, default: DEFAULT_ANNOUNCEMENT },
    shippingInfo: { type: String, default: "" },
    taxRate: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    shippingFlatRate: { type: Number, default: 9.99 },
    freeShippingThreshold: { type: Number, default: 100 },
    featuredProductIds: [{ type: String }],
    sectionVisibility: { type: Schema.Types.Mixed, default: {} },
    medicalDisclaimer: { type: String, default: DEFAULT_DISCLAIMER },
    seoDefaults: {
      title: { type: String, default: `${BRAND.name} | ${BRAND.headline}` },
      description: {
        type: String,
        default:
          "Optimized living through functional mushrooms, intentional wellness products, personalized assessment and everyday performance support.",
      },
    },
    footerContent: {
      type: String,
      default: "Fungtional Labs Inc. created Fungtional Wellness to make the benefits of functional mushrooms accessible.",
    },
    testimonials: [
      {
        name: String,
        role: String,
        content: String,
        rating: { type: Number, default: 5 },
        active: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;

export async function getSiteSettings(): Promise<ISiteSettings> {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}
