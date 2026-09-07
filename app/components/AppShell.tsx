"use client";

import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const BREADCRUMB_LABELS: Record<string, string> = {
  "/": "ড্যাশবোর্ড",
  "/modules": "মডিউল",
  "/exams": "এক্সামসমূহ",
  "/profile": "প্রোফাইল",
  "/profile/password": "পাসওয়ার্ড পরিবর্তন",
  "/history": "রিপোর্ট",
  "/record": "পিচ প্র্যাকটিস",
  "/analyzing": "পিচ প্র্যাকটিস",
  "/results": "পিচ প্র্যাকটিস",
};

function breadcrumbFor(pathname: string) {
  if (BREADCRUMB_LABELS[pathname]) return BREADCRUMB_LABELS[pathname];
  if (pathname.startsWith("/history/")) return "রিপোর্ট";
  if (pathname.startsWith("/modules/")) return "মডিউল";
  if (pathname.startsWith("/exams/")) return "এক্সামসমূহ";
  return "ড্যাশবোর্ড";
}

export function AppShell({ pathname, children }: { pathname: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 flex font-bangla">
      <Sidebar pathname={pathname} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar breadcrumb={breadcrumbFor(pathname)} />
        <main className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">{children}</main>
      </div>
      <BottomNav pathname={pathname} />
    </div>
  );
}
