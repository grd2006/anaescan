import * as tf from "@tensorflow/tfjs";
import { imageToModelInput } from "./preprocessing";

const MODEL_URL = "/models/conjuctiva/model.json";
let modelPromise = null;

export function loadModel() {
  if (!modelPromise) {
    modelPromise = tf.loadLayersModel(MODEL_URL).catch((error) => {
      console.error("AnaeScan model loading failed:", error);
      modelPromise = null;
      throw new Error(
        "The screening model could not be loaded. Ensure the converted TensorFlow.js files are available at public/models/conjuctiva."
      );
    });
  }

  return modelPromise;
}

export async function predictImage(image) {
  const model = await loadModel();
  const input = await imageToModelInput(image);

  try {
    const prediction = model.predict(input);
    const outputs = Array.isArray(prediction) ? prediction : [prediction];
    const values = await Promise.all(
      outputs.map(async (output) => ({
        shape: output.shape,
        dtype: output.dtype,
        values: Array.from(await output.data()),
      }))
    );

    outputs.forEach((output) => output.dispose());

    return { inputShape: input.shape, outputs: values };
  } finally {
    input.dispose();
  }
}