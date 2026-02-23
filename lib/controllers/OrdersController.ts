import { randomUUID } from "crypto";
import { readJSON, writeJSON } from "./storeFile";

export interface Order {
  _id: string;
  userId: string;
  presets: string[];
  totalPrice: number;
  stripeSessionId: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

const FILE = "orders.json";

export class OrdersController {
  #data = new Map<string, Order>();
  #loaded = false;

  async load() {
    if (this.#loaded) return;
    const arr = await readJSON<Order[]>(FILE, []);
    for (const o of arr) this.#data.set(o._id, o);
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

  async create(payload: Partial<Order>) {
    await this.load();
    const now = new Date().toISOString();
    const item: Order = {
      _id: payload._id ?? randomUUID(),
      userId: String(payload.userId ?? ""),
      presets: Array.isArray(payload.presets) ? payload.presets : [],
      totalPrice: Number(payload.totalPrice ?? 0),
      stripeSessionId: String(payload.stripeSessionId ?? ""),
      status: String(payload.status ?? "pending"),
      createdAt: now,
      updatedAt: now
    };
    this.#data.set(item._id, item);
    await this.save();
    return { ...item };
  }

  async update(id: string, patch: Partial<Order>) {
    await this.load();
    const existing = this.#data.get(id);
    if (!existing) return null;
    const updated: Order = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString()
    };
    this.#data.set(id, updated);
    await this.save();
    return { ...updated };
  }

  async upsert(match: Record<string, any>, payload: Partial<Order>) {
    await this.load();
    const items = Array.from(this.#data.values());
    const found = items.find((it) =>
      Object.entries(match).every(([k, v]) => (it as any)[k] === v)
    );
    if (found) return this.update(found._id, { ...found, ...payload });
    return this.create({ ...payload, ...match });
  }
}

export const ordersController = new OrdersController();

