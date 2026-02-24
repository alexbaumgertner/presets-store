import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

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

/**
 * Upload a file to Vercel Blob if a token is configured, otherwise fall back to local storage.
 * Returns either the remote blob URL (when using Vercel Blob) or the local full path.
 */
export async function uploadFileToBlob(pathname: string, file: File) {
  const token = process.env.BLOB_PUBLIC_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error("BLOB_PUBLIC_READ_WRITE_TOKEN is not set");
  }

  const access = "public";
  const result = await put(pathname, file, {
    access,
    token,
    addRandomSuffix: true
  });
  return result.url;
}

export async function downloadFileFromBlob(pathname: string) {

  const token = process.env.BLOB_PUBLIC_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_PUBLIC_READ_WRITE_TOKEN is not set");
  }
  const headers: Record<string, string> = {};
  headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(pathname, { headers });
  if (!res.ok) throw new Error(`Failed to fetch blob: ${res.status}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}
