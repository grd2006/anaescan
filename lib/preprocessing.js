import * as tf from "@tensorflow/tfjs";
import { loadBitmap } from "./imageQuality";

const MODEL_HEIGHT = 224;
const MODEL_WIDTH = 224;
const MODEL_CHANNELS = 3;

// The Keras model has no embedded preprocessing layer. Keep this isolated
// until the training pipeline confirms whether pixel scaling is required.
export async function imageToModelInput(image) {
  const bitmap = await loadBitmap(image);

  try {
    const input = tf.tidy(() => {
      const pixels = tf.browser.fromPixels(bitmap, MODEL_CHANNELS);
      const resized = tf.image.resizeBilinear(pixels, [MODEL_HEIGHT, MODEL_WIDTH]);
      return resized.toFloat().expandDims(0);
    });

    const expectedShape = [1, MODEL_HEIGHT, MODEL_WIDTH, MODEL_CHANNELS];
    if (input.shape.join(",") !== expectedShape.join(",")) {
      input.dispose();
      throw new Error("The image could not be converted to the model input shape.");
    }

    return input;
  } finally {
    if (typeof bitmap.close === "function") bitmap.close();
  }
}