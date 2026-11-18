"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function FeeToggleButton({ feeId, status }: { feeId: string; status: "PAID" | "PENDING" }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/fees/${feeId}/toggle`, { method: "POST" });
    setLoading(false);
    if (res.ok) router.refresh();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
        status === "PAID"
          ? "border-[var(--color-line)] text-ink-muted hover:border-danger-500/40 hover:bg-red-50 hover:text-danger-600"
          : "border-success-500/40 bg-green-50 text-success-600 hover:bg-green-100 dark:bg-green-950/20",
      )}
    >
      {loading ? "Saving…" : status === "PAID" ? "Mark pending" : "Mark paid"}
    </button>
  );
}
