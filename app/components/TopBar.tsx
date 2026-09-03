"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BellIcon, ChevronDownIcon, LogoutIcon, SparkleIcon, UserIcon } from "./icons";
import { dashboardUser } from "../lib/dashboardData";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function TopBar({ breadcrumb }: { breadcrumb: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 lg:h-[76px] shrink-0 border-b border-border bg-background-elevated flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-2 text-[13.5px] min-w-0">
        <div className="lg:hidden w-8 h-8 rounded-[9px] bg-navy flex items-center justify-center text-navy-ink shrink-0">
          <SparkleIcon size={15} />
        </div>
        <span className="hidden lg:inline text-foreground-muted">সেলস অফিসার পোর্টাল (SO)</span>
        <span className="hidden lg:inline text-foreground-muted">/</span>
        <span className="hidden lg:inline font-bold text-foreground">{breadcrumb}</span>
      </div>

      <div className="flex items-center gap-2 lg:gap-3.5 shrink-0">
        <div className="flex items-center gap-1.5 pl-2.5 lg:pl-3 pr-2 lg:pr-2.5 py-1.5 lg:py-2 rounded-full bg-navy-soft border border-navy/15 text-navy text-[12px] lg:text-[13px] font-semibold">
          <UserIcon size={13} className="hidden sm:block" />
          {dashboardUser.roleWithCode}
          <ChevronDownIcon size={13} />
        </div>

        <button
          type="button"
          className="relative w-8 h-8 lg:w-9 lg:h-9 rounded-full border border-border flex items-center justify-center text-foreground-muted hover:text-foreground shrink-0"
        >
          <BellIcon size={16} />
          <span className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 w-[7px] h-[7px] rounded-full bg-accent" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-1 pr-1 py-1 rounded-full hover:bg-background"
          >
            <div className="w-8 h-8 lg:w-[34px] lg:h-[34px] rounded-full bg-teal-soft flex items-center justify-center font-display font-semibold text-[12px] lg:text-[13px] text-teal shrink-0">
              {initials(dashboardUser.fullName)}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-[13px] font-semibold text-foreground leading-tight">{dashboardUser.fullName}</div>
              <div className="text-[11.5px] text-foreground-muted leading-tight">{dashboardUser.employeeId}</div>
            </div>
            <ChevronDownIcon size={15} className="text-foreground-muted hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-background-elevated shadow-lg py-1.5 z-20">
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-medium text-foreground hover:bg-background"
              >
                <UserIcon size={15} />
                প্রোফাইল
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-medium text-foreground hover:bg-background"
              >
                <LogoutIcon size={15} />
                লগ আউট
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
