"use client";

import { cn } from "@/lib/utils";

/**
 * KineticLoader — the shared loading indicator for anything slower than
 * ~300ms (page transitions, a submit waiting on the server, charts fetching
 * data). Three dots with a staggered bounce; respects reduced-motion by
 * falling back to a steady pulse instead of motion.
 */
export function KineticLoader({
  label = "Loading",
  size = "default",
  className,
}: {
  label?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const dot = size === "sm" ? "size-1.5" : size === "lg" ? "size-3" : "size-2";
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(dot, "rounded-full bg-current motion-safe:animate-bounce")}
          style={{ animationDelay: `${i * 0.12}s`, animationDuration: "0.9s" }}
        />
      ))}
      <span className="sr-only">{label}…</span>
    </div>
  );
}

/** Full-area loading state for a slow-loading section (e.g. a chart or table). */
export function SectionLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[160px] w-full items-center justify-center text-ink-muted">
      <KineticLoader label={label} size="lg" />
    </div>
  );
}
