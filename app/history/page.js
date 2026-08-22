"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import Card from "@/components/Card";
import StatePanel from "@/components/StatePanel";
import { deleteScreening, getScreenings } from "@/lib/db";
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiClock, FiTrash2 } from "react-icons/fi";

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return {
    date: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  };
}

export default function History() {
  const [screenings, setScreenings] = useState(null);
  const [error, setError] = useState("");

  async function loadScreenings() {
    try {
      setError("");
      setScreenings(await getScreenings());
    } catch (loadError) {
      console.error("AnaeScan history loading failed", loadError);
      setError("History could not be loaded. Please try again.");
    }
  }

  useEffect(() => {
    loadScreenings();
  }, []);

  async function handleDelete(id) {
    try {
      await deleteScreening(id);
      await loadScreenings();
    } catch (deleteError) {
      console.error("AnaeScan history deletion failed", deleteError);
      setError("This screening could not be removed. Please try again.");
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section aria-labelledby="history-heading" className="space-y-2">
          <p className="text-eyebrow">RECENT RESULTS</p>
          <h1 id="history-heading" className="heading-1">Screening history</h1>
          <p className="text-body">View your previous screening results.</p>
        </section>

        {error ? (
          <StatePanel
            variant="error"
            title="Something went wrong"
            description={error}
            action
            actionLabel="Try again"
            onAction={loadScreenings}
          />
        ) : screenings === null ? (
          <StatePanel variant="loading" title="Loading history" description="Retrieving your saved screenings." />
        ) : screenings.length === 0 ? (
          <StatePanel
            variant="empty"
            title="No screenings yet"
            description="Your completed screenings will appear here."
            action
            actionLabel="Start Screening"
            onAction={() => window.location.assign("/screen")}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {screenings.map((screening) => {
              const score = screening.score;
              const isAnemiaSignal = typeof score === "number" && score > 0.5;
              const { date, time } = formatDateTime(screening.createdAt);

              return (
                <Card key={screening.id} className="overflow-hidden p-4">
                  <Link
                    href={`/result?screening=${encodeURIComponent(screening.id)}`}
                    className="block rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                          <FiActivity className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                          <span>Model score</span>
                        </div>
                        <p className="font-mono text-2xl font-bold text-[var(--color-text-primary)]">
                          {typeof score === "number" ? score.toFixed(4) : "Unavailable"}
                        </p>
                        {screening.interpretation ? (
                          <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${isAnemiaSignal ? "bg-[var(--color-warning-light)] text-[var(--color-warning)]" : "bg-[var(--color-success-light)] text-[var(--color-success)]"}`}>
                            {isAnemiaSignal ? <FiAlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> : <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />}
                            <span>{screening.interpretation}</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                        <FiActivity className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-2">
                        <FiClock className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden="true" />
                        <span>{date}</span>
                      </div>
                      <span>{time}</span>
                    </div>
                  </Link>
                  <button type="button" onClick={() => handleDelete(screening.id)} className="btn-ghost mt-3 w-full text-[var(--color-error)] hover:bg-[var(--color-error-light)]">
                    <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                    Remove
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
