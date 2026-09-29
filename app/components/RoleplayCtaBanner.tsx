import Link from "next/link";
import { SparkleIcon } from "./icons";

export function RoleplayCtaBanner({
  topicTitle,
  roleplayHref,
}: {
  topicTitle: string;
  roleplayHref: string;
}) {
  return (
    <Link
      href={roleplayHref}
      className="flex flex-row items-center justify-center rounded-2xl bg-navy text-warning p-4 lg:p-6 gap-5"
    >
      <SparkleIcon size={15} />
      পিচ প্র্যাকটিস শুরু করুন
    </Link>
  );
}
