"use client";

import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiLoader,
  FiAlertTriangle,
} from "react-icons/fi";

const VARIANTS = {
  loading: {
    icon: FiLoader,
    wrapper: "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]",
    iconClass: "text-[var(--color-primary)]",
  },
  error: {
    icon: FiAlertCircle,
    wrapper: "border-[var(--color-error)]/20 bg-[var(--color-error-light)] text-[var(--color-error)]",
    iconClass: "text-[var(--color-error)]",
  },
  empty: {
    icon: FiInfo,
    wrapper: "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]",
    iconClass: "text-[var(--color-primary)]",
  },
  success: {
    icon: FiCheckCircle,
    wrapper: "border-[var(--color-success)]/20 bg-[var(--color-success-light)] text-[var(--color-success)]",
    iconClass: "text-[var(--color-success)]",
  },
  warning: {
    icon: FiAlertTriangle,
    wrapper: "border-[var(--color-warning)]/20 bg-[var(--color-warning-light)] text-[var(--color-warning)]",
    iconClass: "text-[var(--color-warning)]",
  },
};

export default function StatePanel({
  variant = "info",
  title,
  description,
  action,
  actionLabel,
  onAction,
  className = "",
}) {
  const config = VARIANTS[variant] || VARIANTS.empty;
  const Icon = config.icon;

  return (
    <div
      className={`flex w-full flex-col items-center gap-4 rounded-[var(--radius-xl)] border p-6 text-center shadow-[var(--shadow-sm)] ${config.wrapper} ${className}`}
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      aria-live={variant === "loading" ? "polite" : "off"}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-white/70 ${config.iconClass}`}>
        <Icon
          className={`h-6 w-6 ${variant === "loading" ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
      </div>

      <div className="space-y-1">
        <h2 className="heading-3">{title}</h2>
        {description ? <p className="text-body-sm">{description}</p> : null}
      </div>

      {action ? (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary w-full max-w-xs"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
