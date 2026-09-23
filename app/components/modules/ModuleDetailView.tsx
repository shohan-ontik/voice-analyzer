"use client";

import { useCallback, useState } from "react";
import { chapterHeadline } from "../../lib/chapterHeadline";
import { authFetch } from "../../lib/clientFetch";
import {
  getChapterStatus,
  getCurrentChapter,
  getExamStatus,
  getModuleStatus,
} from "../../lib/moduleProgress";
import type { TrainingModule } from "../../lib/types";
import { MaterialsSection } from "../MaterialsSection";
import { RoleplayCtaBanner } from "../RoleplayCtaBanner";
import { AwardIcon, BookIcon } from "../icons";
import { ProgressBar } from "../shared/ProgressBar";
import { ChapterAccordionItem } from "./ChapterAccordionItem";
import { MODULE_STATUS_META } from "./ModuleCard";
import { ModuleExamBanner } from "./ModuleExamBanner";

export function ModuleDetailView({
  initialModule,
}: {
  initialModule: TrainingModule;
}) {
  const [trainingModule, setTrainingModule] = useState(initialModule);
  const [openChapterSlug, setOpenChapterSlug] = useState<string | null>(
    () => getCurrentChapter(initialModule)?.slug ?? null,
  );

  const refetch = useCallback(() => {
    authFetch(`/api/modules/${encodeURIComponent(trainingModule.slug)}`)
      .then(async (res) => {
        const body = await res.json();
        if (res.ok) setTrainingModule(body as TrainingModule);
      })
      .catch(() => {});
  }, [trainingModule.slug]);

  const handleMarkComplete = useCallback(
    (chapterSlug: string, materialId: string) => {
      authFetch(
        `/api/modules/${trainingModule.slug}/chapters/${chapterSlug}/materials/${materialId}/complete`,
        {
          method: "POST",
        },
      ).then((res) => {
        if (res.ok) refetch();
      });
    },
    [trainingModule.slug, refetch],
  );

  const meta = MODULE_STATUS_META[getModuleStatus(trainingModule)];
  const { chapterCount: total, progressPercent } = trainingModule;
  const examStatus = getExamStatus(trainingModule);

  return (
    <>
      <div className="px-4 pt-4 pb-6 lg:px-10 lg:pb-8">
        <div className="rounded-2xl border border-border bg-background-elevated overflow-hidden">
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
                  <span className="text-[12.5px] font-semibold text-foreground-muted">
                    মডিউলের সার্বিক অগ্রগতি
                  </span>
                  <span className="text-[13px] font-bold text-navy">
                    {progressPercent}%
                  </span>
                </div>
                <ProgressBar percent={progressPercent} fillClassName={meta.barClass} size="md" />
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
          <h2 className="font-display font-bold text-[17px] lg:text-[19px] text-foreground">
            পাঠ্যক্রমের অধ্যায়সমূহ
          </h2>
          <span className="text-[12.5px] text-foreground-muted">
            পড়াশোনা ও অনুশীলনের জন্য যেকোনো অধ্যায়ে ট্যাপ করুন
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {trainingModule.chapters.map((chapter, index) => {
            const status = getChapterStatus(trainingModule, index);
            const expanded = openChapterSlug === chapter.slug;
            const headline = chapterHeadline(chapter.title);
            const roleplayHref = `/modules/${trainingModule.slug}/chapters/${chapter.slug}/roleplay`;

            return (
              <ChapterAccordionItem
                key={chapter.id}
                chapter={chapter}
                status={status}
                expanded={expanded}
                onToggle={() =>
                  setOpenChapterSlug((current) =>
                    current === chapter.slug ? null : chapter.slug,
                  )
                }
              >
                <div className="p-5 flex flex-col gap-5 border-t border-blue-300">
                  <p className="text-[13px] text-foreground-muted leading-relaxed">
                    {chapter.description}
                  </p>

                  <MaterialsSection
                    materials={chapter.materials}
                    chapterHeadline={headline}
                    roleplayHref={roleplayHref}
                    onMarkComplete={(materialId) =>
                      handleMarkComplete(chapter.slug, materialId)
                    }
                  />

                  <RoleplayCtaBanner
                    topicTitle={headline}
                    roleplayHref={roleplayHref}
                  />
                </div>
              </ChapterAccordionItem>
            );
          })}

          <ModuleExamBanner
            exam={trainingModule.exam}
            status={examStatus}
            moduleSlug={trainingModule.slug}
          />
        </div>
      </div>
    </>
  );
}
