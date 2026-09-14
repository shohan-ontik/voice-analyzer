import Link from "next/link";

export default function ModuleNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
      <p className="text-[13.5px] text-foreground-muted">মডিউল খুঁজে পাওয়া যায়নি।</p>
      <Link href="/modules" className="text-[13px] font-semibold text-navy cursor-pointer">
        সকল মডিউল ফিরে যান
      </Link>
    </div>
  );
}
