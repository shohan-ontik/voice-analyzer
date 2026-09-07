import Link from "next/link";
import { notFound } from "next/navigation";
import { SkillScoreRow } from "../../../components/SkillScoreRow";
import { ArrowLeftIcon, FileIcon, RefreshIcon, ShareIcon, SparkleIcon } from "../../../components/icons";
import { moduleExams } from "../../../lib/examsData";

const CIRCUMFERENCE = 2 * Math.PI * 58;

export default async function ExamReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = moduleExams.find((e) => e.id === id);
  if (!exam || !exam.report || exam.score === undefined) notFound();

  const { report } = exam;
  const offset = CIRCUMFERENCE * (1 - exam.score / 100);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 pt-6 lg:px-10 lg:pt-8">
        <Link
          href="/exams"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground-muted hover:text-foreground"
        >
          <ArrowLeftIcon size={14} />
          এক্সামসমূহে ফিরে যান
        </Link>
      </div>

      <div className="px-4 pt-4 pb-6 lg:px-10 lg:pb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12.5px] mb-2">
            <span className="px-2.5 py-1 rounded-full bg-navy-soft text-navy font-bold">মডিউল এক্সাম</span>
            <span className="text-foreground-muted">•</span>
            <span className="text-foreground-muted">{exam.dueDate === "Passed" ? "20/10/2023" : exam.dueDate}</span>
          </div>
          <h1 className="font-display font-bold text-[22px] lg:text-[28px] text-foreground mb-1.5">
            ইভালুয়েশন রিপোর্ট
          </h1>
          <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted">{report.moduleName}</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-[1.5px] border-border text-foreground font-display font-semibold text-[13px] shrink-0"
        >
          <ShareIcon size={15} />
          পিডিএফ এক্সপোর্ট
        </button>
      </div>

      <div className="px-4 pb-8 lg:px-10">
        <div className="rounded-2xl border border-border bg-background-elevated p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative w-[140px] h-[140px] shrink-0">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke="var(--navy)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display font-bold text-[32px] leading-none text-foreground">{exam.score}</div>
              <div className="text-[11px] text-foreground-muted mt-1">১০০ এর মধ্যে</div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-soft text-success text-[12px] font-bold mb-3">
              <SparkleIcon size={13} />
              গ্রেট পারফরম্যান্স! বেঞ্চমার্ক পাস করেছেন
            </span>
            <div className="font-display font-bold text-[19px] text-foreground mb-2">{report.verdictHeadline}</div>
            <p className="text-[13.5px] text-foreground-muted leading-relaxed">{report.feedback}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 lg:px-10 lg:pb-12">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="font-display font-bold text-[17px] text-foreground">স্কিলভিত্তিক স্কোর ব্রেকডাউন</h2>
          <span className="text-[12.5px] text-foreground-muted">
            {report.skills.length}টি প্রধান সেলস কম্পিটেন্সির ওপর ইভালুয়েটেড
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {report.skills.map((skill) => (
            <SkillScoreRow key={skill.label} skill={skill} />
          ))}
        </div>
      </div>

      <div className="px-4 pb-10 lg:px-10 lg:pb-12">
        <div className="rounded-2xl border border-border bg-background-elevated p-5 lg:p-6">
          <h2 className="font-display font-bold text-[16px] text-foreground mb-3">
            রেকর্ডকৃত বক্তব্যের ট্রান্সক্রিপ্ট
          </h2>
          <p className="text-[13.5px] text-foreground-muted leading-relaxed italic mb-5">
            &ldquo;{report.transcript}&rdquo;
          </p>

          <div className="h-px bg-border mb-5" />

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Link
              href="/record"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-sm"
            >
              <RefreshIcon size={16} />
              আবার প্র্যাকটিস করুন
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-[1.5px] border-border text-foreground font-display font-semibold text-sm"
            >
              <FileIcon size={16} />
              সকল রিপোর্ট দেখুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
