import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterRow } from "../../components/ChapterRow";
import { ModuleExamBanner } from "../../components/ModuleExamBanner";
import { MODULE_STATUS_META } from "../../components/ModuleCard";
import { ArrowLeftIcon, AwardIcon, BookIcon } from "../../components/icons";
import { moduleExams } from "../../lib/examsData";
import { trainingModules } from "../../lib/modulesData";

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trainingModule = trainingModules.find((m) => m.id === id);
  if (!trainingModule) notFound();

  const meta = MODULE_STATUS_META[trainingModule.status];
  const progressPercent =
    trainingModule.totalChapters === 0
      ? 0
      : Math.round((trainingModule.completedChapters / trainingModule.totalChapters) * 100);
  const exam = trainingModule.examId ? moduleExams.find((e) => e.id === trainingModule.examId) : undefined;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 pt-6 lg:px-10 lg:pt-8">
        <Link
          href="/modules"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground-muted hover:text-foreground"
        >
          <ArrowLeftIcon size={15} />
          সকল মডিউল ফিরে যান
        </Link>
      </div>

      <div className="px-4 pt-4 pb-6 lg:px-10 lg:pb-8">
        <div className="rounded-2xl border border-border bg-background-elevated overflow-hidden">
          <div className="relative h-[200px] lg:h-[280px] bg-border">
            {/* eslint-disable-next-line @next/next/no-img-element -- placeholder thumbnail from an external stub image host */}
            <img src={trainingModule.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="p-5 lg:p-8">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold mb-3 ${meta.badgeClass}`}
            >
              <meta.Icon size={12} />
              {meta.label}
            </span>

            <h1 className="font-display font-bold text-[22px] lg:text-[28px] text-foreground mb-3 leading-tight">
              {trainingModule.title}
            </h1>

            <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted leading-relaxed max-w-[760px]">
              {trainingModule.description}
            </p>

            <div className="h-px bg-border my-5" />

            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12.5px] font-semibold text-foreground-muted">মডিউলের সার্বিক অগ্রগতি</span>
                  <span className="text-[13px] font-bold text-navy">{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div className={`h-full rounded-full ${meta.barClass}`} style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-[12.5px] text-foreground-muted shrink-0">
                <span className="flex items-center gap-1.5">
                  <BookIcon size={14} />
                  {trainingModule.totalChapters}টি অধ্যায়
                </span>
                {exam && (
                  <span className="flex items-center gap-1.5">
                    <AwardIcon size={14} />
                    ১টি চূড়ান্ত পরীক্ষা
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 lg:px-10 lg:pb-12">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="font-display font-bold text-[17px] lg:text-[19px] text-foreground">পাঠ্যক্রমের অধ্যায়সমূহ</h2>
          <span className="text-[12.5px] text-foreground-muted">
            পড়াশোনা ও অনুশীলনের জন্য যেকোনো অধ্যায়ে ট্যাপ করুন
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {trainingModule.chapters.map((chapter) => (
            <ChapterRow key={chapter.id} moduleId={trainingModule.id} chapter={chapter} />
          ))}

          {exam && <ModuleExamBanner exam={exam} />}
        </div>
      </div>
    </div>
  );
}
