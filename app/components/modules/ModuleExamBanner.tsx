import Link from "next/link";
import type { ExamStatus } from "../../lib/moduleProgress";
import type { ModuleExam } from "../../lib/types";
import { AwardIcon, CalendarIcon, CheckCircleIcon, LockIcon, SparkleIcon, XIcon } from "../icons";

const STATUS_COPY: Record<ExamStatus, { description: string; cta: string }> = {
  ready: {
    description:
      "সব অধ্যায় সম্পন্ন হয়েছে! মডিউলটি শেষ করতে ৬০ সেকেন্ডের রোলপ্লে পরীক্ষায় অংশ নিন।",
    cta: "এক্সাম শুরু করুন",
  },
  passed: {
    description:
      "অভিনন্দন! আপনি ইতিমধ্যে এই পরীক্ষায় সফলভাবে উত্তীর্ণ হয়েছেন।",
    cta: "রিপোর্ট দেখুন",
  },
  failed: {
    description: "দুঃখিত, আপনি এই পরীক্ষায় পাস মার্ক অর্জন করতে পারেননি। আবার চেষ্টা করুন।",
    cta: "আবার চেষ্টা করুন",
  },
  locked: {
    description: "এই পরীক্ষা শুরু করতে আগে মডিউলের সব অধ্যায় সম্পন্ন করুন।",
    cta: "প্রিরিকুইজিট ফুলফিল করুন",
  },
};

// Only shown once the trainee has an actual result — "ready"/"locked" have
// no pass/fail verdict yet.
const RESULT_BADGE: Partial<Record<ExamStatus, { label: string; badgeClass: string; Icon: typeof CheckCircleIcon }>> = {
  passed: { label: "পাসড", badgeClass: "bg-success text-white", Icon: CheckCircleIcon },
  failed: { label: "ব্যর্থ", badgeClass: "bg-error text-error-ink", Icon: XIcon },
};

export function ModuleExamBanner({
  exam,
  status,
  moduleSlug,
}: {
  exam: ModuleExam;
  status: ExamStatus;
  moduleSlug: string;
}) {
  const copy = STATUS_COPY[status];
  const locked = status === "locked";
  const passed = status === "passed";
  const resultBadge = RESULT_BADGE[status];
  const ctaHref = passed
    ? `/modules/${moduleSlug}/exam/record/report`
    : `/modules/${moduleSlug}/exam`;

  return (
    <div className="rounded-2xl border border-accent/30 bg-gradient-to-r from-accent-soft to-background-elevated p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
          <AwardIcon size={22} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[12.5px] mb-1 flex-wrap">
            <span className="font-bold text-accent">চূড়ান্ত মূল্যায়ন</span>
            {exam.dueDate && (
              <>
                <span aria-hidden className="text-foreground-muted">
                  •
                </span>
                <span className="flex items-center gap-1 text-foreground-muted">
                  <CalendarIcon size={13} />
                  Deadline: {exam.dueDate}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className="font-display font-bold text-[17px] text-foreground">{exam.title}</div>
            {resultBadge && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${resultBadge.badgeClass}`}
              >
                <resultBadge.Icon size={12} />
                {resultBadge.label}
                {exam.bestScore !== null ? ` (${exam.bestScore}%)` : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {locked ? (
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full font-display font-semibold text-[13.5px] shrink-0 bg-border text-foreground-muted cursor-not-allowed w-full sm:w-auto"
        >
          <LockIcon size={14} />
          {copy.cta}
        </button>
      ) : (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full font-display font-semibold text-[13.5px] shrink-0 bg-accent text-accent-ink cursor-pointer w-full sm:w-auto"
        >
          <SparkleIcon size={14} />
          {copy.cta}
        </Link>
      )}
    </div>
  );
}
