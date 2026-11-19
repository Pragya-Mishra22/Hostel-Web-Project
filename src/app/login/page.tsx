import { Suspense } from "react";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { AuthShell } from "@/components/site/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { LineHoverLink } from "@/components/ui/line-hover-link";

export const metadata: Metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthShell
      image="/images/hostels/kasturba.jpg"
      imageAlt="Residents at a morning session outside Kasturba Hall"
      eyebrow="Resident portal"
      title="Everything about your hostel stay, in one place"
      points={[
        "Rooms, fees, complaints and leave in one dashboard",
        "Approved leave becomes a gate pass you can show at the gate",
        "Wardens manage admissions, beds and the gate register",
      ]}
    >
      <div className="mb-8">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <Building2 className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Log in as a student, warden or chief warden.</p>
      </div>

      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        New student?{" "}
        <LineHoverLink href="/register" variant="grow" className="font-semibold text-accent-fg">
          Register for a hostel seat
        </LineHoverLink>
      </p>
    </AuthShell>
  );
}
