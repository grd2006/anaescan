"use client";

import Link from "next/link";
import { FiInfo } from "react-icons/fi";

export default function Header({ showBack = false, backHref = "/", title = "AnaeScan", rightAction }) {
  return (
    <header className="header" role="banner">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            href={backHref}
            className="btn-icon-muted"
            aria-label="Back"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        ) : (
          <span className="header-title" aria-label="AnaeScan home">
            AnaeScan
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {rightAction}
        {!rightAction && !showBack && (
          <button
            className="btn-icon-muted"
            aria-label="More information"
          >
            <FiInfo className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}