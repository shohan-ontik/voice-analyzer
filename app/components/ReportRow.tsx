import Link from "next/link";
import { ArrowRightIcon } from "./icons";
import type { EvaluationReport, ReportKind } from "../lib/reportsData";

const KIND_META: Record<ReportKind, { label: string; badgeClass: string }> = {
  practice: { label: "প্র্যাকটিস পিচ", badgeClass: "bg-navy-soft text-navy" },
  exam: { label: "মডিউল এক্সাম", badgeClass: "bg-warning-soft text-warning-ink" },
};

export function ReportRow({ report }: { report: EvaluationReport }) {
  const meta = KIND_META[report.kind];

  return (
    <Link
      href={`/history/${report.id}`}
      className="rounded-2xl border border-border bg-background-elevated p-5 flex items-center gap-5 flex-wrap cursor-pointer hover:border-navy/30 transition-colors"
    >
      <div className="w-14 h-14 rounded-2xl border-2 border-success bg-success-soft flex flex-col items-center justify-center shrink-0">
        <span className="font-display font-bold text-lg text-success leading-none">{report.score}</span>
        <span className="text-[10px] text-success leading-none mt-0.5">/100</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.badgeClass}`}>{meta.label}</span>
          <span className="text-[12px] text-foreground-muted">• {report.date}</span>
        </div>
        <div className="font-display font-bold text-[16px] text-foreground mb-1">{report.title}</div>
        {report.chapter && <div className="text-[12.5px] text-foreground-muted mb-1">{report.chapter}</div>}
        <p className="text-[12.5px] text-foreground-muted leading-relaxed truncate">&ldquo;{report.feedback}&rdquo;</p>
      </div>

      <span className="flex items-center gap-1 text-[13px] font-bold text-navy shrink-0">
        ফুল রিপোর্ট দেখুন
        <ArrowRightIcon size={14} />
      </span>
    </Link>
  );
}
