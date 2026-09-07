"use client";

import Link from "next/link";
import { SparkleIcon, UserIcon } from "./icons";
import { isNavItemActive, NAV_ITEMS } from "./navItems";
import { dashboardUser } from "../lib/dashboardData";

export function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden lg:flex w-[248px] shrink-0 h-screen sticky top-0 border-r border-border bg-background-elevated flex-col">
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-border">
        <div className="w-9 h-9 rounded-[10px] bg-navy flex items-center justify-center text-navy-ink">
          <SparkleIcon size={18} />
        </div>
        <span className="font-display font-bold text-lg tracking-tight text-foreground">PitchPerfect</span>
      </div>

      <div className="px-5 pt-5">
        <div className="text-[11px] font-bold uppercase tracking-wide text-foreground-muted mb-2">বর্তমান ভূমিকা</div>
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navy-soft border border-navy/15">
          <UserIcon size={15} className="text-navy shrink-0" />
          <span className="font-bold text-[13.5px] text-navy">{dashboardUser.roleWithCode}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 pt-6 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;
          const className = `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            active
              ? "bg-navy text-navy-ink border border-navy-border"
              : "border border-transparent text-foreground-muted hover:bg-background hover:text-foreground"
          }`;

          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className={className}>
                <Icon size={17} />
                {item.label}
              </Link>
            );
          }

          return (
            <button key={item.label} type="button" className={className}>
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
