import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "brand" | "success" | "warning" | "danger";
  hint?: string;
}) {
  const toneClasses = {
    brand: "bg-brand-soft text-accent-fg",
    success: "bg-success-soft text-success-fg",
    warning: "bg-warning-soft text-warning-fg",
    danger: "bg-danger-soft text-danger-fg",
  }[tone];

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", toneClasses)}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="font-medium text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
    </div>
  );
}
