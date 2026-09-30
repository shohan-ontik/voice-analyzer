import { formatBnRelative } from "../../lib/formatDate";
import type { NotificationItem } from "../../lib/types";
import { BookIcon, ClockIcon } from "../icons";

export function NotificationRow({
  item,
  onSelect,
}: Readonly<{
  item: NotificationItem;
  onSelect: (item: NotificationItem) => void;
}>) {
  const Icon = item.type === "exam_deadline" ? ClockIcon : BookIcon;
  const tone =
    item.type === "exam_deadline"
      ? "bg-accent-soft text-accent"
      : "bg-navy-soft text-navy";

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`w-full flex items-start gap-3 px-2 py-2.5 rounded-lg text-left cursor-pointer ${
        item.isRead ? "hover:bg-background" : "bg-background hover:bg-border/60"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${tone}`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-[13.5px] leading-snug ${item.isRead ? "text-foreground-muted" : "font-semibold text-foreground"}`}
        >
          {item.title}
        </div>
        <div
          className={`text-[12.5px] leading-snug mt-0.5 line-clamp-2 ${item.isRead ? "text-foreground-muted" : "text-foreground"}`}
        >
          {item.body}
        </div>
        <div
          className={`text-[11.5px] mt-1 ${item.isRead ? "text-foreground-muted" : "font-semibold text-navy"}`}
        >
          {formatBnRelative(item.createdAt)}
        </div>
      </div>
      {!item.isRead && (
        <span
          className="w-3 h-3 rounded-full bg-navy shrink-0 self-center"
          aria-label="অপঠিত"
        />
      )}
    </button>
  );
}
