import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.literal(true, { message: "Consent is required" }),
  honeypot: z.string().max(0).optional(),
});

export const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone is required"),
  service: z.string().min(1, "Service is required"),
  preferredDate: z.string().min(1, "Date is required"),
  preferredTime: z.string().min(1, "Time is required"),
  timezone: z.string().min(1, "Timezone is required"),
  wellnessGoals: z.string().optional(),
  message: z.string().optional(),
  consent: z.literal(true, { message: "Consent is required" }),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().optional(),
  npn: z.string().optional(),
  category: z.string().min(1),
  status: z.enum(["draft", "active", "out_of_stock", "coming_soon", "archived"]),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  size: z.string().optional(),
  format: z.string().optional(),
  ingredients: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  suggestedUse: z.string().optional(),
  warnings: z.string().optional(),
  images: z.array(z.object({ url: z.string(), alt: z.string(), order: z.number() })).optional(),
  featuredImage: z.string().optional(),
  stock: z.number().min(0).optional(),
  trackInventory: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
  displayOrder: z.number().optional(),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1).max(99),
    })
  ).min(1),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  shipping: z.object({
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zip: z.string().min(3),
    country: z.string().default("US"),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
