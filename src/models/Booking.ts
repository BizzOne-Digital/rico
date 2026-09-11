import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { BookingStatus } from "@/types";

export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  service: string;
  serviceId?: mongoose.Types.ObjectId;
  preferredDate: Date;
  preferredTime: string;
  timezone: string;
  wellnessGoals: string;
  message?: string;
  consent: boolean;
  status: BookingStatus;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    timezone: { type: String, required: true },
    wellnessGoals: { type: String, default: "" },
    message: { type: String },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["new", "confirmed", "rescheduled", "completed", "cancelled"],
      default: "new",
    },
    internalNotes: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ status: 1 });
BookingSchema.index({ preferredDate: 1 });
BookingSchema.index({ email: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
