export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Product } from "@/models";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/shop",
  "/pricing",
  "/booking",
  "/faq",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/shipping-returns",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    await connectDB();
    const products = await Product.find({ status: { $in: ["active", "out_of_stock"] } }).select("slug updatedAt");
    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticEntries, ...productEntries];
  } catch {
    return staticEntries;
  }
}
