"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export function ComplaintStatusForm({
  complaintId,
  currentStatus,
  currentRemarks,
}: {
  complaintId: string;
  currentStatus: (typeof STATUSES)[number];
  currentRemarks: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState<(typeof STATUSES)[number]>(currentStatus);
  const [remarks, setRemarks] = React.useState(currentRemarks ?? "");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/complaints/${complaintId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  };

  return (
    <div className="mt-3 space-y-2 border-t border-[var(--color-line)] pt-3">
      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              status === s ? "border-brand-600 bg-brand-600 text-white" : "border-[var(--color-line)] text-ink-muted",
            )}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Add a note for the student (optional)"
        rows={2}
        className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-xs text-ink outline-none focus:border-brand-500"
      />
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved" : "Save update"}
      </button>
    </div>
  );
}
