import Link from "next/link";
import { CalendarIcon, CheckCircleIcon, ClockIcon, LockIcon, SparkleIcon } from "./icons";
import type { ExamStatus } from "../lib/moduleProgress";
import type { ModuleExam } from "../lib/types";

const STATUS_META: Record<ExamStatus, { label: string; badgeClass: string; Icon: typeof CheckCircleIcon }> = {
  passed: { label: "পাসড", badgeClass: "bg-success text-white", Icon: CheckCircleIcon },
  ready: { label: "এক্সামের জন্য রেডি", badgeClass: "bg-warning-soft text-warning-ink", Icon: ClockIcon },
  locked: { label: "লকড", badgeClass: "bg-border text-foreground-muted", Icon: LockIcon },
};

export function ExamCard({
  exam,
  status,
  moduleSlug,
}: {
  exam: ModuleExam;
  status: ExamStatus;
  moduleSlug: string;
}) {
  const meta = STATUS_META[status];
  const badgeLabel = status === "passed" && exam.bestScore !== null ? `${meta.label} (${exam.bestScore}%)` : meta.label;

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.badgeClass}`}
        >
          <meta.Icon size={12} />
          {badgeLabel}
        </span>
        {exam.dueDate && (
          <span className="flex items-center gap-1.5 text-[12px] text-foreground-muted">
            <CalendarIcon size={13} />
            শেষ তারিখ: {exam.dueDate}
          </span>
        )}
      </div>

      <div>
        <div className="font-display font-bold text-[17px] text-foreground mb-1">{exam.title}</div>
        <div className="text-[13px] font-semibold text-navy mb-2">{exam.moduleLabel}</div>
        <p className="text-[13px] text-foreground-muted leading-relaxed line-clamp-2">{exam.scenario}</p>
      </div>

      <div className="h-px bg-border" />

      <div className="flex items-center justify-between mt-auto pt-2 flex-wrap gap-3">
        <span className="text-[12.5px] text-foreground-muted">
          পাস মার্ক: <span className="font-semibold text-foreground">{exam.passMark}%</span>
        </span>

        {status === "locked" && (
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-border text-foreground-muted font-display font-semibold text-[13px] cursor-not-allowed"
          >
            <LockIcon size={13} />
            প্রিরিকুইজিট ফুলফিল করুন
          </button>
        )}

        {status === "ready" && (
          <Link
            href={`/modules/${moduleSlug}/exam`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-navy text-navy-ink font-display font-semibold text-[13px] cursor-pointer"
          >
            <SparkleIcon size={13} />
            এক্সাম শুরু করুন
          </Link>
        )}

        {status === "passed" && (
          <Link
            href={`/modules/${moduleSlug}/exam/record/report`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-success text-white font-display font-semibold text-[13px] cursor-pointer"
          >
            <CheckCircleIcon size={13} />
            পাসড রিপোর্ট দেখুন
          </Link>
        )}
      </div>
    </div>
  );
}
