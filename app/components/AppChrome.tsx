"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";
import { isPublicPath } from "../lib/constants";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublicPath(pathname)) {
    return <>{children}</>;
  }

  return <AppShell pathname={pathname}>{children}</AppShell>;
}
