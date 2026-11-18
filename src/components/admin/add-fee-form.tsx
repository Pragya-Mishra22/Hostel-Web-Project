"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-sm text-ink outline-none focus:border-brand-500";

export function AddFeeForm({ students }: { students: { id: string; name: string; rollNumber: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: form.get("studentId"),
        type: form.get("type"),
        periodLabel: form.get("periodLabel"),
        amount: form.get("amount"),
      }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(json.error ?? "Could not add that fee record.");
      return;
    }
    setOpen(false);
    router.refresh();
  };

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden="true" /> Add fee record
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 sm:grid-cols-5"
    >
      <div className="flex items-center justify-between sm:col-span-5">
        <p className="text-sm font-semibold text-ink">New fee record</p>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-ink-muted hover:text-ink">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {error ? (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-danger-500/30 bg-red-50 px-3 py-2 text-xs text-danger-600 sm:col-span-5 dark:bg-red-950/20">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" /> {error}
        </div>
      ) : null}

      <select name="studentId" required className={cn(inputClass, "sm:col-span-2")} defaultValue="">
        <option value="" disabled>
          Student
        </option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.rollNumber})
          </option>
        ))}
      </select>
      <select name="type" required className={inputClass} defaultValue="MESS">
        <option value="MESS">Mess</option>
        <option value="HOSTEL">Hostel</option>
        <option value="ELECTRICITY">Electricity</option>
      </select>
      <input name="periodLabel" required placeholder="e.g. Dec 2026" className={inputClass} />
      <input name="amount" type="number" min={1} required placeholder="Amount" className={inputClass} />

      <Button type="submit" size="sm" disabled={submitting} className="sm:col-span-5">
        {submitting ? "Adding…" : "Add record"}
      </Button>
    </form>
  );
}
