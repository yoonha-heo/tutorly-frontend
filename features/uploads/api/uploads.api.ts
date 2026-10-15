import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";
import { ApiError } from "@/utils/apiError";

export type PresignedUploadResponse = {
  uploadUrl: string;
  url: string;
  path: string;
  filename: string;
  contentType: string;
  expiresAt: string;
};

export type UploadResponse = {
  url: string;
  path: string;
  filename: string;
};

export async function uploadImage(
  file: File,
  directory: string,
): Promise<UploadResponse> {
  const presigned = await apiFetch<PresignedUploadResponse>(
    `${env.apiUrl}/uploads/presigned-url`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        directory,
        contentType: file.type,
      }),
    },
  );

  const storageResponse = await fetch(presigned.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": presigned.contentType,
    },
    body: file,
  });

  if (!storageResponse.ok) {
    throw new ApiError({
      statusCode: storageResponse.status,
      code: "STORAGE_UPLOAD_FAILED",
      message: "Failed to upload the image. Please try again.",
    });
  }

  return {
    url: presigned.url,
    path: presigned.path,
    filename: presigned.filename,
  };
}
