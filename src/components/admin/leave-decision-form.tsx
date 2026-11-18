"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LeaveDecisionForm({ leaveId }: { leaveId: string }) {
  const router = useRouter();
  const [remarks, setRemarks] = React.useState("");
  const [loading, setLoading] = React.useState<"APPROVE" | "REJECT" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const decide = async (decision: "APPROVE" | "REJECT") => {
    setLoading(decision);
    setError(null);
    const res = await fetch(`/api/admin/leaves/${leaveId}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, remarks: remarks || undefined }),
    });
    setLoading(null);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Could not record a decision.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="mt-3 space-y-2 border-t border-[var(--color-line)] pt-3">
      {error ? <p className="text-xs text-danger-600">{error}</p> : null}
      <input
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Note for the student (optional, e.g. reason for rejection)"
        className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-xs text-ink outline-none focus:border-brand-500"
      />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => decide("REJECT")} disabled={loading !== null}>
          <X className="size-4" aria-hidden="true" /> Reject
        </Button>
        <Button size="sm" onClick={() => decide("APPROVE")} disabled={loading !== null}>
          <Check className="size-4" aria-hidden="true" /> Approve
        </Button>
      </div>
    </div>
  );
}
