import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/site/footer";
import { RegisterForm } from "@/components/auth/register-form";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage() {
  const hostels = await db.hostel.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-ink">Student registration</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Fill in your details to apply for a hostel seat. Your warden reviews every application.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
          <Suspense>
            <RegisterForm hostels={hostels} />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an approved account?{" "}
          <LineHoverLink href="/login" className="font-semibold text-brand-700">
            Log in
          </LineHoverLink>
        </p>
      </main>
      <Footer />
    </>
  );
}
