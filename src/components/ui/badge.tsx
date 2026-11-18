import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      tone: {
        neutral: "bg-surface-muted text-ink-muted",
        brand: "bg-brand-50 text-brand-700",
        success: "bg-green-50 text-success-600 dark:bg-green-950/30",
        warning: "bg-amber-50 text-warning-600 dark:bg-amber-950/30",
        danger: "bg-red-50 text-danger-600 dark:bg-red-950/30",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  children,
}: { className?: string; children: React.ReactNode } & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}

/** Maps every status enum used across the app to a consistent tone + dot, never color alone. */
export function statusTone(status: string): VariantProps<typeof badgeVariants>["tone"] {
  switch (status) {
    case "PAID":
    case "APPROVED":
    case "RESOLVED":
      return "success";
    case "PENDING":
    case "OPEN":
      return "warning";
    case "IN_PROGRESS":
      return "brand";
    case "REJECTED":
      return "danger";
    default:
      return "neutral";
  }
}
