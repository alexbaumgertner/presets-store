import { randomUUID } from "crypto";
import { readJSON, writeJSON } from "./storeFile";

export interface DownloadToken {
  _id: string;
  presetId: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

const FILE = "downloadTokens.json";

export class DownloadTokensController {
  #data = new Map<string, DownloadToken>();
  #loaded = false;

  async load() {
    if (this.#loaded) return;
    const arr = await readJSON<DownloadToken[]>(FILE, []);
    for (const t of arr) this.#data.set(t._id, t);
    this.#loaded = true;
  }

  async save() {
    await writeJSON(FILE, Array.from(this.#data.values()));
  }

  async create(payload: Partial<DownloadToken>) {
    await this.load();
    const now = new Date().toISOString();
    const item: DownloadToken = {
      _id: payload._id ?? randomUUID(),
      presetId: String(payload.presetId ?? ""),
      userId: String(payload.userId ?? ""),
      expiresAt: String(payload.expiresAt ?? ""),
      createdAt: now
    };
    this.#data.set(item._id, item);
    await this.save();
    return { ...item };
  }

  async deleteMany(filter: Record<string, any>) {
    await this.load();
    const items = Array.from(this.#data.values());
    const toDelete = items.filter((it) =>
      Object.entries(filter).every(([k, v]) => (it as any)[k] === v)
    );
    for (const d of toDelete) this.#data.delete(d._id);
    if (toDelete.length > 0) await this.save();
    return toDelete.length;
  }
}

export const downloadTokensController = new DownloadTokensController();

