import axios from "axios";
import apiClient from "./apiClient";

interface UploadAuthorizationResponse {
  uploadId: string;
  method: "PUT";
  uploadUrl: string;
  headers: Record<string, string>;
  expiresAt: string;
}

const uploadEndpoint = import.meta.env.VITE_IMAGE_UPLOAD_ENDPOINT || "/uploads";

const getAuthToken = () => {
  const session = window.localStorage.getItem("AKAppSessionID");
  if (!session) return null;
  try {
    return JSON.parse(session).token as string | undefined;
  } catch {
    return null;
  }
};

const uploadImage = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  const token = getAuthToken();
  if (!token) throw new Error("You must be signed in to upload an image.");

  const authorization = await apiClient.post<UploadAuthorizationResponse>(
    uploadEndpoint,
    { fileName: file.name, contentType: file.type, size: file.size },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const { uploadId, uploadUrl, headers, method } = authorization.data;
  if (!uploadId || !uploadUrl || method !== "PUT") {
    throw new Error("The upload service returned an invalid authorization.");
  }

  await axios.put(uploadUrl, file, {
    headers,
    onUploadProgress: (event) => {
      if (event.total) {
        onProgress?.(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  await apiClient.post(
    `${uploadEndpoint}/${uploadId}/complete`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return uploadId;
};

export default { uploadImage };
