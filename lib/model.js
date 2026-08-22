import * as tf from "@tensorflow/tfjs";
import { imageToModelInput } from "./preprocessing";

const MODEL_URL =
  process.env.NEXT_PUBLIC_MODEL_URL ||
  "https://media.githubusercontent.com/media/grd2006/anaescan/main/public/models/conjuctiva.tflite";
let modelPromise = null;

function loadTfliteScript() {
  if (window.tflite) return Promise.resolve(window.tflite);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/tflite/tf-tflite.es2017.js";
    script.async = true;
    script.onload = () => resolve(window.tflite);
    script.onerror = () => reject(new Error("The TFLite runtime could not be loaded."));
    document.head.appendChild(script);
  });
}

export function loadModel() {
  if (!modelPromise) {
    window.tf = tf;
    modelPromise = loadTfliteScript()
      .then((tflite) => {
        const wasmPath = new URL("/tflite/", window.location.origin).href;
        tflite.setWasmPath(wasmPath);
        return tflite.loadTFLiteModel(MODEL_URL);
      })
      .catch((error) => {
        console.error("AnaeScan model loading failed:", error);
        modelPromise = null;
        throw new Error(
          "The screening model could not be loaded. Please try again."
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