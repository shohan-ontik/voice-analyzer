"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, AwardIcon, ClockIcon, SparkleIcon, TargetIcon } from "../../../components/icons";
import { getExamStatus } from "../../../lib/moduleProgress";
import { useModule } from "../../../lib/useModules";

export default function ModuleExamPage() {
  const { id } = useParams<{ id: string }>();
  const { trainingModule, error, loading } = useModule(id);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-[13.5px] text-foreground-muted">লোড হচ্ছে…</div>;
  }

  if (error || !trainingModule) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">{error ?? "মডিউল খুঁজে পাওয়া যায়নি।"}</p>
        <Link href="/modules" className="text-[13px] font-semibold text-navy cursor-pointer">
          সকল মডিউল ফিরে যান
        </Link>
      </div>
    );
  }

  const status = getExamStatus(trainingModule);
  const exam = trainingModule.exam;

  if (status === "locked") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">এই পরীক্ষা শুরু করতে আগে মডিউলের সব অধ্যায় সম্পন্ন করুন।</p>
        <Link href={`/modules/${trainingModule.slug}`} className="text-[13px] font-semibold text-navy cursor-pointer">
          মডিউলে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 pt-6 lg:px-10 lg:pt-8 flex items-center gap-2 text-[13px] flex-wrap">
        <Link
          href={`/modules/${trainingModule.slug}`}
          className="flex items-center gap-1 font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
        >
          <ArrowLeftIcon size={14} />
          মডিউলে ফিরুন
        </Link>
      </div>

      <div className="px-4 pt-4 pb-8 lg:px-10 lg:pb-12 max-w-[820px]">
        <div className="rounded-2xl border border-border bg-background-elevated p-5 lg:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
              <AwardIcon size={17} />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-accent">চূড়ান্ত মূল্যায়ন পরীক্ষা</div>
              <div className="font-display font-bold text-[16px] text-foreground truncate">{exam.title}</div>
            </div>
          </div>

          <p className="text-[13px] font-semibold text-navy">{exam.moduleLabel}</p>

          <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
            <div className="text-[12px] font-bold text-navy">ক্লায়েন্টের প্রশ্ন</div>
            <p className="text-[13.5px] text-foreground italic leading-relaxed">&ldquo;{exam.scenario}&rdquo;</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap rounded-xl bg-background border border-border px-4 py-3 text-[12.5px]">
            <span className="flex items-center gap-1.5 text-foreground-muted">
              <ClockIcon size={14} />
              সর্বোচ্চ ৬০ সেকেন্ড রেকর্ডিং
            </span>
            <span className="flex items-center gap-1.5 text-foreground-muted">
              <TargetIcon size={14} />
              পাস মার্ক: <span className="font-semibold text-foreground">{exam.passMark}%</span>
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Link
              href={`/modules/${trainingModule.slug}/exam/record`}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-[13.5px] cursor-pointer"
            >
              <SparkleIcon size={15} />
              এক্সাম শুরু করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
