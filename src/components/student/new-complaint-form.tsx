"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Plus, X } from "lucide-react";
import { complaintSchema, type ComplaintInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { KineticLoader } from "@/components/ui/kinetic-loader";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: ComplaintInput["category"]; label: string }[] = [
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "PLUMBING", label: "Plumbing" },
  { value: "WIFI", label: "Wi-Fi" },
  { value: "CLEANLINESS", label: "Cleanliness" },
  { value: "MESS", label: "Mess" },
  { value: "OTHER", label: "Other" },
];

const inputClass =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-500";

export function NewComplaintForm() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintInput>({ resolver: zodResolver(complaintSchema), defaultValues: { category: "OTHER" } });

  const onSubmit = async (values: ComplaintInput) => {
    setServerError(null);
    const res = await fetch("/api/student/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.error ?? "Could not submit the complaint.");
      return;
    }
    reset({ category: "OTHER", title: "", description: "" });
    setOpen(false);
    router.refresh();
  };

  if (!open) {
    return (
      <Button variant="gold" onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden="true" /> Raise a complaint
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-2xl border border-line bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink">New complaint</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="flex size-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {serverError ? (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-danger-500/30 bg-danger-soft px-3 py-2 text-sm text-danger-fg">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> {serverError}
        </div>
      ) : null}

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink">
          Category
        </label>
        <select id="category" className={cn(inputClass, "pr-8")} {...register("category")}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink">
          Title
        </label>
        <input id="title" className={inputClass} placeholder="e.g. Room light not working" {...register("title")} />
        {errors.title ? <p className="mt-1.5 text-sm text-danger-fg">{errors.title.message}</p> : null}
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
          Description
        </label>
        <textarea id="description" rows={3} className={cn(inputClass)} {...register("description")} />
        {errors.description ? <p className="mt-1.5 text-sm text-danger-fg">{errors.description.message}</p> : null}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <KineticLoader label="Submitting" /> : "Submit complaint"}
      </Button>
    </form>
  );
}
