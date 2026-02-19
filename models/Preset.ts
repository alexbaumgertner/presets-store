import { Schema, model, models } from "mongoose";

export interface Preset {
  _id: string;
  title: string;
  description: string;
  processorType: string;
  tags: string[];
  price: number;
  previewAudioUrl: string;
  presetFileUrl: string;
  coverImageUrl: string;
  authorId: string;
  isPublished: boolean;
  createdAt: Date;
}

const presetSchema = new Schema<Preset>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    processorType: { type: String, required: true },
    tags: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    previewAudioUrl: { type: String, required: true },
    presetFileUrl: { type: String, required: true },
    coverImageUrl: { type: String, required: true },
    authorId: { type: String, required: true },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const PresetModel = models.Preset || model<Preset>("Preset", presetSchema);
