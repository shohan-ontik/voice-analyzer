import Link from "next/link";
import { ArrowRightIcon, AwardIcon, CheckCircleIcon, ClockIcon, LockIcon } from "./icons";
import type { ModuleStatus, TrainingModule } from "../lib/modulesData";

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

export function ModuleCard({ module: trainingModule }: { module: TrainingModule }) {
  const meta = MODULE_STATUS_META[trainingModule.status];
  const progressPercent =
    trainingModule.totalChapters === 0
      ? 0
      : Math.round((trainingModule.completedChapters / trainingModule.totalChapters) * 100);

  return (
    <div className="rounded-2xl border border-border bg-background-elevated overflow-hidden flex flex-col">
      <div className="relative h-[160px] bg-border">
        {/* eslint-disable-next-line @next/next/no-img-element -- placeholder thumbnail from an external stub image host */}
        <img src={trainingModule.thumbnailUrl} alt="" className="w-full h-full object-cover" />

        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.badgeClass}`}
        >
          <meta.Icon size={12} />
          {meta.label}
        </span>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <span className="text-[11.5px] font-semibold text-white">
            {trainingModule.completedChapters} / {trainingModule.totalChapters} চ্যাপ্টার কমপ্লিট
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="font-display font-bold text-[15px] text-foreground mb-1.5 truncate">
            {trainingModule.title}
          </div>
          <p className="text-[12.5px] text-foreground-muted leading-relaxed line-clamp-2">
            {trainingModule.description}
          </p>
        </div>

        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div className={`h-full rounded-full ${meta.barClass}`} style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          {trainingModule.hasExam ? (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-warning-ink">
              <AwardIcon size={13} />
              পরীক্ষাসহ
            </span>
          ) : (
            <span />
          )}
          <Link
            href={`/modules/${trainingModule.id}`}
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
