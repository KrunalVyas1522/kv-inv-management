import { cn } from "@/lib/utils";
import type { Status } from "@/data/inventory";

const styles: Record<Status, string> = {
  "in-stock": "bg-success/15 text-success border-success/25",
  low: "bg-warning/15 text-warning border-warning/25",
  out: "bg-destructive/15 text-destructive border-destructive/25",
};

const labels: Record<Status, string> = {
  "in-stock": "In stock",
  low: "Low stock",
  out: "Out of stock",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
