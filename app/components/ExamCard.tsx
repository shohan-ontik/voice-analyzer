import Link from "next/link";
import { CalendarIcon, CheckCircleIcon, ClockIcon, LockIcon, SparkleIcon } from "./icons";
import type { ExamStatus, ModuleExam } from "../lib/examsData";

const STATUS_META: Record<ExamStatus, { label: string; badgeClass: string; Icon: typeof CheckCircleIcon }> = {
  passed: { label: "পাসড", badgeClass: "bg-success text-white", Icon: CheckCircleIcon },
  ready: { label: "এক্সামের জন্য রেডি", badgeClass: "bg-warning-soft text-warning-ink", Icon: ClockIcon },
  locked: { label: "লকড", badgeClass: "bg-border text-foreground-muted", Icon: LockIcon },
};

export function ExamCard({ exam }: { exam: ModuleExam }) {
  const meta = STATUS_META[exam.status];
  const badgeLabel = exam.status === "passed" ? `${meta.label} (${exam.score}%)` : meta.label;

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.badgeClass}`}
        >
          <meta.Icon size={12} />
          {badgeLabel}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-foreground-muted">
          <CalendarIcon size={13} />
          শেষ তারিখ: {exam.dueDate}
        </span>
      </div>

      <div>
        <div className="font-display font-bold text-[17px] text-foreground mb-1">{exam.title}</div>
        <div className="text-[13px] font-semibold text-navy mb-2">{exam.moduleLabel}</div>
        <p className="text-[13px] text-foreground-muted leading-relaxed line-clamp-2">{exam.scenario}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 flex-wrap gap-3">
        <span className="text-[12.5px] text-foreground-muted">
          পাস মার্ক: <span className="font-semibold text-foreground">{exam.passMark}%</span>
        </span>

        {exam.status === "passed" && exam.report && (
          <Link
            href={`/exams/${exam.id}/report`}
            className="px-4 py-2.5 rounded-lg bg-success text-white font-display font-semibold text-[13px]"
          >
            পাসড রিপোর্ট দেখুন
          </Link>
        )}

        {exam.status === "locked" && (
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-border text-foreground-muted font-display font-semibold text-[13px] cursor-not-allowed"
          >
            <LockIcon size={13} />
            প্রিরিকুইজিট ফুলফিল করুন
          </button>
        )}

        {exam.status === "ready" && (
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-navy text-navy-ink font-display font-semibold text-[13px]"
          >
            <SparkleIcon size={13} />
            এক্সাম শুরু করুন
          </button>
        )}
      </div>
    </div>
  );
}
