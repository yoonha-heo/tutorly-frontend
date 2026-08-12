// features/uploads/api/uploads.api.ts
import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";

export type UploadResponse = {
  url: string;
  path: string;
  filename: string;
};

export async function uploadImage(file: File, directory: string) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("directory", directory);

  return apiFetch<UploadResponse>(`${env.apiUrl}/uploads`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
}
