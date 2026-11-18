"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Building2, ShieldAlert, LogIn, UserPlus, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { title: "Home", href: "/", icon: Home },
  { title: "Hostels", href: "/#hostels", icon: Building2 },
  { title: "Safety & Contacts", href: "/safety", icon: ShieldAlert },
];

/**
 * Navbar — adapted from the mega-menu reference to this site's real
 * sections (no generic SaaS "Features/Pricing/Resources" content). Sticky,
 * blurred, with a full-screen mobile sheet.
 */
export function Navbar({ brandName = "YMCA Hostels" }: { brandName?: string }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-line)] bg-[var(--color-surface)]/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            {brandName}
            <span className="block text-[11px] font-medium text-ink-muted">JC Bose YMCA, Faridabad</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink",
                  active && "bg-brand-50 text-brand-700",
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              <LogIn className="size-4" aria-hidden="true" /> Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm" liquid>
              <UserPlus className="size-4" aria-hidden="true" /> Register
            </Button>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="flex size-11 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted lg:hidden"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
      </div>

      <div
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-1 bg-[var(--color-surface)] p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-lg font-bold">{brandName}</span>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="flex size-10 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-surface-muted"
          >
            <link.icon className="size-5 text-brand-600" aria-hidden="true" />
            {link.title}
          </Link>
        ))}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <Link href="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" className="w-full">
              Log in
            </Button>
          </Link>
          <Link href="/register" onClick={() => setMobileOpen(false)}>
            <Button variant="primary" className="w-full">
              Register
            </Button>
          </Link>
        </div>
      </aside>
    </header>
  );
}
