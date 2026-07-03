// features/uploads/api/uploads.api.ts
import { env } from "@/config/env";

export type UploadResponse = {
  url: string;
  path: string;
  filename: string;
};

export async function uploadImage(file: File, directory: string) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("directory", directory);

  const response = await fetch(`${env.apiUrl}/uploads`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json() as Promise<UploadResponse>;
}
