import { Schema, model, models, Types } from "mongoose";

export interface DownloadToken {
  _id: string;
  presetId: Types.ObjectId;
  userId: Types.ObjectId;
  expiresAt: Date;
}

const downloadTokenSchema = new Schema<DownloadToken>(
  {
    presetId: { type: Schema.Types.ObjectId, ref: "Preset", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

downloadTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const DownloadTokenModel = models.DownloadToken || model<DownloadToken>("DownloadToken", downloadTokenSchema);
