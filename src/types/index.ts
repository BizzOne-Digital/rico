export type ProductStatus = "draft" | "active" | "out_of_stock" | "coming_soon" | "archived";
export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled" | "refunded";
export type BookingStatus = "new" | "confirmed" | "rescheduled" | "completed" | "cancelled";
export type UploadFolder = "products" | "gallery" | "pages" | "misc";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  format?: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  format?: string;
  sku?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
