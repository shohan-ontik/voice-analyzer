import Link from "next/link";
import { AwardIcon, CalendarIcon, LockIcon, SparkleIcon } from "./icons";
import type { ModuleExam } from "../lib/examsData";

const STATUS_COPY: Record<ModuleExam["status"], { description: string; cta: string }> = {
  ready: {
    description: "সব অধ্যায় সম্পন্ন হয়েছে! মডিউলটি শেষ করতে ৬০ সেকেন্ডের রোলপ্লে পরীক্ষায় অংশ নিন।",
    cta: "এক্সাম শুরু করুন",
  },
  passed: {
    description: "অভিনন্দন! আপনি ইতিমধ্যে এই পরীক্ষায় সফলভাবে উত্তীর্ণ হয়েছেন।",
    cta: "পাসড রিপোর্ট দেখুন",
  },
  locked: {
    description: "এই পরীক্ষা শুরু করতে আগে মডিউলের সব অধ্যায় সম্পন্ন করুন।",
    cta: "প্রিরিকুইজিট ফুলফিল করুন",
  },
};

export function ModuleExamBanner({ exam }: { exam: ModuleExam }) {
  const copy = STATUS_COPY[exam.status];
  const locked = exam.status === "locked";

  return (
    <div className="rounded-2xl border border-accent/30 bg-gradient-to-r from-accent-soft to-background-elevated p-5 flex items-center gap-4 flex-wrap">
      <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
        <AwardIcon size={22} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[12.5px] mb-1 flex-wrap">
          <span className="font-bold text-accent">চূড়ান্ত মূল্যায়ন</span>
          <span aria-hidden className="text-foreground-muted">
            •
          </span>
          <span className="flex items-center gap-1 text-foreground-muted">
            <CalendarIcon size={13} />
            Deadline: {exam.dueDate}
          </span>
        </div>
        <div className="font-display font-bold text-[17px] text-foreground mb-1">{exam.title}</div>
        <p className="text-[13px] text-foreground-muted">{copy.description}</p>
      </div>

      {exam.status === "passed" && exam.report ? (
        <Link
          href={`/exams/${exam.id}/report`}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full font-display font-semibold text-[13.5px] shrink-0 bg-accent text-accent-ink"
        >
          <SparkleIcon size={14} />
          {copy.cta}
        </Link>
      ) : (
        <button
          type="button"
          disabled={locked}
          className={`inline-flex items-center gap-1.5 px-5 py-3 rounded-full font-display font-semibold text-[13.5px] shrink-0 ${
            locked ? "bg-border text-foreground-muted cursor-not-allowed" : "bg-accent text-accent-ink"
          }`}
        >
          {locked ? <LockIcon size={14} /> : <SparkleIcon size={14} />}
          {copy.cta}
        </button>
      )}
    </div>
  );
}
