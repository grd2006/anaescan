"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Card from "@/components/Card";
import { getLatestPhoto } from "@/lib/db";
import { predictImage } from "@/lib/model";
import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

export default function ResultPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [step, setStep] = useState(0); // 0: Photo received, 1: Image processing, 2: Estimating haemoglobin, 3: Preparing result, 4: Done
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function analyze() {
      try {
        const record = await getLatestPhoto();
        if (!active) return;
        if (!record || !record.blob) {
          router.push("/screen");
          return;
        }

        setPhoto(record);
        setPhotoUrl(URL.createObjectURL(record.blob));
        setStep(1);
        const prediction = await predictImage(record.analysisBlob || record.blob);
        if (!active) return;
        setStep(3);
        setResult(prediction);
        setStep(4);
      } catch (analysisError) {
        console.error("AnaeScan analysis failed", analysisError);
        if (active) setError("Analysis couldn't be completed. Please try again.");
      }
    }

    analyze();
    
    return () => {
      active = false;
      setPhotoUrl((url) => {
        if (url) URL.revokeObjectURL(url);
        return "";
      });
    };
  }, [router]);

  if (error) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
          <div className="flex w-full flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--color-error)]/20 bg-[var(--color-error-light)] p-6 text-center">
            <FiAlertCircle className="h-10 w-10 text-[var(--color-error)]" aria-hidden="true" />
            <h1 className="heading-2 text-[var(--color-error)]">Analysis couldn't be completed.</h1>
            <p className="text-body-sm text-[var(--color-error)]">Please try again.</p>
            <button type="button" onClick={() => router.push("/screen")} className="btn-primary mt-2 w-full max-w-xs">
              Try again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (step < 4 || !result) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="text-center">
            <h1 className="heading-1">Preparing AnaeScan</h1>
            <p className="mt-2 text-body">Loading the screening model and analyzing your photo.</p>
          </div>
          
          <div className="relative flex items-center justify-center h-32 w-32">
            <div className="absolute inset-0 rounded-full border-4 border-[var(--color-primary-light)]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-primary)] border-r-[var(--color-primary)] animate-spin"></div>
            <div className="h-16 w-16 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center animate-pulse">
              <div className="h-8 w-8 rounded-full bg-[var(--color-primary)]"></div>
            </div>
          </div>
          
          <div className="flex flex-col w-full max-w-xs gap-3">
            <ProgressStep active={step >= 0} current={step === 0} label="Photo received" />
            <ProgressStep active={step >= 1} current={step === 1} label="Image processing" />
            <ProgressStep active={step >= 2} current={step === 2} label="Running model inference" />
            <ProgressStep active={step >= 3} current={step === 3} label="Preparing result" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 pb-6">
        <div className="text-center">
          <h1 className="heading-1">Screening result</h1>
          <p className="mt-1 text-body-sm">Based on the image you provided</p>
        </div>

        <Card className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-white to-[var(--color-bg)] p-8 shadow-[var(--shadow-md)]">
          <span className="text-eyebrow">RAW MODEL OUTPUT</span>
          {result.outputs.map((output, index) => (
            <div key={index} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                <FiCheckCircle className="h-4 w-4 text-[var(--color-success)]" aria-hidden="true" />
                Output {index + 1}
              </div>
              <p className="break-words font-mono text-sm text-[var(--color-text-secondary)]">{JSON.stringify(output.values)}</p>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">Shape: [{output.shape.join(", ")}] · Type: {output.dtype}</p>
            </div>
          ))}
          <p className="text-center text-body-sm">The model output has not been clinically interpreted.</p>
        </Card>

        <div className="flex w-full flex-col gap-3 mt-4">
          <button type="button" onClick={() => router.push("/")} className="btn-primary w-full shadow-[var(--shadow-md)]">
            Done
          </button>
          <button type="button" onClick={() => router.push("/screen")} className="btn-secondary w-full">
            Retake photo
          </button>
        </div>

        {photoUrl && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Analyzed photo</span>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-border)] shadow-sm">
              <img src={photoUrl} alt="Analyzed photo" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="mt-4 flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
          <FiInfo className="h-5 w-5 text-[var(--color-text-muted)] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-[var(--color-text-primary)]">Screening aid, not a diagnosis.</span>
            <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Anaescan provides an estimated screening result. A blood test and qualified healthcare professional are required for confirmation.
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function ProgressStep({ active, current, label }) {
  return (
    <div className={`flex items-center gap-3 ${active ? 'opacity-100' : 'opacity-40'} transition-opacity duration-300`}>
      <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${active && !current ? 'bg-[var(--color-success)] text-white' : current ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-2 border-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`}>
        {active && !current ? <FiCheckCircle className="h-4 w-4" /> : <div className={`h-2 w-2 rounded-full ${current ? 'bg-[var(--color-primary)]' : 'bg-transparent'}`} />}
      </div>
      <span className={`text-sm font-medium ${current ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>{label}</span>
    </div>
  );
}

