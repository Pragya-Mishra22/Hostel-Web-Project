"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { KineticLoader } from "@/components/ui/kinetic-loader";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 text-sm text-ink outline-none transition-colors focus:border-brand-500";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-sm text-danger-600">{error}</p> : null}
    </div>
  );
}

export function RegisterForm({ hostels }: { hostels: { id: string; name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      preferredHostelId: searchParams.get("hostel") ?? hostels[0]?.id ?? "",
      year: 1,
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSuccessMessage(json.message);
    window.setTimeout(() => router.push("/login"), 2500);
  };

  if (successMessage) {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-success-500/30 bg-green-50 px-4 py-4 text-sm text-success-600 dark:bg-green-950/20"
      >
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span>{successMessage}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-danger-500/30 bg-red-50 px-4 py-3 text-sm text-danger-600 dark:bg-red-950/20"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={errors.name?.message}>
          <input id="name" className={inputClass} autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Email address" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" className={inputClass} autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <input id="password" type="password" className={inputClass} autoComplete="new-password" {...register("password")} />
        </Field>
        <Field label="Phone number" htmlFor="phone" error={errors.phone?.message}>
          <input id="phone" type="tel" inputMode="numeric" className={inputClass} {...register("phone")} />
        </Field>
        <Field label="Roll number" htmlFor="rollNumber" error={errors.rollNumber?.message}>
          <input id="rollNumber" className={inputClass} {...register("rollNumber")} />
        </Field>
        <Field label="Course" htmlFor="course" error={errors.course?.message}>
          <input id="course" placeholder="e.g. B.Tech CSE" className={inputClass} {...register("course")} />
        </Field>
        <Field label="Year of study" htmlFor="year" error={errors.year?.message}>
          <select id="year" className={cn(inputClass, "pr-8")} {...register("year", { valueAsNumber: true })}>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>
                Year {y}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred hostel" htmlFor="preferredHostelId" error={errors.preferredHostelId?.message}>
          <select id="preferredHostelId" className={cn(inputClass, "pr-8")} {...register("preferredHostelId")}>
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Guardian's name" htmlFor="guardianName" error={errors.guardianName?.message}>
          <input id="guardianName" className={inputClass} {...register("guardianName")} />
        </Field>
        <Field label="Guardian's phone" htmlFor="guardianPhone" error={errors.guardianPhone?.message}>
          <input id="guardianPhone" type="tel" inputMode="numeric" className={inputClass} {...register("guardianPhone")} />
        </Field>
      </div>

      <Field label="Home address" htmlFor="address" error={errors.address?.message}>
        <textarea id="address" rows={2} className={cn(inputClass, "h-auto py-2.5")} {...register("address")} />
      </Field>

      <Button type="submit" size="lg" liquid className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <KineticLoader label="Submitting" /> : "Submit registration"}
      </Button>
      <p className="text-center text-xs text-ink-muted">
        Your warden reviews every application before you can log in.
      </p>
    </form>
  );
}
