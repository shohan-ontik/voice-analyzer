"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  AwardIcon,
  CalendarIcon,
  MicIcon,
  SparkleIcon,
  TrendingUpIcon,
  ZapIcon,
} from "./icons";

const WAVE_HEIGHTS = [35, 65, 100, 55, 80, 40, 90, 50, 70, 30];

const STATS = [
  {
    icon: MicIcon,
    title: "যেকোনো সময় প্র্যাকটিস",
    subtitle: "২৪/৭ ক্লায়েন্ট সিমুলেশন",
  },
  {
    icon: ZapIcon,
    title: "তাৎক্ষণিক স্কোর",
    subtitle: "ট্যাকটিক্যাল ফিডব্যাক",
  },
  {
    icon: CalendarIcon,
    title: "মাসে ১২৫টি পিচ",
    subtitle: "প্র্যাকটিসের সুযোগ",
  },
];

export function WelcomeScreen({
  name,
  mustChangePassword,
}: Readonly<{
  name?: string;
  mustChangePassword?: boolean;
}>) {
  const router = useRouter();

  return (
    <div className="flex-1 bg-background px-4 py-6 lg:px-10 lg:py-10">
      <div className="max-w-[1080px] mx-auto flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-14">
        <div className="w-full lg:max-w-[440px] shrink-0">
          <div className="relative rounded-2xl bg-navy-soft border border-navy/15 p-8 lg:p-10 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent-soft/70 blur-2xl" />
            <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full bg-teal-soft/70 blur-2xl" />

            <div className="relative flex flex-col items-center gap-6">
              <div className="w-full flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center -rotate-6">
                  <AwardIcon size={18} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning-ink flex items-center justify-center rotate-6">
                  <SparkleIcon size={18} />
                </div>
              </div>

              <div className="w-20 h-20 rounded-full bg-navy text-navy-ink flex items-center justify-center shadow-lg shadow-navy/20">
                <MicIcon size={32} />
              </div>

              <div className="flex items-end gap-1 h-8">
                {WAVE_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-navy/45"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="w-full flex items-end justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-soft text-teal flex items-center justify-center rotate-6">
                  <TrendingUpIcon size={18} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center -rotate-6">
                  <AwardIcon size={18} />
                </div>
              </div>
            </div>

            <div className="relative mt-7 mx-auto w-full max-w-[280px] bg-background-elevated border border-border rounded-full px-4 py-2.5 flex items-center gap-2 text-[12px] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-navy shrink-0" />
              <span className="text-foreground-muted truncate flex-1">
                লাইভ AI সিমুলেশনে প্র্যাকটিস করুন
              </span>
              <span className="text-navy font-display font-bold shrink-0">
                Live AI
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div>
            {name && (
              <div className="font-display font-bold text-[13.5px] text-navy mb-2">
                স্বাগতম, {name}! 👋
              </div>
            )}
            <h1 className="font-display font-bold text-[26px] lg:text-[34px] text-foreground leading-tight">
              প্রতিটি পিচে দক্ষ হোন।
            </h1>
            <h1 className="font-display font-bold text-[26px] lg:text-[34px] text-navy leading-tight">
              আপনার আয় বাড়ান।
            </h1>
            <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted mt-3 leading-relaxed max-w-[480px]">
              বাস্তবসম্মত ক্লায়েন্ট পরিস্থিতিতে প্র্যাকটিস করুন, তাৎক্ষণিক AI
              ফিডব্যাক পান এবং দ্রুত আপনার সেলস কোটা অর্জন করুন।
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-[480px]">
            {STATS.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl bg-background-elevated border border-border p-3.5 flex flex-col items-center text-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-navy-soft text-navy flex items-center justify-center">
                  <stat.icon size={16} />
                </div>
                <div className="font-display font-bold text-[12.5px] text-foreground leading-tight">
                  {stat.title}
                </div>
                <div className="text-[11px] text-foreground-muted leading-tight">
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>

          {mustChangePassword && (
            <div className="rounded-xl bg-warning-soft text-warning-ink text-[13px] px-4 py-3.5 flex items-center justify-between gap-4 flex-wrap max-w-[480px]">
              <span>
                আপনি এখনও টেম্পোরারি পাসওয়ার্ড ব্যবহার করছেন — এখনই পরিবর্তন
                করুন।
              </span>
              <Link
                href="/profile/password"
                className="font-display font-semibold whitespace-nowrap"
              >
                পরিবর্তন করুন
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-3 max-w-[480px]">
            <button
              type="button"
              onClick={() => router.push("/record")}
              className="w-full py-4 rounded-xl bg-navy text-navy-ink font-display font-semibold text-[15px] flex items-center justify-center gap-2 hover:-translate-y-px transition-transform"
            >
              আপনার প্রথম প্র্যাকটিস শুরু করুন
              <ArrowRightIcon size={16} />
            </button>
            <Link
              href="/modules"
              className="text-center text-[13px] text-foreground-muted"
            >
              আগে থেকেই কোনো অ্যাসাইনমেন্ট আছে?{" "}
              <span className="text-navy font-semibold">মডিউল দেখুন</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
