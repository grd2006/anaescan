"use client";

import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Card from "@/components/Card";
import { FiCamera, FiImage } from "react-icons/fi";

export default function ScreenEntry() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section aria-labelledby="screen-heading">
          <h1 id="screen-heading" className="heading-1">Let's get started</h1>
          <p className="mt-2 text-body">
            Take a clear photo of the inner lower eyelid or choose an existing photo.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <Link href="/capture" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-lg)]">
            <Card hover className="p-6 flex flex-col items-center justify-center text-center gap-4 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-active)] text-white border-none shadow-[var(--shadow-md)] active:scale-[0.98] transition-transform">
              <FiCamera className="h-10 w-10 opacity-90" aria-hidden="true" />
              <div>
                <h2 className="heading-3 text-white">Take a picture</h2>
                <p className="mt-1 text-white/80 text-sm max-w-[240px] mx-auto">
                  Use your camera to capture a new photo.
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/upload" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-lg)]">
            <Card hover className="p-6 flex flex-col items-center justify-center text-center gap-4 bg-[var(--color-bg-elevated)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] active:scale-[0.98] transition-all">
              <FiImage className="h-10 w-10 text-[var(--color-primary)]" aria-hidden="true" />
              <div>
                <h2 className="heading-3 text-[var(--color-primary)]">Upload from gallery</h2>
                <p className="mt-1 text-body-sm max-w-[240px] mx-auto">
                  Choose a photo already on your device.
                </p>
              </div>
            </Card>
          </Link>
        </section>
      </div>
    </MainLayout>
  );
}
