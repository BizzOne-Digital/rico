import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IActivityLog extends Document {
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  userId?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    details: { type: String },
    userId: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;

export async function logActivity(
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
  userId?: string
) {
  try {
    await ActivityLog.create({ action, entity, entityId, details, userId });
  } catch {
    // non-critical
  }
}
