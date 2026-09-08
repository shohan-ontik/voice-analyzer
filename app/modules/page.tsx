"use client";

import { useState } from "react";
import { ModuleCard } from "../components/ModuleCard";
import { SearchIcon } from "../components/icons";
import { getModuleStatus, type ModuleStatus } from "../lib/moduleProgress";
import { useModules } from "../lib/useModules";

type FilterKey = "all" | ModuleStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "সকল মডিউল" },
  { key: "in_progress", label: "চলমান" },
  { key: "completed", label: "কমপ্লিট" },
  { key: "not_started", label: "স্টার্ট হয়নি" },
];

export default function ModulesPage() {
  const { modules, error } = useModules();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filteredModules = (modules ?? []).filter((m) => {
    const matchesFilter = filter === "all" || getModuleStatus(m) === filter;
    const matchesQuery = query.trim() === "" || m.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 pt-6 pb-6 lg:px-10 lg:pt-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[22px] lg:text-[28px] text-foreground mb-1.5">
            সেলস ট্রেনিং মডিউল
          </h1>
          <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted max-w-[540px]">
            চ্যাপ্টারগুলো কমপ্লিট করুন, ট্রেনিং মেটেরিয়াল দেখুন এবং বাস্তবসম্মত এআই পিচ প্র্যাকটিস করুন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <SearchIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
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
                className={`px-3.5 py-2 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-colors ${
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
        {error ? (
          <div className="text-center text-[13.5px] text-red-600 py-16">{error}</div>
        ) : !modules ? (
          <div className="text-center text-[13.5px] text-foreground-muted py-16">লোড হচ্ছে…</div>
        ) : filteredModules.length === 0 ? (
          <div className="text-center text-[13.5px] text-foreground-muted py-16">
            কোনো মডিউল খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((m) => (
              <ModuleCard key={m.id} module={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
