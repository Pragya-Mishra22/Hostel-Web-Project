"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Menu,
  X,
  Search,
  MoveRight,
  UserPlus,
  LogIn,
  BedDouble,
  Wallet,
  MessageSquareWarning,
  CalendarClock,
  ShieldAlert,
  HelpCircle,
  Phone,
  LayoutDashboard,
  Home,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidButton as Button } from "@/components/ui/liquid-button";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SiteSearch } from "@/components/site/site-search";

export interface NavHostel {
  id: string;
  name: string;
  code: string;
  description: string;
  imageUrl: string | null;
}

interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const RESIDENT_ITEMS: MenuItem[] = [
  { title: "Student registration", description: "Apply for a seat in the hostel of your choice.", href: "/register", icon: UserPlus, badge: "Start here" },
  { title: "Room booking", description: "Pick an available bed once you are approved.", href: "/student/room", icon: BedDouble },
  { title: "Fee records", description: "Mess, hostel and electricity bills, month by month.", href: "/student/fees", icon: Wallet },
  { title: "Complaint box", description: "Raise an issue and follow it until it is resolved.", href: "/student/complaints", icon: MessageSquareWarning },
  { title: "Leave and gate pass", description: "Apply for leave and show the approved pass at the gate.", href: "/student/leave", icon: CalendarClock },
  { title: "Warden login", description: "Wardens and the chief warden sign in here.", href: "/login", icon: LogIn },
];

const GUIDE_ITEMS: MenuItem[] = [
  { title: "Frequently asked questions", description: "Fees, admission, leave and safety answered.", href: "/#faq", icon: HelpCircle },
  { title: "Hostel essentials", description: "Fee structure, rules and facilities at a glance.", href: "/#essentials", icon: Building2 },
  { title: "Safety and contacts", description: "Who to call for ragging, harassment or an emergency.", href: "/safety", icon: ShieldAlert, badge: "24x7" },
  { title: "Emergency numbers", description: "Police, ambulance and women's helpline.", href: "/safety#emergency", icon: Phone },
];

type MenuId = "hostels" | "residents" | "guide";

function MenuTrigger({
  id,
  label,
  open,
  onToggle,
  onEnter,
}: {
  id: string;
  label: string;
  open: boolean;
  onToggle: (pointerType: string) => void;
  onEnter: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={id}
      onClick={(e) => onToggle((e.nativeEvent as PointerEvent).pointerType ?? "")}
      onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
      onFocus={onEnter}
      className={cn(
        "flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-brand-soft hover:text-accent-fg",
        open && "bg-brand-soft text-accent-fg",
      )}
    >
      {label}
      <ChevronDown className={cn("size-3.5 opacity-70 transition-transform duration-200", open && "rotate-180")} aria-hidden="true" />
    </button>
  );
}

function Panel({ id, open, children }: { id: string; open: boolean; children: React.ReactNode }) {
  return (
    <div
      id={id}
      inert={!open}
      className={cn(
        "absolute left-1/2 top-full z-50 w-[min(94vw,56rem)] -translate-x-1/2 pt-3 transition-all duration-200",
        open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0",
      )}
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-card p-4 shadow-[0_24px_60px_-24px_rgba(8,15,40,0.45)] sm:p-5">{children}</div>
    </div>
  );
}

