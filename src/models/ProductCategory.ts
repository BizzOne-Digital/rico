import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IProductCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductCategory: Model<IProductCategory> =
  mongoose.models.ProductCategory ||
  mongoose.model<IProductCategory>("ProductCategory", ProductCategorySchema);

export default ProductCategory;
