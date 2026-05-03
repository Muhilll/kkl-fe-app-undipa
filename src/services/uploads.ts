import { api } from "./api";

export type UploadTarget = "absensi" | "dissemination_details";

interface UploadSignatureRequest {
  target: UploadTarget;
}

interface UploadSignatureData {
  target: UploadTarget;
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
  uploadUrl: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
}

export interface UploadedAsset {
  secureUrl: string;
  publicId: string;
}

export const uploadsAPI = {
  createSignature: (data: UploadSignatureRequest) =>
    api.post<UploadSignatureData>("/uploads/signature", data),
};

export const uploadImageWithSignature = async (
  target: UploadTarget,
  file: File,
): Promise<UploadedAsset> => {
  const signatureResult = await uploadsAPI.createSignature({ target });

  if (!signatureResult.success || !signatureResult.data) {
    throw new Error(
      signatureResult.error || "Failed to create upload signature",
    );
  }

  const signed = signatureResult.data;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signed.apiKey);
  formData.append("timestamp", String(signed.timestamp));
  formData.append("signature", signed.signature);
  formData.append("folder", signed.folder);

  const uploadResponse = await fetch(signed.uploadUrl, {
    method: "POST",
    body: formData,
  });

  const uploadJson = (await uploadResponse.json()) as CloudinaryUploadResponse;

  if (!uploadResponse.ok || !uploadJson.secure_url || !uploadJson.public_id) {
    throw new Error(
      uploadJson.error?.message || "Failed to upload image to Cloudinary",
    );
  }

  return {
    secureUrl: uploadJson.secure_url,
    publicId: uploadJson.public_id,
  };
};
