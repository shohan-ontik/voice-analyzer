"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { ModuleExamBanner } from "./components/ModuleExamBanner";
import { dashboardUser, upcomingExam } from "./lib/dashboardData";
import { authFetch } from "./lib/clientFetch";
import { chapterHeadline } from "./lib/chapterHeadline";
import {
  getChapterProgress,
  getCurrentChapter,
  getExamStatus,
  getModuleStatus,
  pickContinueModule,
} from "./lib/moduleProgress";
import type { ModuleChapter, StatsSummary } from "./lib/types";
import { useModules } from "./lib/useModules";

const CONTINUE_STATUS_BADGE: Record<"in_progress" | "not_started", string> = {
  in_progress: "চলমান (IN PROGRESS)",
  not_started: "শুরু করুন (START NOW)",
};

function chapterMaterialsMeta(chapter: ModuleChapter) {
  const videoCount = chapter.materials.filter((m) => m.type === "video").length;
  const guideCount = chapter.materials.filter((m) => m.type === "pdf").length;
  const audioCount = chapter.materials.filter((m) => m.type === "audio").length;

  return [
    videoCount ? `${videoCount}টি ভিডিও` : null,
    guideCount ? `${guideCount}টি পিডিএফ গাইড` : null,
    audioCount ? `${audioCount}টি অডিও` : null,
  ]
    .filter(Boolean)
    .join("  •  ");
}

type StatTone = "teal" | "navy" | "success" | "accent";

const STAT_ICONS: Record<"book" | "zap" | "award" | "chart", typeof BookIcon> = {
  book: BookIcon,
  zap: ZapIcon,
  award: AwardIcon,
  chart: BarChartIcon,
};

const STAT_TONE_CLASSES: Record<StatTone, { badge: string; text: string }> = {
  teal: { badge: "bg-teal-soft", text: "text-teal" },
  navy: { badge: "bg-navy-soft", text: "text-navy" },
  success: { badge: "bg-success-soft", text: "text-success" },
  accent: { badge: "bg-accent-soft", text: "text-accent" },
};

const STAT_CARDS: {
  key: keyof StatsSummary;
  label: string;
  suffix?: string;
  icon: "book" | "zap" | "award" | "chart";
  tone: StatTone;
}[] = [
  { key: "completedModules", label: "কমপ্লিট মডিউল", icon: "book", tone: "teal" },
  { key: "totalSessions", label: "প্র্যাকটিস পিচ", icon: "zap", tone: "navy" },
  { key: "passedExams", label: "পাস করা এক্সাম", icon: "award", tone: "success" },
  { key: "averageScore", label: "আভারেজ স্কোর", suffix: "%", icon: "chart", tone: "accent" },
];

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const { modules, error: modulesError } = useModules();

  useEffect(() => {
    let cancelled = false;

    authFetch("/api/sessions/stats")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && !cancelled) setStats(body as StatsSummary);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const continueModule = modules ? pickContinueModule(modules) : null;
  const currentChapter = continueModule ? getCurrentChapter(continueModule) : null;
  const continueProgress = continueModule ? getChapterProgress(continueModule) : null;
  const continueProgressPercent = continueProgress && continueProgress.total > 0
    ? Math.round((continueProgress.completed / continueProgress.total) * 100)
    : 0;

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
        {STAT_CARDS.map((stat) => {
          const Icon = STAT_ICONS[stat.icon];
          const tone = STAT_TONE_CLASSES[stat.tone];
          const value = stats === null ? "…" : ((stats[stat.key] as number | null) ?? 0);
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
                  {value}
                  {stat.suffix && value !== "…" && (
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

          {modulesError ? (
            <div className="text-[13.5px] text-red-600 py-6 text-center">{modulesError}</div>
          ) : !modules ? (
            <div className="text-[13.5px] text-foreground-muted py-6 text-center">লোড হচ্ছে…</div>
          ) : !continueModule ? (
            <div className="text-[13.5px] text-foreground-muted py-6 text-center">
              অভিনন্দন! আপনি সব মডিউল সম্পন্ন করেছেন। নতুন মডিউলের জন্য অপেক্ষা করুন।
            </div>
          ) : (
            <>
              <div className="flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- placeholder thumbnail from an external stub image host */}
                <img
                  src={continueModule.thumbnailUrl ?? undefined}
                  alt=""
                  className="w-[110px] h-[110px] rounded-xl object-cover shrink-0 bg-border"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-navy-soft text-navy text-[11px] font-bold">
                      {CONTINUE_STATUS_BADGE[getModuleStatus(continueModule) as "in_progress" | "not_started"]}
                    </span>
                    <span className="text-[12px] text-foreground-muted">• মডিউল {continueModule.order + 1}</span>
                  </div>
                  <div className="font-display font-bold text-[16px] text-foreground mb-1.5">
                    {continueModule.title}
                  </div>
                  <p className="text-[13px] text-foreground-muted leading-relaxed mb-3 line-clamp-2">
                    {continueModule.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-navy"
                        style={{ width: `${continueProgressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground-muted shrink-0">
                      অগ্রগতি (অধ্যায় {continueProgress?.completed} / {continueProgress?.total}) ·{" "}
                      {continueProgressPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {currentChapter ? (
                <div className="rounded-xl bg-background border border-border p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-navy text-navy-ink flex items-center justify-center font-display font-bold text-[14px] shrink-0">
                      {currentChapter.order + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-foreground-muted mb-0.5">
                        বর্তমান অধ্যায়
                      </div>
                      <div className="font-semibold text-[14px] text-foreground truncate">
                        {chapterHeadline(currentChapter.title)}
                      </div>
                      <div className="text-[12px] text-foreground-muted">
                        {chapterMaterialsMeta(currentChapter)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Link
                      href={`/modules/${continueModule.slug}/chapters/${currentChapter.slug}`}
                      className="cursor-pointer px-4 py-2.5 rounded-lg border-[1.5px] border-border text-foreground font-display font-semibold text-[13px]"
                    >
                      কনটেন্ট দেখুন
                    </Link>
                    <Link
                      href={`/modules/${continueModule.slug}/chapters/${currentChapter.slug}/roleplay`}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-navy text-navy-ink font-display font-semibold text-[13px]"
                    >
                      <SparkleIcon size={13} />
                      পিচ প্র্যাকটিস
                    </Link>
                  </div>
                </div>
              ) : (
                <ModuleExamBanner
                  exam={continueModule.exam}
                  status={getExamStatus(continueModule)}
                  moduleSlug={continueModule.slug}
                />
              )}
            </>
          )}
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
