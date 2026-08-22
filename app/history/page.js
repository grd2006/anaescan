"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import Card from "@/components/Card";
import StatePanel from "@/components/StatePanel";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";

const mockHistory = [
  {
    id: "h-001",
    date: "2026-08-22",
    time: "10:42 AM",
    hemoglobin: 10.4,
    unit: "g/dL",
    confidence: "Moderate confidence",
    status: "Possible low-Hb signal",
    statusType: "warning",
  },
  {
    id: "h-002",
    date: "2026-08-20",
    time: "7:05 PM",
    hemoglobin: 12.1,
    unit: "g/dL",
    confidence: "High confidence",
    status: "No low-Hb signal",
    statusType: "success",
  },
  {
    id: "h-003",
    date: "2026-08-18",
    time: "9:30 AM",
    hemoglobin: 11.2,
    unit: "g/dL",
    confidence: "Moderate confidence",
    status: "Possible low-Hb signal",
    statusType: "warning",
  },
];

const statusConfig = {
  warning: {
    icon: FiAlertTriangle,
    badgeClass: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  },
  success: {
    icon: FiCheckCircle,
    badgeClass: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  },
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function History() {
  const router = useRouter();

  if (!mockHistory.length) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6">
          <section aria-labelledby="history-heading" className="space-y-2">
            <p className="text-eyebrow">RECENT RESULTS</p>
            <h1 id="history-heading" className="heading-1">Screening history</h1>
            <p className="text-body">View your previous screening results.</p>
          </section>

          <StatePanel
            variant="empty"
            title="No screenings yet"
            description="Your completed screenings will appear here."
            actionLabel="Start Screening"
            action
            onAction={() => router.push("/screen")}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section aria-labelledby="history-heading" className="space-y-2">
          <p className="text-eyebrow">RECENT RESULTS</p>
          <h1 id="history-heading" className="heading-1">Screening history</h1>
          <p className="text-body">View your previous screening results.</p>
        </section>

        <div className="flex flex-col gap-4">
          {mockHistory.map((entry) => {
            const config = statusConfig[entry.statusType] || statusConfig.warning;
            const StatusIcon = config.icon;

            return (
              <Link
                key={entry.id}
                href="/result"
                className="block rounded-[var(--radius-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                <Card hover className="overflow-hidden p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[2rem] font-extrabold leading-none tracking-[-0.06em] text-[var(--color-text-primary)]">
                          {entry.hemoglobin.toFixed(1)}
                        </span>
                        <span className="text-base font-medium text-[var(--color-text-secondary)]">
                          {entry.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <FiTrendingUp className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
                        <span>{entry.confidence}</span>
                      </div>

                      <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${config.badgeClass}`}>
                        <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{entry.status}</span>
                      </div>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                      <FiActivity className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                      <FiClock className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                    <span>{entry.time}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
