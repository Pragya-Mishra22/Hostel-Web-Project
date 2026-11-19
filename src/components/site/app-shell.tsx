"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Building2,
  LogOut,
  Menu,
  X,
  Search,
  Users,
  ClipboardCheck,
  DoorOpen,
  Wallet,
  CalendarClock,
  MessageSquareWarning,
  BedDouble,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ICONS, type IconName } from "@/components/ui/icon-registry";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchModal, type SearchResult, type QuickAction } from "@/components/ui/search-modal";

export interface AppNavItem {
  label: string;
  href: string;
  icon: IconName;
}

interface StudentHit {
  id: string;
  name: string;
  rollNumber: string;
  hostel: string;
  status: string;
}

const ADMIN_ACTIONS: QuickAction[] = [
  { label: "Review pending admissions", icon: ClipboardCheck, shortcut: "a", href: "/admin/admissions" },
  { label: "Open the gate register", icon: DoorOpen, shortcut: "g", href: "/admin/gate" },
  { label: "Record or update a fee", icon: Wallet, shortcut: "f", href: "/admin/fees" },
];
const STUDENT_ACTIONS: QuickAction[] = [
  { label: "Apply for leave", icon: CalendarClock, shortcut: "l", href: "/student/leave" },
  { label: "Raise a complaint", icon: MessageSquareWarning, shortcut: "c", href: "/student/complaints" },
  { label: "Book or view my room", icon: BedDouble, shortcut: "r", href: "/student/room" },
];

/**
 * AppShell: the frame shared by the student and admin portals. It fills the
 * whole viewport width: a sticky sidebar, a top bar with search and theme
 * switch, and a content area that runs edge to edge. On phones the sidebar
 * becomes a bottom tab bar with a slide-over for the remaining items.
 */
export function AppShell({
  navItems,
  userName,
  roleLabel,
  area,
  children,
}: {
  navItems: AppNavItem[];
  userName: string;
  roleLabel: string;
  area: "admin" | "student";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const root = `/${area}`;
  const [menuState, setMenuState] = React.useState({ open: false, path: "" });
  const menuOpen = menuState.open && menuState.path === pathname;
  const [signingOut, setSigningOut] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [students, setStudents] = React.useState<StudentHit[]>([]);
  const [searching, setSearching] = React.useState(false);

  const isActive = (href: string) => (href === root ? pathname === root : pathname.startsWith(href));
  const current = [...navItems].reverse().find((i) => isActive(i.href));

  const bottomItems = navItems.slice(0, 4);
  const overflowItems = navItems.slice(4);

  // Staff can search students; the request is debounced and cancelled when the query changes.
  const term = query.trim();
  React.useEffect(() => {
    if (area !== "admin" || term.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (res.ok) setStudents((await res.json()).students ?? []);
      } catch {
        // aborted or offline: keep the previous results
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [term, area]);

  const results: SearchResult[] = React.useMemo(() => {
    const pages: SearchResult[] = navItems.map((item) => ({
      id: `page-${item.href}`,
      name: item.label,
      category: "pages",
      icon: ICONS[item.icon],
      href: item.href,
    }));
    const people: SearchResult[] =
      area === "admin" && term.length >= 2
        ? students.map((s) => ({
            id: `student-${s.id}`,
            name: s.name,
            meta: `${s.rollNumber} · ${s.hostel} · ${s.status}`,
            category: "students",
            icon: Users,
            href: `/admin/students/${s.id}`,
          }))
        : [];
    return [...people, ...pages];
  }, [navItems, students, area, term]);

  const handleLogout = async () => {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const searchButton = (
    <button
      type="button"
      onClick={() => setSearchOpen(true)}
      aria-label="Search"
      className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface-muted px-3 text-sm text-ink-muted transition-colors hover:border-brand-400 hover:text-ink"
    >
      <Search className="size-4" aria-hidden="true" />
      <span className="hidden md:inline">{area === "admin" ? "Search students and pages" : "Search"}</span>
      <kbd className="hidden rounded border border-line bg-card px-1.5 text-[10px] font-medium md:inline">Ctrl K</kbd>
    </button>
  );

  return (
    <div className="flex min-h-dvh w-full bg-page">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-card lg:flex xl:w-72">
        <Link href="/" className="flex items-center gap-2.5 px-6 py-5 font-display text-base font-bold text-ink">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          YMCA Hostels
        </Link>

        <nav aria-label="Portal navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink",
                  isActive(item.href) && "bg-brand-soft text-accent-fg",
                )}
              >
                <Icon className="size-[18px]" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <p className="truncate text-sm font-semibold text-ink">{userName}</p>
          <p className="text-xs text-ink-muted">{roleLabel}</p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-danger-fg transition-colors hover:bg-danger-soft disabled:opacity-60"
          >
            <LogOut className="size-4" aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-card/85 px-4 backdrop-blur-lg sm:px-6 lg:h-16 lg:px-10 2xl:px-14">
          <div className="flex min-w-0 items-center gap-2">
            <Link href="/" aria-label="Home" className="flex items-center gap-2 font-display text-sm font-bold text-ink lg:hidden">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
            </Link>
            <p className="truncate font-display text-base font-bold text-ink lg:text-lg">{current?.label ?? "Portal"}</p>
          </div>
          <div className="flex items-center gap-2">
            {searchButton}
            <ThemeToggle />
            <Link href="/" className="hidden size-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-brand-soft hover:text-accent-fg sm:flex" aria-label="Back to the public site">
              <Home className="size-[18px]" aria-hidden="true" />
            </Link>
            {overflowItems.length > 0 ? (
              <button
                type="button"
                aria-label="More options"
                onClick={() => setMenuState({ open: true, path: pathname })}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted lg:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </header>

        <main className="w-full flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-8 2xl:px-14">{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Portal navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-card/95 backdrop-blur-lg lg:hidden"
      >
        {bottomItems.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-ink-muted",
                isActive(item.href) && "text-accent-fg",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile slide-over */}
      <div
        aria-hidden={!menuOpen}
        onClick={() => setMenuState({ open: false, path: pathname })}
        className={cn("fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden", menuOpen ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="More navigation"
        inert={!menuOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-card p-5 shadow-2xl transition-transform duration-300 lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink">{userName}</p>
            <p className="text-xs text-ink-muted">{roleLabel}</p>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuState({ open: false, path: pathname })}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted"
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
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-surface-muted"
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
          className="mt-auto flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-danger-fg hover:bg-danger-soft"
        >
          <LogOut className="size-4" aria-hidden="true" /> Log out
        </button>
      </aside>

      <SearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        query={query}
        onQueryChange={setQuery}
        placeholder={area === "admin" ? "Search a student by name or roll number, or jump to a page" : "Jump to a page"}
        tags={area === "admin" ? [{ id: "students", label: "Students", icon: Users }, { id: "pages", label: "Pages", icon: Building2 }] : []}
        results={results}
        quickActions={area === "admin" ? ADMIN_ACTIONS : STUDENT_ACTIONS}
        filter
        loading={searching}
        onNavigate={(href) => router.push(href)}
      />
    </div>
  );
}
