"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authFetch } from "../../lib/clientFetch";
import { formatBnDate } from "../../lib/formatDate";
import { isExamExpired } from "../../lib/moduleProgress";
import type { ExamListItem } from "../../lib/types";
import { AwardIcon, CalendarIcon, CheckCircleIcon, LockIcon } from "../icons";

// The upcoming exam is the not-yet-passed, not-yet-expired exam with the
// soonest deadline. Exams without a due date come after dated ones.
function pickUpcomingExam(items: ExamListItem[]): ExamListItem | null {
  const dueTime = (item: ExamListItem) =>
    item.exam.dueDate ? new Date(item.exam.dueDate).getTime() : Infinity;

  return (
    items
      .filter((i) => i.status !== "passed" && !isExamExpired(i.exam))
      .sort((a, b) => dueTime(a) - dueTime(b))[0] ?? null
  );
}

export function UpcomingExamCard() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<ExamListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authFetch("/api/exams?page=1&pageSize=50&sortBy=dueDate&sortOrder=asc")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && !cancelled)
          setUpcoming(pickUpcomingExam(body.items as ExamListItem[]));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const locked = upcoming?.status === "locked";

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-display font-bold text-[16px] text-foreground">
            আপকামিং এক্সাম
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-[13.5px] text-foreground-muted py-6 text-center">
          লোড হচ্ছে…
        </div>
      ) : !upcoming ? (
        <div className="text-[13.5px] text-foreground-muted py-6 text-center">
          কোনো আপকামিং এক্সাম নেই।
        </div>
      ) : (
        <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
          {upcoming.exam.dueDate && (
            <div className="flex items-center gap-1.5 text-[12px] text-accent font-semibold">
              <CalendarIcon size={14} />
              শেষ তারিখ: {formatBnDate(upcoming.exam.dueDate)}
            </div>
          )}
          <div>
            <div className="font-display font-bold text-[15px] text-foreground mb-1">
              {upcoming.exam.title}
            </div>
            <p className="text-[13px] text-foreground-muted leading-relaxed line-clamp-3">
              {upcoming.exam.scenario}
            </p>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-foreground-muted">প্রয়োজনীয় পূর্বশর্ত</span>
            {locked ? (
              <span className="flex items-center gap-1.5 text-foreground-muted font-semibold">
                <LockIcon size={14} />
                সম্পন্ন হয়নি
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-success font-semibold">
                <CheckCircleIcon size={14} />
                সম্পন্ন হয়েছে
              </span>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!upcoming || locked}
        onClick={() =>
          upcoming &&
          router.push(
            `/modules/${upcoming.moduleSlug}/exam?exam=${encodeURIComponent(upcoming.exam.slug)}`,
          )
        }
        className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-navy text-warning font-display font-semibold text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        <AwardIcon size={16} />
        এক্সামে যান
      </button>

      <button
        type="button"
        onClick={() => router.push("/history")}
        className="text-center text-[13px] font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
      >
        পূর্ববর্তী রিপোর্ট পর্যালোচনা
      </button>
    </div>
  );
}
