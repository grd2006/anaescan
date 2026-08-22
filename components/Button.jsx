"use client";

import { forwardRef } from "react";

const Button = forwardRef(function Button({
  children,
  variant = "primary",
  size = "default",
  className = "",
  disabled = false,
  type = "button",
  ...props
}, ref) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-lg)] transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2";

  const variants = {
    primary: "bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]",
    secondary: "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
    ghost: "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]",
    destructive: "bg-[var(--color-error)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-error)]/90 active:bg-[var(--color-error)]",
  };

  const sizes = {
    default: "h-13 px-6 text-[var(--text-base)]",
    lg: "h-14 px-8 text-[var(--text-lg)]",
    sm: "h-10 px-4 text-[var(--text-sm)]",
    icon: "h-10 w-10 px-0",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;