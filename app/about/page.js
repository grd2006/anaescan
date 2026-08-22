"use client";

import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import {
  FiCamera,
  FiCheckCircle,
  FiCpu,
  FiImage,
  FiInfo,
  FiShield,
  FiSmartphone,
} from "react-icons/fi";

const STEPS = [
  {
    icon: FiCamera,
    title: "Capture",
    description: "Take a clear photo of the inner lower eyelid using your smartphone.",
  },
  {
    icon: FiImage,
    title: "Prepare",
    description: "The image is checked and prepared for analysis.",
  },
  {
    icon: FiCpu,
    title: "Analyze",
    description: "A machine-learning model estimates haemoglobin from visual information in the image.",
  },
  {
    icon: FiCheckCircle,
    title: "Result",
    description: "Receive a screening estimate and confidence level.",
  },
];

const TECHNOLOGIES = [
  "Smartphone imaging",
  "Computer vision",
  "Machine learning",
  "On-device image processing where applicable",
];

export default function About() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 pb-8">
        <section aria-labelledby="about-heading" className="space-y-2">
          <p className="text-eyebrow">ABOUT</p>
          <h1 id="about-heading" className="heading-1">How AnaeScan works</h1>
          <p className="text-body">A simple smartphone-based approach to haemoglobin screening.</p>
        </section>

        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="heading-2">The screening flow</h2>
          <div className="mt-4 space-y-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <Card key={step.title} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                          Step {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="heading-4">{step.title}</h3>
                      <p className="mt-2 text-body-sm">{step.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="limitations-heading">
          <h2 id="limitations-heading" className="heading-2">Important to know</h2>
          <Card className="mt-4 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <FiInfo className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="heading-4">Screening aid only</h3>
                <p className="mt-2 text-body-sm">
                  AnaeScan is designed as a screening aid. It does not replace a blood test or diagnosis by a qualified healthcare professional.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section aria-labelledby="technology-heading">
          <h2 id="technology-heading" className="heading-2">Built with</h2>
          <Card className="mt-4 p-4">
            <ul className="space-y-3">
              {TECHNOLOGIES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-success-light)] text-[var(--color-success)]">
                    <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section aria-labelledby="disclaimer-heading">
          <h2 id="disclaimer-heading" className="heading-2">Safety note</h2>
          <Card className="mt-4 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <FiShield className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="heading-4">Important guidance</h3>
                <p className="mt-2 text-body-sm">
                  Use AnaeScan as an educational and screening support tool only. A blood test and clinician review remain the standard for diagnosis and treatment decisions.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="pt-2">
          <Link href="/screen" className="block">
            <Button variant="primary" className="w-full">
              <FiSmartphone className="h-5 w-5" aria-hidden="true" />
              Start Screening
            </Button>
          </Link>
        </section>
      </div>
    </MainLayout>
  );
}
