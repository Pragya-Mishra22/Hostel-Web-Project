"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { leaveSchema, type LeaveInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { KineticLoader } from "@/components/ui/kinetic-loader";

const inputClass =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-500";

export function NewLeaveForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeaveInput>({ resolver: zodResolver(leaveSchema) });

  const onSubmit = async (values: LeaveInput) => {
    setServerError(null);
    const res = await fetch("/api/student/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.error ?? "Could not submit the application.");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-2xl border border-line bg-card p-5">
      <h2 className="font-display text-base font-bold text-ink">Apply for leave</h2>

      {serverError ? (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-danger-500/30 bg-danger-soft px-3 py-2 text-sm text-danger-fg">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> {serverError}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fromDate" className="mb-1.5 block text-sm font-medium text-ink">
            Leaving on
          </label>
          <input id="fromDate" type="date" className={inputClass} {...register("fromDate")} />
          {errors.fromDate ? <p className="mt-1.5 text-sm text-danger-fg">{errors.fromDate.message}</p> : null}
        </div>
        <div>
          <label htmlFor="toDate" className="mb-1.5 block text-sm font-medium text-ink">
            Returning on
          </label>
          <input id="toDate" type="date" className={inputClass} {...register("toDate")} />
          {errors.toDate ? <p className="mt-1.5 text-sm text-danger-fg">{errors.toDate.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="destination" className="mb-1.5 block text-sm font-medium text-ink">
          Destination
        </label>
        <input id="destination" className={inputClass} placeholder="e.g. Home, Rohtak" {...register("destination")} />
        {errors.destination ? <p className="mt-1.5 text-sm text-danger-fg">{errors.destination.message}</p> : null}
      </div>

      <div>
        <label htmlFor="reason" className="mb-1.5 block text-sm font-medium text-ink">
          Reason
        </label>
        <textarea id="reason" rows={2} className={inputClass} {...register("reason")} />
        {errors.reason ? <p className="mt-1.5 text-sm text-danger-fg">{errors.reason.message}</p> : null}
      </div>

      <Button type="submit" variant="brand" disabled={isSubmitting}>
        {isSubmitting ? <KineticLoader label="Submitting" /> : "Submit application"}
      </Button>
    </form>
  );
}
