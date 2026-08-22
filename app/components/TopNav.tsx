"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AppUser } from "../lib/types";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => (res.ok ? res.json() : null))
      .then((body) => body && setUser(body))
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between px-16 py-7 border-b border-border">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-accent flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-foreground">PitchPerfect</span>
      </Link>

      <div className="flex items-center gap-9">
        <Link
          href="/"
          className={`text-sm ${pathname === "/" ? "font-semibold text-foreground" : "font-medium text-foreground-muted"}`}
        >
          Practice
        </Link>
        <Link
          href="/history"
          className={`text-sm ${pathname === "/history" ? "font-semibold text-foreground" : "font-medium text-foreground-muted"}`}
        >
          History
        </Link>
        <div className="flex items-center gap-3">
          <div
            title={user?.name}
            className="w-[34px] h-[34px] rounded-full bg-teal-soft flex items-center justify-center font-display font-semibold text-[13px] text-teal"
          >
            {user ? initials(user.name) : "…"}
          </div>
          <button type="button" onClick={logout} className="text-xs font-semibold text-foreground-muted hover:text-foreground">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
