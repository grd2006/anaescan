"use client";

import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Button from "@/components/Button";
import Card from "@/components/Card";
import VisualCard from "@/components/VisualCard";
import { FiCamera, FiInfo, FiShield } from "react-icons/fi";
import { getLatestPhoto, deletePhoto } from "@/lib/db";
import { useEffect, useState } from "react";

export default function Home() {
  const [savedPhoto, setSavedPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [removeError, setRemoveError] = useState("");

  useEffect(() => {
    let active = true;
    getLatestPhoto()
      .then((record) => {
        if (!active || !record) return;
        setSavedPhoto(record);
        setPhotoUrl(URL.createObjectURL(record.blob));
      })
      .catch(() => {});
    return () => {
      active = false;
      setPhotoUrl((url) => {
        if (url) URL.revokeObjectURL(url);
        return "";
      });
    };
  }, []);

  async function handleRemove() {
    setRemoveError("");
    try {
      await deletePhoto(savedPhoto.id);
      setSavedPhoto(null);
      setPhotoUrl("");
    } catch (err) {
      setRemoveError(
        err && err.message ? err.message : "The photo could not be removed."
      );
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section aria-labelledby="welcome-heading">
          <p className="text-eyebrow">SMARTPHONE HEALTH SCREENING</p>
          <h1 id="welcome-heading" className="mt-2 heading-1 text-balance">
            Check your haemoglobin with your smartphone.
          </h1>
          <p className="mt-4 text-body">
            AnaeScan uses a smartphone image of the inner eyelid to provide a quick, non-invasive screening estimate.
          </p>
        </section>

        <section aria-labelledby="visual-heading" className="mt-2">
          <VisualCard />
        </section>

        <section aria-labelledby="cta-heading" className="flex flex-col gap-3">
          <Link href="/screen">
            <Button variant="primary" size="lg" className="gap-3">
              <FiCamera className="h-5 w-5" aria-hidden="true" />
              Start Screening
            </Button>
          </Link>

          <Link href="/about">
            <Button variant="secondary" size="lg" className="gap-3">
              <FiInfo className="h-5 w-5" aria-hidden="true" />
              How it works
            </Button>
          </Link>
        </section>

        {savedPhoto && (
          <section aria-label="Saved photo" className="card">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="heading-4">Recent screening</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] text-[0.7rem] font-medium">
                  <FiShield className="h-3.5 w-3.5" aria-hidden="true" />
                  Ready
                </span>
              </div>
              {photoUrl && (
                <div className="aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-bg)]">
                  <img
                    src={photoUrl}
                    alt="Most recently saved screening photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {removeError && (
                <p role="alert" className="mt-3 text-sm font-medium text-[var(--color-error)]">
                  {removeError}
                </p>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="mt-3 btn-ghost text-[var(--color-error)] hover:bg-[var(--color-error-light)]"
              >
                Remove saved photo
              </button>
            </div>
          </section>
        )}

        <section aria-label="Disclaimer" className="card">
          <div className="p-4 flex items-start gap-3">
            <FiInfo className="h-5 w-5 text-[var(--color-primary)] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="heading-4 mb-1">Screening aid, not a diagnosis</h3>
              <p className="text-body-sm">
                AnaeScan provides an estimate only. It does not replace a blood test or professional medical advice. If you have symptoms or concerns, please consult a healthcare provider.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}