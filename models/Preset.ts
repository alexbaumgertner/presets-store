import mongoose, { Document, Schema } from "mongoose";

export interface IPreset extends Document {
  title: string;
  description: string;
  processorType: string;
  tags: string[];
  price: number;
  previewAudioUrl: string;
  previewVideoUrl?: string;
  presetFileUrl?: string | null;
  coverImageUrl: string;
  authorId: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const PresetSchema = new Schema<IPreset>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    processorType: { type: String, required: true },
    tags: { type: [String], default: [] },
    price: { type: Number, default: 0 },
    previewAudioUrl: { type: String, default: "" },
    previewVideoUrl: { type: String, default: "" },
    presetFileUrl: { type: String, default: null },
    coverImageUrl: { type: String, default: "" },
    authorId: { type: String, default: "admin" },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Preset = (mongoose.models.Preset as mongoose.Model<IPreset>) || mongoose.model<IPreset>("Preset", PresetSchema);

export default Preset;

