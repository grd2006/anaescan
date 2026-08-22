"use client";

import { FiEye, FiSmartphone } from "react-icons/fi";

export default function VisualCard() {
  return (
    <div className="visual-card" aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <FiSmartphone className="h-20 w-20 text-[var(--color-primary)]/30" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[60%] h-[48%] rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] shadow-[var(--shadow-md)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent" />
                <FiEye className="absolute inset-0 m-auto h-10 w-10 text-[var(--color-primary)]/60" aria-hidden="true" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]/20" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]/20" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 opacity-50">
            <div className="h-2 w-16 rounded-full bg-[var(--color-primary)]/30" />
            <div className="h-2 w-10 rounded-full bg-[var(--color-primary)]/15" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-bg-elevated)] to-transparent" />
    </div>
  );
}