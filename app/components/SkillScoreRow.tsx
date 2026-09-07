import { BrainIcon, ClockIcon, MicIcon, PackageIcon, ShieldIcon } from "./icons";
import type { ExamReportSkill, ExamReportSkillIcon } from "../lib/examsData";

const SKILL_ICON_META: Record<ExamReportSkillIcon, { Icon: typeof BrainIcon; wrapClass: string }> = {
  brain: { Icon: BrainIcon, wrapClass: "bg-blue-100 text-blue-600" },
  package: { Icon: PackageIcon, wrapClass: "bg-violet-100 text-violet-600" },
  shield: { Icon: ShieldIcon, wrapClass: "bg-teal-soft text-teal" },
  mic: { Icon: MicIcon, wrapClass: "bg-accent-soft text-accent" },
  clock: { Icon: ClockIcon, wrapClass: "bg-navy-soft text-navy" },
};

export function SkillScoreRow({ skill }: { skill: ExamReportSkill }) {
  const meta = SKILL_ICON_META[skill.icon];

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-4 flex items-center gap-4 flex-wrap">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${meta.wrapClass}`}>
        <meta.Icon size={19} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <div className="font-display font-bold text-[14.5px] text-foreground">{skill.label}</div>
          <span className="px-2 py-0.5 rounded-full bg-success-soft text-success text-[11px] font-bold">
            {skill.percent}%
          </span>
        </div>
        <p className="text-[12.5px] text-foreground-muted leading-relaxed">{skill.note}</p>
      </div>

      <div className="w-full sm:w-[160px] h-2 rounded-full bg-border overflow-hidden shrink-0">
        <div className="h-full rounded-full bg-success" style={{ width: `${skill.percent}%` }} />
      </div>
    </div>
  );
}
