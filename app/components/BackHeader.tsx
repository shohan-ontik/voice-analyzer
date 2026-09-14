import Link from "next/link";
import type { ReactNode } from "react";

export function BackHeader({
  title,
  badge,
  subtitle,
  backHref = "/",
  right,
}: {
  title: string;
  badge?: string;
  subtitle?: string;
  backHref?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 lg:px-14 py-4 lg:py-6 border-b border-border">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Link
          href={backHref}
          className="cursor-pointer w-[34px] h-[34px] rounded-[9px] flex items-center justify-center bg-background-elevated border border-border shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0">
          <div className="font-display font-bold text-[15px] sm:text-[17px] text-foreground break-words">{title}</div>
          {badge && (
            <div className="px-2.5 py-1 rounded-full bg-teal-soft text-teal text-xs font-bold shrink-0">{badge}</div>
          )}
          {subtitle && <div className="text-[12.5px] text-foreground-muted">{subtitle}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}
