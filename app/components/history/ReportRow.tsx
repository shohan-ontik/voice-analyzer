import Link from "next/link";
import { ArrowRightIcon } from "../icons";
import type { EvaluationReport, ReportKind } from "../../lib/reportsData";

const KIND_META: Record<ReportKind, { label: string; badgeClass: string }> = {
  practice: { label: "প্র্যাকটিস পিচ", badgeClass: "bg-navy-soft text-navy" },
  exam: { label: "মডিউল এক্সাম", badgeClass: "bg-warning-soft text-warning-ink" },
};

export function ReportRow({ report }: { report: EvaluationReport }) {
  const meta = KIND_META[report.kind];
  const scoreBadgeClass = report.passed
    ? "border-success bg-success-soft text-success"
    : "border-error bg-error-soft text-error";
  const scoreTextClass = report.passed ? "text-success" : "text-error";

  return (
    <Link
      href={`/history/${report.id}`}
      className="rounded-2xl border border-border bg-background-elevated p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 cursor-pointer hover:border-navy/30 transition-colors"
    >
      <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
        <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${scoreBadgeClass}`}>
          <span className={`font-display font-bold text-lg leading-none ${scoreTextClass}`}>{report.score}</span>
          <span className={`text-[10px] leading-none mt-0.5 ${scoreTextClass}`}>/100</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.badgeClass}`}>{meta.label}</span>
            <span className="text-[12px] text-foreground-muted">• {report.date}</span>
          </div>
          <div className="font-display font-bold text-[16px] text-foreground mb-1">{report.title}</div>
          {report.chapter && <div className="text-[12.5px] text-foreground-muted mb-1">{report.chapter}</div>}
          <p className="text-[12.5px] text-foreground-muted leading-relaxed truncate">&ldquo;{report.feedback}&rdquo;</p>
        </div>
      </div>

      <span className="flex items-center gap-1 text-[13px] font-bold text-navy shrink-0 self-end sm:self-auto">
        ফুল রিপোর্ট দেখুন
        <ArrowRightIcon size={14} />
      </span>
    </Link>
  );
}
