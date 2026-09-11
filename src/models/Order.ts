import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { OrderStatus } from "@/types";

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: {
    productId: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    format?: string;
    sku?: string;
  }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: OrderStatus;
  fulfillmentStatus: OrderStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  internalNotes?: string;
  timeline: { status: string; note?: string; date: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
    },
    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, default: "US" },
    },
    items: [
      {
        productId: String,
        name: String,
        slug: String,
        price: Number,
        quantity: Number,
        image: String,
        size: String,
        format: String,
        sku: String,
      },
    ],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    fulfillmentStatus: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    trackingNumber: String,
    trackingCarrier: String,
    internalNotes: String,
    timeline: [{ status: String, note: String, date: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ fulfillmentStatus: 1 });
OrderSchema.index({ "customer.email": 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
