"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiCameraOff, FiImage } from "react-icons/fi";
import Link from "next/link";

export default function CameraCapture({ onCaptured, onCancel }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("starting");
  const [error, setError] = useState("");

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setStatus("starting");
    setError("");
    if (
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      setStatus("error");
      setError(
        "This browser does not support the camera. Please use the upload option instead."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("ready");
    } catch (err) {
      stopStream();
      setStatus("error");
      if (err && (err.name === "NotAllowedError" || err.name === "SecurityError")) {
        setError(
          "Camera access was blocked. Please allow camera access in your browser settings, or upload a picture instead."
        );
      } else if (
        err &&
        (err.name === "NotFoundError" || err.name === "OverconstrainedError")
      ) {
        setError(
          "No usable camera was found on this device. Please upload a picture instead."
        );
      } else {
        setError(
          "The camera could not be started. Please try again, or upload a picture instead."
        );
      }
    }
  }, [stopStream]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      await startCamera();
      if (cancelled) {
        stopStream();
      }
    }

    run();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [startCamera, stopStream]);

  function handleCapture() {
    const video = videoRef.current;
    if (!video || status !== "ready" || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          stopStream();
          onCaptured(blob);
        } else {
          setError("The picture could not be captured. Please try again.");
        }
      },
      "image/jpeg",
      0.92
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full relative">
      <div className="relative w-full flex-1 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-text-primary)] shadow-[var(--shadow-md)]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${status === "ready" ? "" : "hidden"}`}
        />
        {status === "ready" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col" aria-hidden="true">
            <div className="bg-black/40 p-4 text-center">
              <p className="text-white font-medium text-sm drop-shadow-md">Pull your lower eyelid gently down.</p>
              <p className="text-white/90 text-xs mt-1 drop-shadow-md">Position the inner eyelid inside the guide. Keep your phone steady.</p>
            </div>
            
            <div className="relative flex-1">
              <div className="absolute left-1/2 top-[44%] h-[40%] w-[70%] max-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.5)]" />
              <div className="absolute left-1/2 top-[68%] h-px w-[40%] max-w-[160px] -translate-x-1/2 bg-white/70" />
            </div>
          </div>
        )}
        {status !== "ready" && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
            {status === "starting" ? (
              <>
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                <p className="text-sm text-white/80">Starting camera…</p>
              </>
            ) : (
              <>
                <FiCameraOff className="text-3xl text-white/90" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-white/90">{error}</p>
                <button type="button" onClick={startCamera} className="mt-4 rounded-full bg-white/20 px-6 py-2 text-sm font-medium text-white hover:bg-white/30">
                  Try again
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex w-full items-center justify-between px-4 pb-4">
        <Link 
          href="/upload" 
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shadow-sm transition active:scale-95"
          aria-label="Upload from gallery"
        >
          <FiImage className="h-6 w-6" aria-hidden="true" />
        </Link>
        
        {status === "ready" ? (
          <button
            type="button"
            onClick={handleCapture}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--color-primary)] shadow-[var(--shadow-md)] transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            aria-label="Capture photo"
          >
            <span className="h-[60px] w-[60px] rounded-full border-4 border-white" />
          </button>
        ) : (
          <div className="h-[72px] w-[72px]" />
        )}

        <div className="h-12 w-12" aria-hidden="true" />
      </div>
    </div>
  );
}