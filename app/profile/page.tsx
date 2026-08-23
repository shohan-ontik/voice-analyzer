"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TopNav } from "../components/TopNav";
import type { AppUser } from "../lib/types";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "long" });
}

export default function ProfilePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error?.message ?? "Failed to load profile.");
        setUser(body);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile."));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <TopNav />

      <div className="px-16 py-12 max-w-[640px] w-full mx-auto flex flex-col gap-6">
        <div>
          <h1 className="font-display font-bold text-[26px] text-foreground mb-1">Profile</h1>
          <p className="text-[14px] text-foreground-muted">Your account details.</p>
        </div>

        {error && <div className="text-[13px] text-red-600">{error}</div>}

        {!user && !error ? (
          <div className="text-sm text-foreground-muted">Loading…</div>
        ) : user ? (
          <>
            {user.mustChangePassword && (
              <div className="rounded-xl bg-accent-soft text-accent text-[13.5px] px-4 py-3.5 flex items-center justify-between gap-4">
                <span>You&apos;re still using a temporary password — change it to secure your account.</span>
                <Link href="/profile/password" className="font-display font-semibold whitespace-nowrap">
                  Change now
                </Link>
              </div>
            )}

            <div className="bg-background-elevated border border-border rounded-2xl p-7 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-teal-soft flex items-center justify-center font-display font-bold text-xl text-teal flex-shrink-0">
                {initials(user.name)}
              </div>
              <div>
                <div className="font-display font-bold text-[19px] text-foreground">{user.name}</div>
                <div className="text-[13.5px] text-foreground-muted">{user.email}</div>
              </div>
            </div>

            <div className="bg-background-elevated border border-border rounded-2xl divide-y divide-border">
              <InfoRow label="Role" value={user.role === "admin" ? "Admin" : "Sales rep"} />
              <InfoRow label="Member since" value={formatDate(user.createdAt)} />
              <InfoRow
                label="Last login"
                value={user.lastLoginAt ? formatDate(user.lastLoginAt) : "This is your first login"}
              />
            </div>

            <Link
              href="/profile/password"
              className="self-start px-5 py-3 rounded-xl border-[1.5px] border-border text-foreground font-display font-semibold text-sm"
            >
              Change password
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="text-[13px] font-semibold text-foreground-muted">{label}</div>
      <div className="text-[13.5px] text-foreground">{value}</div>
    </div>
  );
}
