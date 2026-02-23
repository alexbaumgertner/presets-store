import { put } from "@vercel/blob";

const useStubBlob =
  process.env.NEXT_PUBLIC_USE_STUBS === "1" ||
  process.env.NEXT_PUBLIC_USE_STUBS === "true" ||
  !process.env.BLOB_READ_WRITE_TOKEN;

export async function uploadFileToBlob(pathname: string, file: File) {
  if (!useStubBlob) {
    return put(pathname, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
  }

  const baseUrl = process.env.STUBS_BASE_URL || "http://localhost:4010";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("pathname", pathname);

  const response = await fetch(`${baseUrl}/blob/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Blob stub upload failed");
  }

  const data = (await response.json()) as { url: string };
  return data;
}
