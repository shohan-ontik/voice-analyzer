"use client";

import { useState, type FormEvent } from "react";
import { BackHeader } from "../../components/BackHeader";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? "Failed to change password.");

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <BackHeader title="Change Password" backHref="/profile" />

      <div className="px-16 py-12 max-w-[440px] w-full mx-auto flex flex-col gap-6">
        {success ? (
          <div className="bg-teal-soft border border-teal/30 rounded-2xl p-6 flex flex-col gap-3 text-center">
            <div className="font-display font-semibold text-[16px] text-teal">Password changed</div>
            <div className="text-[13.5px] text-foreground">
              Your password has been updated. Use it next time you log in.
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-background-elevated border border-border rounded-2xl p-7 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="currentPassword" className="text-[13px] font-semibold text-foreground-muted">
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                autoFocus
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-[13px] font-semibold text-foreground-muted">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-accent"
              />
              <div className="text-xs text-foreground-muted">At least 8 characters.</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-[13px] font-semibold text-foreground-muted">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-accent"
              />
            </div>

            {error && <div className="text-[13px] text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1.5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-sm disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
