import fs from "fs/promises";
import path from "path";

const dataDir = path.resolve(process.cwd(), "data");

export async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readJSON<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const full = path.join(dataDir, filename);
  try {
    const raw = await fs.readFile(full, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    return defaultValue;
  }
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const full = path.join(dataDir, filename);
  const tmp = full + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, full);
}

