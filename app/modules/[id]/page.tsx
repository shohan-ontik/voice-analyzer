import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ModuleExamBanner } from "../../components/modules/ModuleExamBanner";
import { ChapterRow } from "../../components/modules/ChapterRow";
import { MODULE_STATUS_META } from "../../components/modules/ModuleCard";
import { ArrowLeftIcon, AwardIcon, BookIcon } from "../../components/icons";
import { ApiClientError, getModule } from "../../lib/apiClient";
import { getChapterProgress, getChapterStatus, getExamStatus, getModuleStatus } from "../../lib/moduleProgress";
import { getSessionToken } from "../../lib/session";
import type { TrainingModule } from "../../lib/types";

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const token = await getSessionToken();
  if (!token) redirect("/login");

  let trainingModule: TrainingModule;
  try {
    trainingModule = await getModule(token, id);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) notFound();
    if (err instanceof ApiClientError && err.status === 401) redirect("/login");
    throw err;
  }

  const meta = MODULE_STATUS_META[getModuleStatus(trainingModule)];
  const { completed, total } = getChapterProgress(trainingModule);
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const examStatus = getExamStatus(trainingModule);

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
            <img src={trainingModule.thumbnailUrl ?? undefined} alt="" className="w-full h-full object-cover" />
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
                  {total}টি অধ্যায়
                </span>
                <span className="flex items-center gap-1.5">
                  <AwardIcon size={14} />
                  ১টি চূড়ান্ত পরীক্ষা
                </span>
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
          {trainingModule.chapters.map((chapter, index) => (
            <ChapterRow
              key={chapter.id}
              moduleId={trainingModule.slug}
              chapter={chapter}
              status={getChapterStatus(trainingModule, index)}
            />
          ))}

          <ModuleExamBanner exam={trainingModule.exam} status={examStatus} moduleSlug={trainingModule.slug} />
        </div>
      </div>
    </div>
  );
}
