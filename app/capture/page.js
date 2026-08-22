"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import CameraCapture from "@/components/CameraCapture";
import ImagePreview from "@/components/ImagePreview";

export default function CapturePage() {
  const router = useRouter();
  const [photo, setPhoto] = useState(null);

  return (
    <div className="page-container">
      <Header showBack backHref="/screen" title="Take a photo" />
      <main className="page-content">
        {photo ? (
          <ImagePreview
            blob={photo}
            sourceLabel="camera"
            onRetake={() => setPhoto(null)}
          />
        ) : (
          <CameraCapture
            onCaptured={setPhoto}
            onCancel={() => router.push("/")}
          />
        )}
      </main>
    </div>
  );
}