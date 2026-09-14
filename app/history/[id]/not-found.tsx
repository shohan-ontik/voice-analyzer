import Link from "next/link";
import { BackHeader } from "../../components/BackHeader";

export default function SessionNotFound() {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <BackHeader title="Session" backHref="/history" />
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">এই সেশনটি খুঁজে পাওয়া যায়নি।</p>
        <Link href="/history" className="text-[13px] font-semibold text-navy cursor-pointer">
          হিস্ট্রিতে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
