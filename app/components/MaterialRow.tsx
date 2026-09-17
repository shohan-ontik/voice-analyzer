import type { MaterialStatus } from "../lib/moduleProgress";
import type { LearningMaterial, LearningMaterialType } from "../lib/types";
import {
  CheckCircleIcon,
  EyeIcon,
  FileIcon,
  HeadphoneIcon,
  LockIcon,
  VideoIcon,
} from "./icons";

export const MATERIAL_TYPE_META: Record<
  LearningMaterialType,
  { label: string; iconWrapClass: string; Icon: typeof VideoIcon }
> = {
  video: {
    label: "VIDEO",
    iconWrapClass: "bg-accent-soft text-accent",
    Icon: VideoIcon,
  },
  pdf: {
    label: "PDF",
    iconWrapClass: "bg-navy-soft text-navy",
    Icon: FileIcon,
  },
  audio: {
    label: "AUDIO",
    iconWrapClass: "bg-teal-soft text-teal",
    Icon: HeadphoneIcon,
  },
};

export function MaterialRow({
  material,
  status,
  onOpen,
}: {
  material: LearningMaterial;
  status: MaterialStatus;
  onOpen: () => void;
}) {
  const meta = MATERIAL_TYPE_META[material.type];
  const locked = status === "locked";

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={locked}
      aria-disabled={locked}
      className={`w-full text-left rounded-2xl border border-border p-4 flex items-center gap-4 flex-wrap transition-all duration-200 ${
        locked
          ? "bg-background-elevated/60 opacity-70 cursor-not-allowed"
          : "bg-background-elevated cursor-pointer hover:border-navy hover:shadow-[0_10px_24px_-10px_color-mix(in_oklch,var(--navy)_45%,transparent)]"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${meta.iconWrapClass}`}
      >
        {locked ? <LockIcon size={19} /> : <meta.Icon size={19} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <div className="font-display font-bold text-[14.5px] text-foreground">
            {material.title}
          </div>
          {status === "completed" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-soft text-success text-[10.5px] font-bold shrink-0">
              <CheckCircleIcon size={11} />
              কমপ্লিট
            </span>
          )}
          {locked && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-border text-foreground-muted text-[10.5px] font-bold shrink-0">
              <LockIcon size={11} />
              লকড
            </span>
          )}
        </div>
        {/* <div className="text-[12px] text-foreground-muted">
          {meta.label} • {material.meta} • {material.filename}
        </div> */}
      </div>

      {locked ? (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] border-border text-foreground-muted font-display font-semibold text-[12.5px] shrink-0">
          <LockIcon size={14} />
          আগের উপাদান শেষ করুন
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] border-border text-foreground font-display font-semibold text-[12.5px] shrink-0">
          <EyeIcon size={14} />
          ওপেন করুন
        </span>
      )}
    </button>
  );
}
