"use client";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function MainLayout({ children }) {
  return (
    <div className="page-container">
      <Header />
      <main className="page-content pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}