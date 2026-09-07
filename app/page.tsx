"use client";

import { useRouter } from "next/navigation";
import {
  AwardIcon,
  BarChartIcon,
  BookIcon,
  CalendarIcon,
  CheckCircleIcon,
  DotIcon,
  MicIcon,
  SparkleIcon,
  ZapIcon,
} from "./components/icons";
import {
  continueLearningModule,
  dashboardStats,
  dashboardUser,
  upcomingExam,
  type DashboardStat,
} from "./lib/dashboardData";

const STAT_ICONS: Record<DashboardStat["icon"], typeof BookIcon> = {
  book: BookIcon,
  zap: ZapIcon,
  award: AwardIcon,
  chart: BarChartIcon,
};

const STAT_TONE_CLASSES: Record<DashboardStat["tone"], { badge: string; text: string }> = {
  teal: { badge: "bg-teal-soft", text: "text-teal" },
  navy: { badge: "bg-navy-soft", text: "text-navy" },
  success: { badge: "bg-success-soft", text: "text-success" },
  accent: { badge: "bg-accent-soft", text: "text-accent" },
};

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="mx-4 mt-4 rounded-2xl border border-border bg-background-elevated p-5 lg:mx-0 lg:mt-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-10 lg:pt-10 lg:pb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="font-display font-bold text-[22px] lg:text-[30px] text-foreground mb-1.5">
            ওয়েলকাম, {dashboardUser.firstName}! 👋
          </h1>
          <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted">
            {dashboardUser.role} • {dashboardUser.team}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/record")}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-navy text-navy-ink font-display font-semibold text-sm hover:-translate-y-px transition-transform"
          >
            <MicIcon size={16} />
            পিচ প্র্যাকটিস করুন
            <SparkleIcon size={14} />
          </button>
          <button
            type="button"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border-[1.5px] border-navy/20 bg-navy-soft text-navy font-display font-semibold text-sm"
          >
            <DotIcon size={9} />
            সক্রিয় প্রশিক্ষণ ট্র্যাক
          </button>
        </div>
      </div>

      <div className="px-4 pt-6 pb-6 lg:px-10 lg:pt-0 lg:pb-8 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {dashboardStats.map((stat) => {
          const Icon = STAT_ICONS[stat.icon];
          const tone = STAT_TONE_CLASSES[stat.tone];
          return (
            <div
              key={stat.key}
              className="rounded-2xl border border-border bg-background-elevated p-5 flex flex-col gap-3.5"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone.badge} ${tone.text}`}>
                <Icon size={19} />
              </div>

              <div>
                <div className="font-display font-bold text-[30px] leading-none text-foreground">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-[18px] font-semibold text-foreground-muted">{stat.suffix}</span>
                  )}
                </div>
                <div className="text-[12px] font-semibold text-foreground-muted mt-1.5 lg:whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-8 lg:px-10 lg:pb-12 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 lg:gap-6 items-start">
        <div className="rounded-2xl border border-border bg-background-elevated p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-navy" />
              <span className="font-display font-bold text-[16px] text-foreground">
                লার্নিং কন্টিনিউ করুন
              </span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/modules")}
              className="text-[13px] font-semibold text-navy flex items-center gap-1"
            >
              <span>সকল মডিউল দেখুন</span>
              <span aria-hidden>›</span>
            </button>
          </div>

          <div className="flex gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- placeholder thumbnail from an external stub image host */}
            <img
              src={continueLearningModule.thumbnailUrl}
              alt=""
              className="w-[110px] h-[110px] rounded-xl object-cover shrink-0 bg-border"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-navy-soft text-navy text-[11px] font-bold">
                  {continueLearningModule.statusBadge}
                </span>
                <span className="text-[12px] text-foreground-muted">
                  • {continueLearningModule.moduleLabel}
                </span>
              </div>
              <div className="font-display font-bold text-[16px] text-foreground mb-1.5">
                {continueLearningModule.title}
              </div>
              <p className="text-[13px] text-foreground-muted leading-relaxed mb-3">
                {continueLearningModule.description}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-navy"
                    style={{
                      width: `${continueLearningModule.progressPercent}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground-muted shrink-0">
                  {continueLearningModule.progressLabel} ·{" "}
                  {continueLearningModule.progressPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-background border border-border p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-navy text-navy-ink flex items-center justify-center font-display font-bold text-[14px] shrink-0">
                {continueLearningModule.currentChapter.number}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wide text-foreground-muted mb-0.5">
                  বর্তমান অধ্যায়
                </div>
                <div className="font-semibold text-[14px] text-foreground truncate">
                  {continueLearningModule.currentChapter.title}
                </div>
                <div className="text-[12px] text-foreground-muted">
                  {continueLearningModule.currentChapter.meta}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                className="px-4 py-2.5 rounded-lg border-[1.5px] border-border text-foreground font-display font-semibold text-[13px]"
              >
                কনটেন্ট দেখুন
              </button>
              <button
                type="button"
                onClick={() => router.push("/record")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-navy text-navy-ink font-display font-semibold text-[13px]"
              >
                <SparkleIcon size={13} />
                পিচ প্র্যাকটিস
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background-elevated p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-display font-bold text-[16px] text-foreground">
                আপকামিং এক্সাম
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-warning-soft text-warning-ink text-[11px] font-bold">
              {upcomingExam.urgencyBadge}
            </span>
          </div>

          <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-[12px] text-accent font-semibold">
              <CalendarIcon size={14} />
              শেষ তারিখ: {upcomingExam.dueDate}
            </div>
            <div>
              <div className="font-display font-bold text-[15px] text-foreground mb-1">
                {upcomingExam.title}
              </div>
              <p className="text-[13px] text-foreground-muted leading-relaxed">
                {upcomingExam.description}
              </p>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="text-foreground-muted">
                {upcomingExam.prerequisiteLabel}
              </span>
              <span className="flex items-center gap-1.5 text-success font-semibold">
                <CheckCircleIcon size={14} />
                {upcomingExam.prerequisiteStatus}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/exams")}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-navy text-warning font-display font-semibold text-sm"
          >
            <AwardIcon size={16} />
            এক্সামে যান
          </button>

          <button
            type="button"
            onClick={() => router.push("/history")}
            className="text-center text-[13px] font-semibold text-foreground-muted hover:text-foreground"
          >
            পূর্ববর্তী রিপোর্ট পর্যালোচনা
          </button>
        </div>
      </div>
    </div>
  );
}
