"use client";

import { useState } from "react";
import { authFetch } from "../../lib/clientFetch";
import { RefreshIcon } from "../icons";
import type { ExamListItem } from "../../lib/types";
import { ExamCard } from "./ExamCard";

export function ExamsList({
  initialExams,
  initialTotal,
  pageSize,
}: {
  initialExams: ExamListItem[];
  initialTotal: number;
  pageSize: number;
}) {
  const [exams, setExams] = useState(initialExams);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hasMore = exams.length < total;

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setLoadError(null);
    const nextPage = page + 1;
    try {
      const res = await authFetch(`/api/exams?page=${nextPage}&pageSize=${pageSize}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? "এক্সাম লোড করা যায়নি।");
      setExams((prev) => [...prev, ...(body.items as ExamListItem[])]);
      setTotal(body.total as number);
      setPage(nextPage);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "এক্সাম লোড করা যায়নি।");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="px-4 pb-10 lg:px-10 lg:pb-12">
      {exams.length === 0 ? (
        <div className="text-center text-[13.5px] text-foreground-muted py-16">কোনো মডিউল খুঁজে পাওয়া যায়নি।</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {exams.map((item) => (
            <ExamCard key={item.exam.id} exam={item.exam} status={item.status} moduleSlug={item.moduleSlug} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex flex-col items-center gap-2 mt-8">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background-elevated text-[13px] font-semibold text-foreground hover:border-navy disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore && <RefreshIcon size={14} className="animate-spin" />}
            {loadingMore ? "লোড হচ্ছে..." : "আরও দেখুন"}
          </button>
          {loadError && <p className="text-[12.5px] text-error">{loadError}</p>}
        </div>
      )}
    </div>
  );
}
