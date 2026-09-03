import { AwardIcon, BookIcon, FileIcon, GridIcon, UserIcon } from "./icons";

export type NavItem = {
  label: string;
  href: string | null;
  icon: typeof GridIcon;
};

// Shared between the desktop Sidebar and the mobile BottomNav.
export const NAV_ITEMS: NavItem[] = [
  { label: "ড্যাশবোর্ড", href: "/", icon: GridIcon },
  { label: "মডিউল", href: "/modules", icon: BookIcon },
  { label: "এক্সামসমূহ", href: "/exams", icon: AwardIcon },
  { label: "রিপোর্ট", href: "/history", icon: FileIcon },
  { label: "প্রোফাইল", href: "/profile", icon: UserIcon },
];