function ItemLink({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group/item flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-surface-muted"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-accent-fg transition-transform group-hover/item:scale-105">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">{item.title}</span>
          {item.badge ? (
            <span className="rounded-full bg-gold-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-warning-fg">{item.badge}</span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{item.description}</span>
      </span>
    </Link>
  );
}

export function NotchNav({
  hostels,
  dashboard,
}: {
  hostels: NavHostel[];
  /** Set when someone is signed in: replaces the Log in / Register buttons. */
  dashboard?: { href: string; label: string };
}) {
  const pathname = usePathname();
  // Menus remember which page they were opened on, so they close by themselves on navigation.
  const [menuState, setMenuState] = React.useState<{ id: MenuId | null; path: string }>({ id: null, path: "" });
  const [drawerState, setDrawerState] = React.useState<{ open: boolean; path: string }>({ open: false, path: "" });
  const openMenu = menuState.path === pathname ? menuState.id : null;
  const mobileOpen = drawerState.open && drawerState.path === pathname;
  const setOpenMenu = React.useCallback((id: MenuId | null) => setMenuState({ id, path: pathname }), [pathname]);
  const setMobileOpen = React.useCallback((open: boolean) => setDrawerState({ open, path: pathname }), [pathname]);
  const [mobileSection, setMobileSection] = React.useState<MenuId | null>(null);
  const [compact, setCompact] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  };
  // A mouse click only opens (hover has usually opened it already); touch and keyboard toggle.
  const toggleMenu = (id: MenuId, pointerType: string) => {
    cancelClose();
    setOpenMenu(pointerType === "mouse" ? id : openMenu === id ? null : id);
  };
  const openNow = (id: MenuId) => {
    cancelClose();
    setOpenMenu(id);
  };

  // The notch tightens up once the page scrolls.
  React.useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [setOpenMenu, setMobileOpen]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const cta = dashboard ? (
    <Button href={dashboard.href} variant="primary" size="sm">
      <LayoutDashboard className="size-4" aria-hidden="true" /> {dashboard.label}
    </Button>
  ) : (
    <>
      <Button href="/login" variant="ghost" size="sm">
        Log in
      </Button>
      <Button href="/register" variant="primary" size="sm">
        <UserPlus className="size-4" aria-hidden="true" /> Register
      </Button>
    </>
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-0 sm:px-4">
      <div
        ref={navRef}
        onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
        onPointerEnter={cancelClose}
        className={cn(
          "pointer-events-auto relative flex w-full items-center justify-between gap-3 border-x border-b border-line bg-card/85 shadow-[0_14px_40px_-18px_rgba(8,15,40,0.45)] backdrop-blur-xl transition-all duration-300",
          "rounded-b-3xl px-3 sm:px-5 lg:w-auto lg:min-w-[44rem] lg:max-w-[calc(100vw-2rem)] lg:justify-center lg:gap-1",
          compact ? "py-1.5" : "py-2.5",
        )}
      >
        <Link href="/" aria-label="YMCA Hostels home" className="flex shrink-0 items-center gap-2.5 pr-2 font-display font-bold text-ink">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <span className={cn("hidden leading-tight transition-all duration-300 sm:block", compact && "lg:hidden xl:block")}>
            <span className="block text-[15px]">YMCA Hostels</span>
            <span className="block text-[10px] font-medium text-ink-muted">JC Bose University, Faridabad</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          <Link
            href="/"
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-brand-soft hover:text-accent-fg",
              pathname === "/" && "text-accent-fg",
            )}
          >
            Home
          </Link>
          <MenuTrigger id="menu-hostels" label="Hostels" open={openMenu === "hostels"} onToggle={(pt) => toggleMenu("hostels", pt)} onEnter={() => openNow("hostels")} />
          <MenuTrigger id="menu-residents" label="Residents" open={openMenu === "residents"} onToggle={(pt) => toggleMenu("residents", pt)} onEnter={() => openNow("residents")} />
          <MenuTrigger id="menu-guide" label="Guide" open={openMenu === "guide"} onToggle={(pt) => toggleMenu("guide", pt)} onEnter={() => openNow("guide")} />
          <Link
            href="/safety"
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-danger-fg transition-colors hover:bg-danger-soft",
              pathname === "/safety" && "bg-danger-soft",
            )}
          >
            <ShieldAlert className="size-4" aria-hidden="true" /> Safety
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 lg:pl-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface-muted px-3 text-sm text-ink-muted transition-colors hover:border-brand-400 hover:text-ink"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="hidden rounded border border-line bg-card px-1.5 text-[10px] font-medium xl:inline">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <div className="hidden items-center gap-1.5 lg:flex">{cta}</div>
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-brand-soft lg:hidden"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>

        {/* Mega menu panels (desktop) */}
        <div className="hidden lg:block">
          <Panel id="menu-hostels" open={openMenu === "hostels"}>
            <div className="grid gap-2 sm:grid-cols-2">
              {hostels.map((h) => (
                <Link
                  key={h.id}
                  href="/#hostels"
                  onClick={closeAll}
                  className="group/item flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-surface-muted"
                >
                  <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-600 text-white">
                    {h.imageUrl ? (
                      <Image src={h.imageUrl} alt="" fill sizes="64px" className="object-cover transition-transform duration-500 group-hover/item:scale-110" />
                    ) : (
                      <Building2 className="size-6 opacity-80" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">{h.name}</span>
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-accent-fg">{h.code}</span>
                    <span className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">{h.description}</span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line px-2 pt-3 text-sm">
              <span className="text-ink-muted">Compare beds and vacancy for all four hostels.</span>
              <LineHoverLink href="/#hostels" variant="grow" onClick={closeAll} className="items-center gap-1 font-semibold text-accent-fg">
                See all hostels <MoveRight className="size-4" aria-hidden="true" />
              </LineHoverLink>
            </div>
          </Panel>

          <Panel id="menu-residents" open={openMenu === "residents"}>
            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {RESIDENT_ITEMS.map((item) => (
                <ItemLink key={item.title} item={item} onNavigate={closeAll} />
              ))}
            </div>
          </Panel>

          <Panel id="menu-guide" open={openMenu === "guide"}>
            <div className="grid gap-1 sm:grid-cols-2">
              {GUIDE_ITEMS.map((item) => (
                <ItemLink key={item.title} item={item} onNavigate={closeAll} />
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "pointer-events-auto fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        inert={!mobileOpen}
        className={cn(
          "pointer-events-auto fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-card p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-ink">YMCA Hostels</span>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="flex-1">
          <Link href="/" onClick={closeAll} className="flex items-center gap-3 border-b border-line py-4 text-sm font-medium text-ink">
            <Home className="size-4 text-accent-fg" aria-hidden="true" /> Home
          </Link>
          {(
            [
              { id: "hostels" as const, title: "Hostels", items: hostels.map((h) => ({ title: h.name, description: h.code, href: "/#hostels", icon: Building2 })) },
              { id: "residents" as const, title: "Residents", items: RESIDENT_ITEMS },
              { id: "guide" as const, title: "Guide", items: GUIDE_ITEMS },
            ] satisfies { id: MenuId; title: string; items: MenuItem[] }[]
          ).map((section) => {
            const isOpen = mobileSection === section.id;
            return (
              <div key={section.id} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`m-${section.id}`}
                  onClick={() => setMobileSection(isOpen ? null : section.id)}
                  className="flex w-full cursor-pointer items-center justify-between py-4 text-sm font-medium text-ink"
                >
                  {section.title}
                  <ChevronDown className={cn("size-4 text-ink-muted transition-transform duration-200", isOpen && "rotate-180")} aria-hidden="true" />
                </button>
                <div
                  id={`m-${section.id}`}
                  inert={!isOpen}
                  className={cn("grid transition-[grid-template-rows,opacity] duration-300", isOpen ? "grid-rows-[1fr] pb-3 opacity-100" : "grid-rows-[0fr] opacity-0")}
                >
                  <div className="overflow-hidden">
                    <div className="ml-2 flex flex-col gap-0.5 border-l-2 border-line pl-3">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={closeAll}
                            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                          >
                            <Icon className="size-4 text-accent-fg" aria-hidden="true" />
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link href="/safety" onClick={closeAll} className="flex items-center gap-3 border-b border-line py-4 text-sm font-medium text-danger-fg">
            <ShieldAlert className="size-4" aria-hidden="true" /> Safety and contacts
          </Link>
        </nav>

        <div className="mt-6 flex flex-col gap-3" onClick={closeAll}>
          {cta}
        </div>
      </aside>

      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} hostels={hostels} />
    </header>
  );
}
