"use client";

import { useState } from "react";
import { authFetch } from "../../lib/clientFetch";
import { getModuleStatus, type ModuleStatus } from "../../lib/moduleProgress";
import type { TrainingModuleSummary } from "../../lib/types";
import { RefreshIcon, SearchIcon } from "../icons";
import { ModuleCard } from "./ModuleCard";

type FilterKey = "all" | ModuleStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "সকল মডিউল" },
  { key: "in_progress", label: "চলমান" },
  { key: "completed", label: "কমপ্লিট" },
  { key: "not_started", label: "স্টার্ট হয়নি" },
];

export function ModulesFilters({
  initialModules,
  initialTotal,
  pageSize,
}: {
  initialModules: TrainingModuleSummary[];
  initialTotal: number;
  pageSize: number;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const [modules, setModules] = useState(initialModules);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hasMore = modules.length < total;

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setLoadError(null);
    const nextPage = page + 1;
    try {
      const res = await authFetch(
        `/api/modules?page=${nextPage}&pageSize=${pageSize}`,
      );
      const body = await res.json();
      if (!res.ok)
        throw new Error(body?.error?.message ?? "মডিউল লোড করা যায়নি।");
      setModules((prev) => [
        ...prev,
        ...(body.items as TrainingModuleSummary[]),
      ]);
      setTotal(body.total as number);
      setPage(nextPage);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "মডিউল লোড করা যায়নি।",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredModules = modules.filter((m) => {
    const matchesFilter = filter === "all" || getModuleStatus(m) === filter;
    const matchesQuery =
      query.trim() === "" ||
      m.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <div className="px-4 pt-6 pb-6 lg:px-10 lg:pt-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[22px] lg:text-[28px] text-foreground mb-1.5">
            সেলস ট্রেনিং মডিউল
          </h1>
          <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted max-w-[540px]">
            চ্যাপ্টারগুলো কমপ্লিট করুন, ট্রেনিং মেটেরিয়াল দেখুন এবং বাস্তবসম্মত
            এআই পিচ প্র্যাকটিস করুন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <SearchIcon
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="মডিউল বা টপিক সার্চ করুন..."
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
        {filteredModules.length === 0 ? (
          <div className="text-center text-[13.5px] text-foreground-muted py-16">
            কোনো মডিউল খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredModules.map((m) => (
              <ModuleCard key={m.id} module={m} />
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
              {loadingMore && (
                <RefreshIcon size={14} className="animate-spin" />
              )}
              {loadingMore ? "লোড হচ্ছে..." : "আরও দেখুন"}
            </button>
            {loadError && (
              <p className="text-[12.5px] text-error">{loadError}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
