import PresetModel, { IPreset } from "@/models/Preset";
import { randomUUID } from "crypto";

export interface Preset {
  _id: string;
  title: string;
  description: string;
  processorType: string;
  tags: string[];
  price: number;
  previewAudioUrl: string;
  presetFileUrl?: string | null;
  coverImageUrl: string;
  authorId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

function docToPreset(doc: Partial<IPreset> & { _id?: any }): Preset {
  return {
    _id: String(doc._id ?? randomUUID()),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    processorType: String(doc.processorType ?? ""),
    tags: Array.isArray(doc.tags) ? (doc.tags as string[]) : [],
    price: Number(doc.price ?? 0),
    previewAudioUrl: String(doc.previewAudioUrl ?? ""),
    presetFileUrl: doc.presetFileUrl ?? undefined,
    coverImageUrl: String(doc.coverImageUrl ?? ""),
    authorId: String(doc.authorId ?? ""),
    isPublished: Boolean(doc.isPublished ?? false),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined
  };
}

export class PresetsController {
  // Get list with optional filtering and sort spec (numeric values are treated as sort)
  async get(spec?: Record<string, any>) {
    const filter: Record<string, any> = {};
    const sort: Record<string, number> = {};

    if (spec && Object.keys(spec).length > 0) {
      for (const [k, v] of Object.entries(spec)) {
        if (typeof v === "number") sort[k] = v;
        else filter[k] = v;
      }
    }

    let query = PresetModel.find(filter).lean();
    if (Object.keys(sort).length > 0) {
      query = query.sort(sort as any);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const docs = await query.exec();
    return docs.map((d) => docToPreset(d));
  }

  async getById(id: string) {
    const doc = await PresetModel.findById(id).lean().exec();
    return doc ? docToPreset(doc) : null;
  }

  async create(payload: Partial<Preset>) {
    const toCreate: Partial<IPreset> = {
      title: String(payload.title ?? ""),
      description: String(payload.description ?? ""),
      processorType: String(payload.processorType ?? ""),
      tags: Array.isArray(payload.tags) ? (payload.tags as string[]) : [],
      price: Number(payload.price ?? 0),
      previewAudioUrl: String(payload.previewAudioUrl ?? ""),
      presetFileUrl: payload.presetFileUrl ?? null,
      coverImageUrl: String(payload.coverImageUrl ?? ""),
      authorId: String(payload.authorId ?? ""),
      isPublished: Boolean(payload.isPublished ?? false)
    };

    const created = await PresetModel.create(toCreate);
    return docToPreset(created.toObject());
  }

  async update(id: string, patch: Partial<Preset>) {
    const updated = await PresetModel.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true
    })
      .lean()
      .exec();
    return updated ? docToPreset(updated) : null;
  }

  async delete(id: string) {
    const res = await PresetModel.findByIdAndDelete(id).exec();
    return !!res;
  }

  async upsert(match: Record<string, any>, payload: Partial<Preset>) {
    const updated = await PresetModel.findOneAndUpdate(match, { ...payload, ...match }, { upsert: true, new: true, setDefaultsOnInsert: true })
      .lean()
      .exec();
    return updated ? docToPreset(updated) : null;
  }
}

export const presetsController = new PresetsController();

