type ProgressBarSize = "sm" | "md";

const SIZE_CLASSES: Record<ProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-2",
};

export function ProgressBar({
  percent,
  fillClassName = "bg-navy",
  size = "sm",
  className = "",
}: {
  percent: number;
  fillClassName?: string;
  size?: ProgressBarSize;
  className?: string;
}) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className={`${SIZE_CLASSES[size]} rounded-full bg-border overflow-hidden ${className}`}>
      <div className={`h-full rounded-full ${fillClassName}`} style={{ width: `${clampedPercent}%` }} />
    </div>
  );
}
