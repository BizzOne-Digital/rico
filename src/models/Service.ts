import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
  icon?: string;
  benefits: string[];
  displayOrder: number;
  active: boolean;
  ctaText: string;
  ctaLink: string;
  price?: number;
  duration?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    image: { type: String },
    icon: { type: String },
    benefits: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    ctaText: { type: String, default: "Learn More" },
    ctaLink: { type: String, default: "/booking" },
    price: { type: Number },
    duration: { type: String },
  },
  { timestamps: true }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
