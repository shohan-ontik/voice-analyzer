import Link from "next/link";
import { SparkleIcon } from "./icons";

export function RoleplayCtaBanner({ topicTitle, roleplayHref }: { topicTitle: string; roleplayHref: string }) {
  return (
    <div className="rounded-2xl bg-navy p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-warning font-bold text-[12.5px] mb-2">
          <SparkleIcon size={14} />
          ইন্টারেক্টিভ রোলপ্লে পিচ
        </div>
        <div className="font-display font-bold text-[20px] lg:text-[24px] text-navy-ink mb-2">
          আপনি কি শেখা বিষয়টি যাচাই করতে প্রস্তুত?
        </div>
        <p className="text-[13px] text-navy-ink/80 leading-relaxed max-w-[620px]">
          আমাদের AI ক্লায়েন্ট আপনাকে {topicTitle} বিষয়ক একটি আপত্তি উত্থাপন করবে। ক্যামেরা বা মাইক্রোফোন ব্যবহার
          করে উত্তর রেকর্ড করুন এবং তাৎক্ষণিক স্কোর পান।
        </p>
      </div>

      <Link
        href={roleplayHref}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-navy font-display font-semibold text-sm shrink-0 cursor-pointer"
      >
        <SparkleIcon size={15} />
        পিচ প্র্যাকটিস শুরু করুন
      </Link>
    </div>
  );
}
