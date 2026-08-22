"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { checkImageQuality } from "@/lib/imageQuality";
import { prepareImageForAnalysis } from "@/lib/prepareImage";
import { savePhoto } from "@/lib/db";

export default function ImagePreview({ blob, sourceLabel, onRetake }) {
  const router = useRouter();
  const objectUrl = useMemo(() => URL.createObjectURL(blob), [blob]);
  const [check, setCheck] = useState({
    forBlob: null,
    state: "checking",
    issues: [],
  });
  const quality =
    check.forBlob === blob ? check : { state: "checking", issues: [] };
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  useEffect(() => {
    let active = true;
    checkImageQuality(blob)
      .then((result) => {
        if (active) {
          setCheck({
            forBlob: blob,
            state: result.ok ? "pass" : "fail",
            issues: result.issues,
          });
        }
      })
      .catch(() => {
        if (active) {
          setCheck({
            forBlob: blob,
            state: "fail",
            issues: [
              {
                code: "unknown",
                message:
                  "The image could not be checked. Please retake or choose another photo.",
              },
            ],
          });
        }
      });
    return () => {
      active = false;
    };
  }, [blob]);

  async function handleUsePhoto() {
    setSaving(true);
    setError("");
    try {
      const prepared = await prepareImageForAnalysis(blob);
      await savePhoto(blob, {
        source: sourceLabel,
        status: "ready",
        width: prepared.width,
        height: prepared.height,
        analysisBlob: prepared.blob,
      });
      router.push("/result");
    } catch (err) {
      setError(
        err && err.message
          ? err.message
          : "The photo could not be saved. Please try again."
      );
      setSaving(false);
    }
  }

  const blocked = quality.state === "fail";

  function getQualityUI(issue) {
    switch (issue.code) {
      case "too-dark":
        return {
          title: "Photo is too dark",
          desc: "Try taking the photo somewhere with better lighting.",
          color: "var(--color-warning)",
          bg: "var(--color-warning-light)"
        };
      case "too-bright":
        return {
          title: "Photo is too bright",
          desc: "Move away from direct light and try again.",
          color: "var(--color-warning)",
          bg: "var(--color-warning-light)"
        };
      case "unreadable":
        return {
          title: "We couldn't read this photo.",
          desc: "Please choose another image.",
          color: "var(--color-error)",
          bg: "var(--color-error-light)"
        };
      case "too-small":
        return {
          title: "The photo doesn't have enough detail.",
          desc: "Please take a higher-resolution photo.",
          color: "var(--color-error)",
          bg: "var(--color-error-light)"
        };
      default:
        return {
          title: "There was a problem with this photo.",
          desc: "Please choose another image or try again.",
          color: "var(--color-error)",
          bg: "var(--color-error-light)"
        };
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 pb-6">
      <div className="w-full text-center">
        <h2 className="heading-2">Review your photo</h2>
      </div>

      <div className="w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        {objectUrl && (
          <img
            src={objectUrl}
            alt={sourceLabel === "camera" ? "Captured photo preview" : "Selected photo preview"}
            className="aspect-[4/3] w-full max-h-[50vh] object-contain"
          />
        )}
      </div>

      <div aria-live="polite" className="w-full flex flex-col gap-3">
        {quality.state === "checking" && (
          <div className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-sm)]">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]"
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Checking image quality…</span>
          </div>
        )}

        {quality.state === "pass" && (
          <div className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-success-light)] p-4">
            <FiCheckCircle className="h-6 w-6 shrink-0 text-[var(--color-success)]" aria-hidden="true" />
            <span className="text-sm font-medium text-[var(--color-success)]">Photo looks good</span>
          </div>
        )}

        {blocked && quality.issues.map((issue) => {
          const ui = getQualityUI(issue);
          return (
            <div
              key={issue.code}
              role="alert"
              className="flex w-full items-start gap-3 rounded-[var(--radius-lg)] p-4"
              style={{ backgroundColor: ui.bg, color: ui.color }}
            >
              <FiAlertTriangle className="h-6 w-6 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold">{ui.title}</span>
                <span className="text-sm opacity-90">{ui.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-error-light)] px-4 py-3 text-center text-sm font-medium text-[var(--color-error)]"
        >
          <FiAlertCircle className="shrink-0 text-base" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-2 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleUsePhoto}
          disabled={saving || blocked || quality.state === "checking"}
          className="btn-primary w-full shadow-[var(--shadow-md)]"
        >
          {saving ? "Saving…" : "Use this photo"}
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="btn-secondary w-full"
        >
          {sourceLabel === "camera" ? "Retake" : "Choose another"}
        </button>
      </div>
    </div>
  );
}