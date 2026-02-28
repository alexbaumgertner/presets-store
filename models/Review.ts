import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  presetId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  score: number;
  comment?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    presetId: { type: Schema.Types.ObjectId, ref: "Preset", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false }
  },
  { timestamps: true }
);

ReviewSchema.index({ presetId: 1, userId: 1 }, { unique: true });

const Review =
  (mongoose.models.Review as mongoose.Model<IReview>) ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
