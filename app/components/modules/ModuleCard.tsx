import Link from "next/link";
import { ArrowRightIcon, AwardIcon, CheckCircleIcon, ClockIcon, LockIcon } from "../icons";
import { getModuleStatus, type ModuleStatus } from "../../lib/moduleProgress";
import type { TrainingModuleSummary } from "../../lib/types";
import { ProgressBar } from "../shared/ProgressBar";

export const MODULE_STATUS_META: Record<
  ModuleStatus,
  { label: string; badgeClass: string; barClass: string; Icon: typeof CheckCircleIcon }
> = {
  completed: { label: "কমপ্লিট", badgeClass: "bg-success text-white", barClass: "bg-success", Icon: CheckCircleIcon },
  in_progress: { label: "ইন-প্রোগ্রেস", badgeClass: "bg-navy text-navy-ink", barClass: "bg-navy", Icon: ClockIcon },
  not_started: {
    label: "স্টার্ট হয়নি",
    badgeClass: "bg-foreground/65 text-white",
    barClass: "bg-border",
    Icon: LockIcon,
  },
};

export function ModuleCard({ module: trainingModule }: { module: TrainingModuleSummary }) {
  const meta = MODULE_STATUS_META[getModuleStatus(trainingModule)];
  const { chapterCount: total, completedChapterCount: completed, progressPercent } = trainingModule;

  return (
    <div className="rounded-2xl border border-border bg-background-elevated overflow-hidden flex flex-col">
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${meta.badgeClass}`}
          >
            <meta.Icon size={12} />
            {meta.label}
          </span>
          <span className="text-[11.5px] font-semibold text-foreground-muted shrink-0">
            {completed} / {total} চ্যাপ্টার কমপ্লিট
          </span>
        </div>

        <div>
          <div className="font-display font-bold text-[15px] text-foreground mb-1.5 truncate">
            {trainingModule.title}
          </div>
          <p className="text-[12.5px] text-foreground-muted leading-relaxed line-clamp-2">
            {trainingModule.description}
          </p>
        </div>

        <ProgressBar percent={progressPercent} fillClassName={meta.barClass} size="sm" />

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-warning-ink">
            <AwardIcon size={13} />
            পরীক্ষাসহ
          </span>
          <Link
            href={`/modules/${trainingModule.slug}`}
            className="flex items-center gap-1 text-[12.5px] font-bold text-navy shrink-0"
          >
            চ্যাপ্টারগুলো দেখুন
            <ArrowRightIcon size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
