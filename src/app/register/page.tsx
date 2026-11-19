import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/site/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Register" };
export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const hostels = await db.hostel.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <AuthShell
      image="/images/campus/gate-2.avif"
      imageAlt="The university building and approach road"
      eyebrow="Student registration"
      title="Apply for a seat in the hostel you want"
      points={[
        "Choose your hostel while you register",
        "Your warden reviews every application",
        "Once approved, log in and pick a vacant bed",
      ]}
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Student registration</h1>
        <p className="mt-2 text-sm text-ink-muted">Fill in your details. Your warden reviews every application.</p>
      </div>

      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <Suspense>
          <RegisterForm hostels={hostels} />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        Already have an approved account?{" "}
        <LineHoverLink href="/login" variant="grow" className="font-semibold text-accent-fg">
          Log in
        </LineHoverLink>
      </p>
    </AuthShell>
  );
}
