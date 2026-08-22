"use client";

import { useRef, useState } from "react";
import Header from "@/components/Header";
import ImagePreview from "@/components/ImagePreview";
import { FiAlertCircle, FiImage } from "react-icons/fi";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export default function UploadPage() {
  const inputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  function openPicker() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  function handleFileChange(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type || !file.type.startsWith("image/")) {
      setError("That file is not an image. Please choose a JPG or PNG photo.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(
        "That image is too large. Please choose one smaller than 20 MB."
      );
      return;
    }
    setError("");
    setPhoto(file);
  }

  return (
    <div className="page-container">
      <Header showBack backHref="/screen" title="Upload a photo" />
      <main className="page-content">
        {photo ? (
          <ImagePreview
            blob={photo}
            sourceLabel="gallery"
            onRetake={openPicker}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <section aria-labelledby="upload-heading">
              <h1 id="upload-heading" className="heading-1">Choose a photo</h1>
              <p className="mt-2 text-body">
                Select a clear image of the inner lower eyelid from your gallery.
              </p>
            </section>

            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={openPicker}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg)] py-16 px-6 text-center transition active:scale-[0.98] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <div className="h-14 w-14 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mb-1">
                  <FiImage className="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
                </div>
                <span className="heading-4 text-[var(--color-primary)]">
                  Choose from gallery
                </span>
              </button>

              {error && (
                <p
                  role="alert"
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-error-light)] px-4 py-3 text-center text-sm font-medium text-[var(--color-error)]"
                >
                  <FiAlertCircle className="shrink-0 text-base" aria-hidden="true" />
                  {error}
                </p>
              )}
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </main>
    </div>
  );
}