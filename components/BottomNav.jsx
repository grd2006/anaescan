"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCamera, FiClock, FiInfo } from "react-icons/fi";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/screen", label: "Screen", icon: FiCamera },
  { href: "/history", label: "History", icon: FiClock },
  { href: "/about", label: "About", icon: FiInfo },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? "bottom-nav-item-active" : "bottom-nav-item-inactive"}`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-[0.65rem] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}