import Link from "next/link";
import type { ModuleChapter } from "../lib/types";
import {
  CheckCircleIcon,
  FileIcon,
  HeadphoneIcon,
  LockIcon,
  VideoIcon,
} from "./icons";

const STATUS_META = {
  completed: {
    label: "কমপ্লিট",
    badgeClass: "bg-success text-white",
    iconWrapClass: "bg-success-soft text-success",
    Icon: CheckCircleIcon,
    cta: "অধ্যায় পর্যালোচনা",
  },
  not_started: {
    label: "স্টার্ট হয়নি",
    badgeClass: "bg-border text-foreground-muted",
    iconWrapClass: "bg-border text-foreground-muted",
    Icon: LockIcon,
    cta: "অধ্যায় শুরু করুন",
  },
} as const;

export function ChapterRow({ moduleId, chapter }: { moduleId: string; chapter: ModuleChapter }) {
  const meta = chapter.completedAt !== null ? STATUS_META.completed : STATUS_META.not_started;
  const videoCount = chapter.materials.filter((m) => m.type === "video").length;
  const guideCount = chapter.materials.filter((m) => m.type === "pdf").length;
  const audioCount = chapter.materials.filter((m) => m.type === "audio").length;

  return (
    <Link
      href={`/modules/${moduleId}/chapters/${chapter.slug}`}
      className="rounded-2xl border border-border bg-background-elevated p-5 flex items-start gap-4 flex-wrap cursor-pointer transition-all duration-200 hover:border-navy hover:shadow-[0_10px_24px_-10px_color-mix(in_oklch,var(--navy)_45%,transparent)]"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.iconWrapClass}`}>
        <meta.Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <div className="font-display font-bold text-[15px] text-foreground">{chapter.title}</div>
          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold shrink-0 ${meta.badgeClass}`}>
            {meta.label}
          </span>
        </div>
        <p className="text-[13px] text-foreground-muted leading-relaxed mb-2.5">{chapter.description}</p>
        <div className="flex items-center gap-3 text-[12px] text-foreground-muted">
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

      <span className="px-4 py-2.5 rounded-lg border-[1.5px] border-border text-foreground font-display font-semibold text-[13px] shrink-0">
        {meta.cta}
      </span>
    </Link>
  );
}
