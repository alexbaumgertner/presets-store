import { randomUUID } from "crypto";
import { readJSON, writeJSON } from "./storeFile";

export interface Preset {
  _id: string;
  title: string;
  description: string;
  processorType: string;
  tags: string[];
  price: number;
  previewAudioUrl: string;
  presetFileUrl?: string;
  coverImageUrl: string;
  authorId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

const FILE = "presets.json";

export class PresetsController {
  #data = new Map<string, Preset>();
  #loaded = false;

  async load() {
    if (this.#loaded) return;
    const arr = await readJSON<Preset[]>(FILE, []);
    for (const p of arr) {
      this.#data.set(p._id, p);
    }
    this.#loaded = true;
  }

  async save() {
    await writeJSON(FILE, Array.from(this.#data.values()));
  }

  async get(spec?: Record<string, any>) {
    await this.load();
    let items = Array.from(this.#data.values());

    if (spec && Object.keys(spec).length > 0) {
      // separate filter keys and sort keys (numeric values)
      const filter: Record<string, any> = {};
      const sort: Record<string, number> = {};
      for (const [k, v] of Object.entries(spec)) {
        if (typeof v === "number") sort[k] = v;
        else filter[k] = v;
      }

      // apply filter
      if (Object.keys(filter).length > 0) {
        items = items.filter((it) =>
          Object.entries(filter).every(([k, v]) => {
            // allow matching on boolean, string, number
            return (it as any)[k] === v;
          })
        );
      }

      // apply sort - simple single-field or multi-field sort
      const sortKeys = Object.keys(sort);
      if (sortKeys.length > 0) {
        items.sort((a, b) => {
          for (const key of sortKeys) {
            const dir = sort[key];
            const av = (a as any)[key];
            const bv = (b as any)[key];
            if (av === bv) continue;
            if (av === undefined) return 1 * dir;
            if (bv === undefined) return -1 * dir;
            if (av < bv) return -1 * dir;
            return 1 * dir;
          }
          return 0;
        });
      } else {
        // default sort by createdAt desc
        items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      }
    } else {
      items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    // return plain JS objects
    return items.map((it) => ({ ...it }));
  }

  async getById(id: string) {
    await this.load();
    const p = this.#data.get(id);
    return p ? { ...p } : null;
  }

  async create(payload: Partial<Preset>) {
    await this.load();
    const now = new Date().toISOString();
    const item: Preset = {
      _id: payload._id ?? randomUUID(),
      title: String(payload.title ?? ""),
      description: String(payload.description ?? ""),
      processorType: String(payload.processorType ?? ""),
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      price: Number(payload.price ?? 0),
      previewAudioUrl: String(payload.previewAudioUrl ?? ""),
      presetFileUrl: payload.presetFileUrl,
      coverImageUrl: String(payload.coverImageUrl ?? ""),
      authorId: String(payload.authorId ?? ""),
      isPublished: Boolean(payload.isPublished ?? false),
      createdAt: now,
      updatedAt: now
    };
    this.#data.set(item._id, item);
    await this.save();
    return { ...item };
  }

  async update(id: string, patch: Partial<Preset>) {
    await this.load();
    const existing = this.#data.get(id);
    if (!existing) return null;
    const updated: Preset = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString()
    };
    this.#data.set(id, updated);
    await this.save();
    return { ...updated };
  }

  async delete(id: string) {
    await this.load();
    const existed = this.#data.delete(id);
    if (existed) await this.save();
    return existed;
  }

  // match is simple equality match on fields
  async upsert(match: Record<string, any>, payload: Partial<Preset>) {
    await this.load();
    const items = Array.from(this.#data.values());
    const found = items.find((it) =>
      Object.entries(match).every(([k, v]) => (it as any)[k] === v)
    );
    if (found) {
      const updated = await this.update(found._id, { ...found, ...payload });
      return updated;
    } else {
      const created = await this.create({ ...payload, ...match });
      return created;
    }
  }
}

export const presetsController = new PresetsController();

