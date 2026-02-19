import { put } from "@vercel/blob";

export async function uploadFileToBlob(pathname: string, file: File) {
  return put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
}
