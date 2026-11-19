"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { KineticLoader } from "@/components/ui/kinetic-loader";
import { useHydrated } from "@/lib/use-hydrated";

export function LoginForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong. Please try again.");
      return;
    }
    // Only follow same-site paths from ?next= (never an external URL).
    const next = searchParams.get("next");
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
    router.push(safeNext || json.redirectTo || "/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-danger-500/30 bg-danger-soft px-4 py-3 text-sm text-danger-fg"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-3.5 text-sm text-ink outline-none transition-colors focus:border-brand-500"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p id="email-error" className="mt-1.5 text-sm text-danger-fg">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-10 text-sm text-ink outline-none transition-colors focus:border-brand-500"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-ink-muted hover:text-ink"
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" className="mt-1.5 text-sm text-danger-fg">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={!hydrated || isSubmitting}>
        {isSubmitting ? <KineticLoader label="Signing in" /> : "Log in"}
      </Button>
    </form>
  );
}
