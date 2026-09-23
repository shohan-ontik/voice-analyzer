"use client";

import type { ReactNode } from "react";
import type { ChapterStatus } from "../../lib/moduleProgress";
import type { ModuleChapter } from "../../lib/types";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  FileIcon,
  HeadphoneIcon,
  LockIcon,
  VideoIcon,
} from "../icons";

const STATUS_META = {
  completed: {
    label: "কমপ্লিট",
    badgeClass: "bg-success text-white",
    iconWrapClass: "bg-success-soft text-success",
    Icon: CheckCircleIcon,
    cta: "অধ্যায় পর্যালোচনা",
  },
  in_progress: {
    label: "চলছে",
    badgeClass: "bg-warning text-white",
    iconWrapClass: "bg-warning-soft text-warning",
    Icon: ClockIcon,
    cta: "অধ্যায় চালিয়ে যান",
  },
  unlocked: {
    label: "স্টার্ট হয়নি",
    badgeClass: "bg-border text-foreground-muted",
    iconWrapClass: "bg-border text-foreground-muted",
    Icon: LockIcon,
    cta: "অধ্যায় শুরু করুন",
  },
  locked: {
    label: "লকড",
    badgeClass: "bg-border text-foreground-muted",
    iconWrapClass: "bg-border text-foreground-muted",
    Icon: LockIcon,
    cta: "আগের অধ্যায় সম্পন্ন করুন",
  },
} as const;

export function ChapterAccordionItem({
  chapter,
  status,
  expanded,
  onToggle,
  children,
}: {
  chapter: ModuleChapter;
  status: ChapterStatus;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const meta = STATUS_META[status];
  const locked = status === "locked";
  const videoCount = chapter.materials.filter((m) => m.type === "video").length;
  const guideCount = chapter.materials.filter((m) => m.type === "pdf").length;
  const audioCount = chapter.materials.filter((m) => m.type === "audio").length;

  const header = (
    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${meta.iconWrapClass}`}
      >
        <meta.Icon size={17} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <div className="font-display font-bold text-[14px] sm:text-[15px] text-foreground">
            {chapter.title}
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold shrink-0 ${meta.badgeClass}`}
          >
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11.5px] sm:text-[12px] text-foreground-muted">
          <span className="flex items-center gap-1">
            <VideoIcon size={13} />
            {videoCount}টি ভিডিও
          </span>
          <span aria-hidden>•</span>
          <span className="flex items-center gap-1">
            <FileIcon size={13} />
            {guideCount}টি গাইড
          </span>
          <span aria-hidden>•</span>
          <span className="flex items-center gap-1">
            <HeadphoneIcon size={13} />
            {audioCount}টি অডিও
          </span>
        </div>
      </div>
    </div>
  );

  if (locked) {
    return (
      <div
        aria-disabled
        className="rounded-2xl border border-border bg-background-elevated/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 cursor-not-allowed opacity-70"
      >
        {header}
        <span className="px-4 py-2.5 rounded-lg border-[1.5px] border-border text-foreground-muted font-display font-semibold text-[13px] text-center w-full sm:w-auto shrink-0">
          {meta.cta}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-border bg-background-elevated overflow-hidden transition-all duration-200 hover:border-navy hover:shadow-[0_10px_24px_-10px_color-mix(in_oklch,var(--navy)_45%,transparent)] ${
        expanded
          ? "shadow-[0_10px_24px_-10px_color-mix(in_oklch,var(--navy)_45%,transparent)] border-navy"
          : "shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full p-4 sm:p-5 flex items-start gap-3 cursor-pointer text-left"
      >
        {header}
        <ChevronDownIcon
          size={20}
          className={`shrink-0 self-center text-foreground-muted transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border">{children}</div>
        </div>
      </div>
    </div>
  );
}
