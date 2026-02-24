import { randomUUID } from "crypto";
import { readJSON, writeJSON } from "./storeFile";

export interface User {
  _id: string;
  email: string;
  role: "admin" | "user";
  purchasedPresets: string[];
  createdAt: string;
  updatedAt?: string;
}

const FILE = "users.json";

export class UsersController {
  #data = new Map<string, User>();
  #loaded = false;

  async load() {
    if (this.#loaded) return;
    const arr = await readJSON<User[]>(FILE, []);
    for (const u of arr) this.#data.set(u._id, u);
    this.#loaded = true;
  }

  async save() {
    await writeJSON(FILE, Array.from(this.#data.values()));
  }

  async get(spec?: Record<string, any>) {
    await this.load();
    let items = Array.from(this.#data.values());
    if (spec && Object.keys(spec).length > 0) {
      items = items.filter((it) =>
        Object.entries(spec).every(([k, v]) => (it as any)[k] === v)
      );
    }
    return items.map((it) => ({ ...it }));
  }

  async getById(id: string) {
    await this.load();
    const it = this.#data.get(id);
    return it ? { ...it } : null;
  }

  async create(payload: Partial<User>) {
    await this.load();
    const now = new Date().toISOString();
    const item: User = {
      _id: payload._id ?? randomUUID(),
      email: String(payload.email ?? ""),
      role: (payload.role as any) ?? "user",
      purchasedPresets: Array.isArray(payload.purchasedPresets) ? payload.purchasedPresets : [],
      createdAt: now,
      updatedAt: now
    };
    this.#data.set(item._id, item);
    await this.save();
    return { ...item };
  }

  async update(id: string, patch: Partial<User>) {
    await this.load();
    const existing = this.#data.get(id);
    if (!existing) return null;
    const updated: User = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString()
    };
    this.#data.set(id, updated);
    await this.save();
    return { ...updated };
  }

  async upsert(match: Record<string, any>, payload: Partial<User>) {
    await this.load();
    const items = Array.from(this.#data.values());
    const found = items.find((it) =>
      Object.entries(match).every(([k, v]) => (it as any)[k] === v)
    );
    if (found) return this.update(found._id, { ...found, ...payload });
    return this.create({ ...payload, ...match });
  }

  async addToSet(id: string, field: keyof User, values: any[]) {
    await this.load();
    const existing = this.#data.get(id);
    if (!existing) return null;
    const set = new Set((existing as any)[field] ?? []);
    for (const v of values) set.add(v);
    (existing as any)[field] = Array.from(set);
    return this.update(id, existing);
  }
}

export const usersController = new UsersController();

