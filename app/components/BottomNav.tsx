"use client";

import Link from "next/link";
import { isNavItemActive, NAV_ITEMS } from "./navItems";

export function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background-elevated border-t border-border flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const Icon = item.icon;
        const className = `flex-1 flex flex-col items-center gap-1 py-2 text-[11px] font-semibold ${
          active ? "text-navy" : "text-foreground-muted"
        }`;
        const content = (
          <>
            <span className={`p-1.5 rounded-lg ${active ? "bg-navy-soft" : ""}`}>
              <Icon size={19} />
            </span>
            {item.label}
          </>
        );

        if (item.href) {
          return (
            <Link key={item.label} href={item.href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <button key={item.label} type="button" className={className}>
            {content}
          </button>
        );
      })}
    </nav>
  );
}
