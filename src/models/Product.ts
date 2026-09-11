import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { ProductStatus } from "@/types";

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku?: string;
  npn?: string;
  category: mongoose.Types.ObjectId;
  status: ProductStatus;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  size?: string;
  format?: string;
  ingredients?: string;
  benefits: string[];
  suggestedUse?: string;
  warnings?: string;
  images: { url: string; alt: string; order: number }[];
  featuredImage?: string;
  stock: number;
  trackInventory: boolean;
  featured: boolean;
  tags: string[];
  seo: { title?: string; description?: string };
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, trim: true },
    npn: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "ProductCategory", required: true },
    status: {
      type: String,
      enum: ["draft", "active", "out_of_stock", "coming_soon", "archived"],
      default: "draft",
    },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    size: { type: String },
    format: { type: String },
    ingredients: { type: String },
    benefits: [{ type: String }],
    suggestedUse: { type: String },
    warnings: { type: String },
    images: [{ url: String, alt: String, order: Number }],
    featuredImage: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    trackInventory: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    seo: { title: String, description: String },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ status: 1, featured: 1 });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ benefits: 1 });
ProductSchema.index({ price: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
