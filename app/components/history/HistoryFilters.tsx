"use client";

import { useState } from "react";
import { SearchIcon } from "../icons";
import { authFetch } from "../../lib/clientFetch";
import { HISTORY_PAGE_SIZE, toEvaluationReport, type EvaluationReport, type ReportKind } from "../../lib/reportsData";
import type { PracticeSessionRecord } from "../../lib/types";
import { ReportRow } from "./ReportRow";

type FilterKey = "all" | ReportKind;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "সকল রিপোর্ট" },
  { key: "practice", label: "প্র্যাকটিস" },
  { key: "exam", label: "এক্সাম" },
];

export function HistoryFilters({
  initialReports,
  total: initialTotal,
}: {
  initialReports: EvaluationReport[];
  total: number;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [reports, setReports] = useState(initialReports);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const hasMore = reports.length < total;

  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await authFetch(`/api/sessions?page=${nextPage}&pageSize=${HISTORY_PAGE_SIZE}`);
      if (res.ok) {
        const body = (await res.json()) as { items: PracticeSessionRecord[]; total: number };
        setReports((prev) => [...prev, ...body.items.map(toEvaluationReport)]);
        setTotal(body.total);
        setPage(nextPage);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  const filteredEntries = reports.filter((r) => {
    const matchesFilter = filter === "all" || r.kind === filter;
    const matchesQuery = query.trim() === "" || r.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <div className="px-4 pt-6 pb-6 lg:px-10 lg:pt-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[22px] lg:text-[28px] text-foreground mb-1.5">
            ইভালুয়েশন রিপোর্ট ও হিস্ট্রি
          </h1>
          <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted max-w-[540px]">
            এআই গ্রেডিং, স্কিল বেঞ্চমার্ক এবং ডিটেইলড ফিডব্যাক চেক করুন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <SearchIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="রিপোর্ট বা মডিউল খুঁজুন..."
              className="pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background-elevated text-sm w-full sm:w-64 outline-none focus:border-navy"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-background border border-border overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`cursor-pointer px-3.5 py-2 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-colors ${
                  filter === f.key
                    ? "bg-background-elevated text-foreground shadow-sm"
                    : "text-foreground-muted hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 lg:px-10 lg:pb-12">
        {filteredEntries.length === 0 ? (
          <div className="text-center text-[13.5px] text-foreground-muted py-16">কোনো রিপোর্ট খুঁজে পাওয়া যায়নি।</div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredEntries.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="cursor-pointer px-5 py-2.5 rounded-xl border border-border bg-background-elevated text-[13px] font-semibold text-foreground hover:border-navy/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingMore ? "লোড হচ্ছে..." : "আরও দেখুন"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
