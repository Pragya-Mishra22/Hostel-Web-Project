"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICONS, type IconName } from "@/components/ui/icon-registry";

export interface AppNavItem {
  label: string;
  href: string;
  icon: IconName;
}

/**
 * AppShell — the sidebar + top bar frame shared by the student and admin
 * portals. A desktop sidebar collapses into a bottom tab bar on mobile
 * (max 5 items, per the UX guideline), and a slide-over handles any
 * overflow items on small screens.
 */
export function AppShell({
  navItems,
  userName,
  roleLabel,
  children,
}: {
  navItems: AppNavItem[];
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const bottomItems = navItems.slice(0, 4);
  const overflowItems = navItems.slice(4);

  const handleLogout = async () => {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-surface)] lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-6 py-5 font-display text-base font-bold text-ink">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Building2 className="size-4" aria-hidden="true" />
          </span>
          YMCA Hostels
        </Link>

        <nav aria-label="Portal navigation" className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink",
                  active && "bg-brand-50 text-brand-700",
                )}
              >
                <Icon className="size-[18px]" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--color-line)] p-4">
          <p className="truncate text-sm font-semibold text-ink">{userName}</p>
          <p className="text-xs text-ink-muted">{roleLabel}</p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-danger-600 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut className="size-4" aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)]/90 px-4 backdrop-blur-lg lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-display text-sm font-bold text-ink">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Building2 className="size-3.5" aria-hidden="true" />
          </span>
          YMCA Hostels
        </Link>
        {overflowItems.length > 0 ? (
          <button
            type="button"
            aria-label="More options"
            onClick={() => setMobileMenuOpen(true)}
            className="flex size-10 items-center justify-center rounded-md text-ink-muted"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <main className="flex-1 pb-20 pt-14 lg:pb-0 lg:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">{children}</div>
      </main>

      {/* Mobile bottom tab bar (max 4 primary items + overflow) */}
      <nav
        aria-label="Portal navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur-lg lg:hidden"
      >
        {bottomItems.map((item) => {
          const active = pathname === item.href;
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-muted",
                active && "text-brand-700",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile overflow sheet */}
      <div
        aria-hidden={!mobileMenuOpen}
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden",
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="More navigation"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[var(--color-surface)] p-5 shadow-2xl transition-transform duration-300 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold text-ink">{userName}</p>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="flex size-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {overflowItems.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-surface-muted"
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-danger-600 hover:bg-red-50"
        >
          <LogOut className="size-4" aria-hidden="true" /> Log out
        </button>
      </aside>
    </div>
  );
}
