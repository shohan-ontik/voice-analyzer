"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshHealthButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="cursor-pointer inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[10px] bg-navy text-navy-ink text-[13.5px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isPending ? "animate-spin" : undefined}
      >
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
      {isPending ? "চেক করা হচ্ছে…" : "আবার চেক করুন"}
    </button>
  );
}
