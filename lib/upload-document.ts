"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "govhub-documents";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_DOC_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 64) || "document";
}

export async function compressImageFileIfNeeded(
  file: File,
  maxBytes = 500 * 1024,
  maxDimension = 1280
): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= maxBytes) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height, 1));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, "");
          resolve(new File([blob], `${baseName}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.78
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}

export async function uploadPrivateDocument(
  file: File,
  folder: "ktp" | "bansos" | "avatar",
  options?: { imagesOnly?: boolean }
): Promise<{ success: boolean; path?: string; signedUrl?: string; error?: string }> {
  const mime = file.type.toLowerCase();
  if (options?.imagesOnly) {
    if (!/^image\/(jpeg|jpg|png|webp)$/.test(mime)) {
      return { success: false, error: "Format foto harus JPG, PNG, atau WEBP." };
    }
  } else if (!ALLOWED_DOC_TYPES.has(mime)) {
    return { success: false, error: "Format berkas harus PDF, JPG, PNG, atau WEBP." };
  }

  const processed = mime.startsWith("image/") ? await compressImageFileIfNeeded(file) : file;
  if (processed.size > MAX_UPLOAD_BYTES) {
    return { success: false, error: "Ukuran berkas melebihi batas maksimal 5MB." };
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { success: false, error: "Sesi login tidak ditemukan. Silakan masuk ulang." };
  }

  const objectPath = `${user.id}/${folder}/${Date.now()}-${sanitizeFileName(processed.name)}`;
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(objectPath, processed, {
      contentType: processed.type,
      upsert: false,
    });

  if (uploadErr) {
    return { success: false, error: "Gagal mengunggah dokumen ke penyimpanan aman." };
  }

  const { data: signedData } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(objectPath, 3600);

  return {
    success: true,
    path: objectPath,
    signedUrl: signedData?.signedUrl,
  };
}

export async function resolveSignedDocumentUrl(pathOrUrl: string | null | undefined): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^(https:\/\/|data:image\/)/i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.replace(/^govhub-documents\//, "");
  if (!/^[0-9a-f-]{36}\//i.test(cleanPath)) return null;

  const supabase = createClient();
  const { data } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(cleanPath, 3600);
  return data?.signedUrl || null;
}
