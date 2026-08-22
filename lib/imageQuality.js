const MIN_DIMENSION = 200;
const DARK_MEAN_THRESHOLD = 28;
const BRIGHT_MEAN_THRESHOLD = 236;

export async function loadBitmap(blob) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(blob);
    } catch {
      // fall through to <img> decoding below
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode-failed"));
    };
    img.src = url;
  });
}

export async function checkImageQuality(blob) {
  let bitmap;
  try {
    bitmap = await loadBitmap(blob);
  } catch {
    return {
      ok: false,
      width: 0,
      height: 0,
      issues: [
        {
          code: "unreadable",
          message:
            "This file could not be read as an image. Please choose a JPG or PNG photo.",
        },
      ],
    };
  }

  const width = bitmap.width;
  const height = bitmap.height;
  const issues = [];

  if (!width || !height || Math.min(width, height) < MIN_DIMENSION) {
    issues.push({
      code: "too-small",
      message: `The image is very small (${width}×${height}). Please take a new photo with more detail.`,
    });
  } else {
    try {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(bitmap, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        total +=
          0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      }
      const meanLuminance = total / (data.length / 4);
      if (meanLuminance < DARK_MEAN_THRESHOLD) {
        issues.push({
          code: "too-dark",
          message:
            "The image appears too dark. Try taking the photo in better lighting.",
        });
      } else if (meanLuminance > BRIGHT_MEAN_THRESHOLD) {
        issues.push({
          code: "too-bright",
          message:
            "The image appears overexposed. Try moving away from direct light and retaking the photo.",
        });
      }
    } catch {
      // Brightness sampling is best-effort; never block on it failing.
    }
  }

  if (typeof bitmap.close === "function") bitmap.close();
  return { ok: issues.length === 0, width, height, issues };
}
