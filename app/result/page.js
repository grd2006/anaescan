"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Card from "@/components/Card";
import { getLatestPhoto } from "@/lib/db";
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiInfo } from "react-icons/fi";

const MOCK_RESULT = {
  hemoglobin: 10.4,
  unit: "g/dL",
  confidence: "moderate", // "high", "moderate", "low"
  status: "possible_low_hb", // "normal", "possible_low_hb"
  message: "This screening estimate is below the reference range and should be confirmed with a blood test."
};

export default function ResultPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [step, setStep] = useState(0); // 0: Photo received, 1: Image processing, 2: Estimating haemoglobin, 3: Preparing result, 4: Done
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    getLatestPhoto().then((record) => {
      if (!active) return;
      if (!record || !record.blob) {
        router.push("/screen");
        return;
      }
      setPhoto(record);
      setPhotoUrl(URL.createObjectURL(record.blob));
      
      // Start fake analysis sequence
      const timers = [
        setTimeout(() => setStep(1), 1000),
        setTimeout(() => setStep(2), 2500),
        setTimeout(() => setStep(3), 4000),
        setTimeout(() => {
          setStep(4);
          setResult({
            ...MOCK_RESULT,
            image: record.blob,
          });
        }, 4500)
      ];

      return () => timers.forEach(clearTimeout);
    });
    
    return () => {
      active = false;
      setPhotoUrl((url) => {
        if (url) URL.revokeObjectURL(url);
        return "";
      });
    };
  }, [router]);

  if (step < 4 || !result) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="text-center">
            <h1 className="heading-1">Analyzing your image</h1>
            <p className="mt-2 text-body">Anaescan is processing your photo to estimate haemoglobin.</p>
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
            <ProgressStep active={step >= 2} current={step === 2} label="Estimating haemoglobin" />
            <ProgressStep active={step >= 3} current={step === 3} label="Preparing result" />
          </div>
        </div>
      </MainLayout>
    );
  }

  const isLowConfidence = result.confidence === "low";
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 pb-6">
        <div className="text-center">
          <h1 className="heading-1">Screening result</h1>
          <p className="mt-1 text-body-sm">Based on the image you provided</p>
        </div>

        {isLowConfidence ? (
          <Card className="flex flex-col items-center justify-center gap-3 p-6 text-center border-[var(--color-error)] bg-[var(--color-error-light)]">
            <FiAlertCircle className="h-10 w-10 text-[var(--color-error)]" aria-hidden="true" />
            <h2 className="heading-3 text-[var(--color-error)]">Result needs confirmation</h2>
            <p className="text-body-sm text-[var(--color-error)] opacity-90">
              We couldn't get a reliable screening estimate from this image.
            </p>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 gap-2 bg-gradient-to-br from-white to-[var(--color-bg)] border-[var(--color-border)] shadow-[var(--shadow-md)]">
            <span className="text-eyebrow">ESTIMATED HAEMOGLOBIN</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[4rem] font-extrabold tracking-tighter text-[var(--color-text-primary)] leading-none">{result.hemoglobin}</span>
              <span className="text-xl font-medium text-[var(--color-text-secondary)]">{result.unit}</span>
            </div>
            
            <div className="mt-4 flex w-full flex-col gap-2">
              <StatusCard status={result.status} message={result.message} />
              <ConfidenceCard confidence={result.confidence} />
            </div>
          </Card>
        )}

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

function StatusCard({ status, message }) {
  const isWarning = status === "possible_low_hb";
  return (
    <div className={`flex flex-col gap-1 p-3 rounded-[var(--radius-md)] ${isWarning ? 'bg-[var(--color-warning-light)]' : 'bg-[var(--color-success-light)]'}`}>
      <div className="flex items-center gap-2">
        {isWarning ? <FiAlertTriangle className="h-4 w-4 text-[var(--color-warning)]" /> : <FiCheckCircle className="h-4 w-4 text-[var(--color-success)]" />}
        <span className={`text-sm font-bold ${isWarning ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'}`}>
          {isWarning ? "Possible low-Hb signal" : "Normal signal"}
        </span>
      </div>
      <span className={`text-xs ${isWarning ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'} opacity-90`}>{message}</span>
    </div>
  );
}

function ConfidenceCard({ confidence }) {
  const isHigh = confidence === "high";
  const isMod = confidence === "moderate";
  
  const title = isHigh ? "High confidence" : isMod ? "Moderate confidence" : "Low confidence";
  const desc = isHigh 
    ? "The image provided a very clear signal for estimation." 
    : isMod 
    ? "The image provided a usable visual signal, but confirmation may still be appropriate." 
    : "We couldn't get a reliable screening estimate from this image.";
    
  return (
    <div className="flex flex-col gap-1 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-border)]">
      <div className="flex items-center gap-2">
        <FiCheckCircle className={`h-4 w-4 ${isHigh ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`} />
        <span className="text-sm font-bold text-[var(--color-text-primary)]">{title}</span>
      </div>
      <span className="text-xs text-[var(--color-text-secondary)]">{desc}</span>
    </div>
  );
}
