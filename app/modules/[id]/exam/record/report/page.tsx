"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, CheckCircleIcon, XIcon } from "../../../../../components/icons";
import { getCategoryIcon } from "../../../../../lib/categoryIcon";
import { examReportCacheKey, readCachedExamReport } from "../../../../../lib/examReportCache";

const RING_RADIUS = 78;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ModuleExamReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report] = useState(() => readCachedExamReport(examReportCacheKey(id)));

  const moduleHref = `/modules/${id}`;
  const examRecordHref = `${moduleHref}/exam/record`;

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">কোনো রিপোর্ট পাওয়া যায়নি।</p>
        <Link href={moduleHref} className="text-[13px] font-semibold text-navy cursor-pointer">
          মডিউলে ফিরে যান
        </Link>
      </div>
    );
  }

  const { result, moduleTitle, examTitle, passMark, passed } = report;
  const dashOffset = CIRCUMFERENCE * (1 - result.overall / 100);
  const ringColor = passed ? "var(--success)" : "var(--accent)";

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex items-center gap-3 px-4 py-4 lg:px-10 lg:py-6 border-b border-border">
        <Link
          href={moduleHref}
          aria-label="ফিরে যান"
          className="w-8 h-8 flex items-center justify-center text-navy cursor-pointer shrink-0"
        >
          <ArrowLeftIcon size={18} />
        </Link>
        <h1 className="flex-1 text-center font-display font-bold text-[16px] lg:text-[18px] text-navy pr-8">
          এক্সাম রিপোর্ট বিস্তারিত
        </h1>
      </div>

      <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10 flex justify-center">
        <div className="w-full max-w-[480px] lg:max-w-[760px] flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-background-elevated p-5 lg:p-8 flex flex-col items-center gap-3 text-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                passed ? "bg-success text-white" : "bg-accent-soft text-accent"
              }`}
            >
              {passed ? <CheckCircleIcon size={12} /> : <XIcon size={12} />}
              {passed ? `পাসড (${result.overall}%)` : `অকৃতকার্য (${result.overall}%)`}
            </span>
            <h2 className="font-display font-bold text-[20px] lg:text-[26px] text-foreground">{examTitle}</h2>
            <p className="text-[13px] text-foreground-muted">মডিউল: {moduleTitle}</p>

            <div className="w-full h-px bg-border my-2" />

            <div className="relative w-[180px] h-[180px] lg:w-[200px] lg:h-[200px] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r={RING_RADIUS} fill="none" stroke="var(--border)" strokeWidth="12" />
                <circle
                  cx="90"
                  cy="90"
                  r={RING_RADIUS}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 90 90)"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display font-bold text-[40px] lg:text-[46px] leading-none" style={{ color: ringColor }}>
                  {result.overall}
                </span>
                <span className="text-[12px] text-foreground-muted mt-1">/100</span>
              </div>
            </div>
            <div className="text-[13px] font-semibold text-foreground-muted">
              ওভারঅল স্কোর • পাস মার্ক: <span className="font-bold text-foreground">{passMark}%</span>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-[15px] text-foreground mb-3">স্কোর ব্রেকডাউন</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
              {result.categories.map((cat) => {
                const Icon = getCategoryIcon(cat.name);
                const strong = cat.score >= 80;
                return (
                  <div
                    key={cat.name}
                    className="rounded-2xl border border-border bg-background-elevated p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-[13.5px] text-foreground">{cat.name}</span>
                      <div className="w-8 h-8 rounded-full bg-navy-soft text-navy flex items-center justify-center shrink-0">
                        <Icon size={15} />
                      </div>
                    </div>
                    <div className={`font-display font-bold text-[26px] ${strong ? "text-navy" : "text-accent"}`}>
                      {cat.score}%
                    </div>
                    <p className="text-[12.5px] text-foreground-muted italic leading-relaxed">&ldquo;{cat.feedback}&rdquo;</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 pt-2">
            {!passed && (
              <Link
                href={examRecordHref}
                className="w-full max-w-[320px] text-center px-5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-[14px] cursor-pointer"
              >
                আবার চেষ্টা করুন
              </Link>
            )}
            <Link
              href={moduleHref}
              className="w-full max-w-[320px] text-center px-5 py-3 rounded-xl border-[1.5px] border-navy text-navy font-display font-semibold text-[14px] cursor-pointer"
            >
              মডিউলে ফিরে যান
            </Link>
            <Link href="/exams" className="text-[13.5px] font-semibold text-navy cursor-pointer">
              সকল এক্সাম দেখুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
