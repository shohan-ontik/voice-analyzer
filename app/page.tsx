"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  DotIcon,
  GraduationCapIcon,
  MicIcon,
  PlayIcon,
  SparkleIcon,
} from "./components/icons";
import { ModuleExamBanner } from "./components/modules/ModuleExamBanner";
import { authFetch } from "./lib/clientFetch";
import { dashboardUser, upcomingExam } from "./lib/dashboardData";
import {
  getChapterProgress,
  getCurrentChapter,
  getExamStatus,
  getModuleStatus,
  pickContinueModule,
} from "./lib/moduleProgress";
import type { AppUser } from "./lib/types";
import { useModules } from "./lib/useModules";

const CONTINUE_STATUS_BADGE: Record<"in_progress" | "not_started", string> = {
  in_progress: "চলমান",
  not_started: "শুরু করুন",
};

export default function Home() {
  return (
    <Suspense fallback={<div className="flex-1 bg-background" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modules, error: modulesError } = useModules();

  const [showWelcome] = useState(() => searchParams.get("firstLogin") === "1");
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    authFetch("/api/auth/me")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok) setUser(body);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!showWelcome) return;
    router.replace("/");
  }, [showWelcome, router]);

  const continueModule = modules ? pickContinueModule(modules) : null;
  const currentChapter = continueModule
    ? getCurrentChapter(continueModule)
    : null;
  const continueProgress = continueModule
    ? getChapterProgress(continueModule)
    : null;
  const continueProgressPercent =
    continueProgress && continueProgress.total > 0
      ? Math.round((continueProgress.completed / continueProgress.total) * 100)
      : 0;

  // if (!showWelcome) {
  //   return (
  //     <WelcomeScreen
  //       name={user?.name}
  //       mustChangePassword={user?.mustChangePassword}
  //     />
  //   );
  // }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="mx-4 mt-4 rounded-2xl border border-border bg-background-elevated p-5 lg:mx-0 lg:mt-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-10 lg:pt-10 lg:pb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="font-display font-bold text-[22px] lg:text-[30px] text-foreground mb-1.5">
            ওয়েলকাম, {user ? user.name.trim().split(/\s+/)[0] : "…"}! 👋
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

      <div className="px-4 pb-8 mt-5 lg:mt-0 lg:px-10 lg:pb-12 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 lg:gap-6 items-start">
        <div className="rounded-2xl border border-border bg-background-elevated p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCapIcon size={18} className="text-navy" />
              <span className="font-display font-bold text-[16px] text-foreground">
                লার্নিং কন্টিনিউ করুন
              </span>
            </div>
            {continueModule && (
              <span className="px-3 py-1 rounded-full bg-background border border-border text-foreground text-[11px] font-bold whitespace-nowrap">
                {
                  CONTINUE_STATUS_BADGE[
                    getModuleStatus(continueModule) as
                      | "in_progress"
                      | "not_started"
                  ]
                }
              </span>
            )}
          </div>

          {modulesError ? (
            <div className="text-[13.5px] text-red-600 py-6 text-center">
              {modulesError}
            </div>
          ) : !modules ? (
            <div className="text-[13.5px] text-foreground-muted py-6 text-center">
              লোড হচ্ছে…
            </div>
          ) : !continueModule ? (
            <div className="text-[13.5px] text-foreground-muted py-6 text-center">
              অভিনন্দন! আপনি সব মডিউল সম্পন্ন করেছেন। নতুন মডিউলের জন্য অপেক্ষা
              করুন।
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- placeholder thumbnail from an external stub image host */}
              <img
                src={continueModule.thumbnailUrl ?? undefined}
                alt=""
                className="w-full h-40 rounded-xl object-cover bg-border"
              />

              <div>
                <div className="font-display font-bold text-[18px] text-foreground mb-1.5">
                  {continueModule.title}
                </div>
                <p className="text-[13px] text-foreground-muted leading-relaxed mb-4 line-clamp-2">
                  মডিউল {continueModule.order + 1}: {continueModule.description}
                </p>

                <div className="flex items-center justify-between text-[13px] mb-2">
                  <span className="font-semibold text-foreground">
                    {continueProgressPercent}% সম্পন্ন
                  </span>
                  <span className="text-foreground-muted">
                    {(continueProgress?.total ?? 0) -
                      (continueProgress?.completed ?? 0)}
                    টি অধ্যায় বাকি
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden mb-5">
                  <div
                    className="h-full rounded-full bg-navy"
                    style={{ width: `${continueProgressPercent}%` }}
                  />
                </div>

                {currentChapter ? (
                  <div className="flex justify-end">
                    <Link
                      href={`/modules/${continueModule.slug}/chapters/${currentChapter.slug}`}
                      className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-[13.5px]"
                    >
                      রিজিউম করুন
                      <PlayIcon size={12} />
                    </Link>
                  </div>
                ) : (
                  <ModuleExamBanner
                    exam={continueModule.exam}
                    status={getExamStatus(continueModule)}
                    moduleSlug={continueModule.slug}
                  />
                )}
              </div>
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
