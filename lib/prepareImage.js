import { loadBitmap } from "./imageQuality";

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.85;

export async function prepareImageForAnalysis(blob) {
  const bitmap = await loadBitmap(blob);
  const width = bitmap.width;
  const height = bitmap.height;

  if (!width || !height) {
    if (typeof bitmap.close === "function") bitmap.close();
    throw new Error("The image could not be prepared. Please try another photo.");
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));

  if (scale === 1 && blob.type === "image/jpeg") {
    if (typeof bitmap.close === "function") bitmap.close();
    return { blob, width, height };
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const preparedBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("encode-failed"))),
        "image/jpeg",
        JPEG_QUALITY
      );
    });

    return { blob: preparedBlob || blob, width, height };
  } catch {
    // Preparation is best-effort; the original is still usable.
    return { blob, width, height };
  } finally {
    if (typeof bitmap.close === "function") bitmap.close();
  }
}
