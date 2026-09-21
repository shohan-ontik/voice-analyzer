"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SparkleIcon } from "../components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body?.error?.message ?? "লগইন ব্যর্থ হয়েছে।");
        return;
      }

      router.push(body?.isFirstLogin ? "/?firstLogin=1" : "/");
      router.refresh();
    } catch {
      setError("সার্ভারে পৌঁছানো যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-[10px] bg-navy flex items-center justify-center text-navy-ink">
            <SparkleIcon size={18} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            PitchPerfect
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-background-elevated border border-border rounded-2xl p-7 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="identifier"
              className="text-[13px] font-semibold text-foreground-muted"
            >
              ইউজারনেম অথবা ফোন নম্বর
            </label>
            <input
              id="identifier"
              type="text"
              required
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-accent"
              placeholder="jane.doe অথবা 017XXXXXXXX"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-foreground-muted"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-accent"
              placeholder="••••••••"
            />
          </div>

          <label
            htmlFor="rememberMe"
            className="flex items-center gap-2 text-[13px] font-medium text-foreground-muted select-none"
          >
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-navy"
            />
            <span>আমাকে মনে রাখুন</span>
          </label>

          {error && <div className="text-[13px] text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1.5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-sm disabled:opacity-60"
          >
            {submitting ? "লগইন হচ্ছে…" : "লগইন করুন"}
          </button>

          <p className="text-center text-xs text-foreground-muted">
            অ্যাকাউন্ট আপনার অ্যাডমিন তৈরি করে থাকেন — আপনার কাছে লগইন তথ্য না
            থাকলে তার সাথে যোগাযোগ করুন।
          </p>
        </form>
      </div>
    </div>
  );
}
