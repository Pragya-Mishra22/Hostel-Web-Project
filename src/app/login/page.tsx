import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/site/footer";
import { LoginForm } from "@/components/auth/login-form";
import { LineHoverLink } from "@/components/ui/line-hover-link";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60dvh] max-w-md flex-col justify-center px-4 py-16 md:px-6">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Building2 className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-muted">Log in as a student, warden or chief warden.</p>
        </div>

        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          New student?{" "}
          <LineHoverLink href="/register" className="font-semibold text-brand-700">
            Register for a hostel seat
          </LineHoverLink>
        </p>
        <p className="mt-2 text-center text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink">
            Back to home
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
