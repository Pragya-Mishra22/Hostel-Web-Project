"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, HelpCircle, LogIn, ShieldAlert, UserPlus, BookOpen } from "lucide-react";
import { SearchModal, type SearchResult } from "@/components/ui/search-modal";
import type { NavHostel } from "@/components/site/notch-nav";

/**
 * The public-site search palette: hostels (with an Apply shortcut), pages and
 * quick actions. Mount one instance with `hotkey="k"` and any others with
 * `hotkey={null}` so Ctrl+K never toggles two modals at once.
 */
export function SiteSearch({
  open,
  onOpenChange,
  hostels,
  hotkey = "k",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostels: NavHostel[];
  hotkey?: string | null;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const results: SearchResult[] = React.useMemo(
    () => [
      ...hostels.map((h) => ({
        id: `hostel-${h.id}`,
        name: h.name,
        meta: h.code,
        category: "hostels",
        icon: Building2,
        avatar: h.imageUrl ?? undefined,
        href: "/#hostels",
        actions: [
          {
            icon: UserPlus,
            label: `Apply to ${h.name}`,
            onClick: () => {
              onOpenChange(false);
              router.push(`/register?hostel=${h.id}`);
            },
          },
        ],
      })),
      { id: "p-safety", name: "Safety and contacts", meta: "ragging, harassment, emergency", category: "pages", icon: ShieldAlert, href: "/safety" },
      { id: "p-faq", name: "Frequently asked questions", meta: "fees, leave, admission", category: "pages", icon: HelpCircle, href: "/#faq" },
      { id: "p-ess", name: "Hostel essentials", meta: "fees, rules, facilities, documents", category: "pages", icon: BookOpen, href: "/#essentials" },
      { id: "p-register", name: "Student registration", meta: "apply for a seat", category: "pages", icon: UserPlus, href: "/register" },
      { id: "p-login", name: "Log in", meta: "student, warden", category: "pages", icon: LogIn, href: "/login" },
    ],
    [hostels, router, onOpenChange],
  );

  return (
    <SearchModal
      open={open}
      onOpenChange={onOpenChange}
      query={query}
      onQueryChange={setQuery}
      placeholder="Search hostels, pages and help"
      hotkey={hotkey}
      tags={[
        { id: "hostels", label: "Hostels", icon: Building2 },
        { id: "pages", label: "Pages", icon: HelpCircle },
      ]}
      results={results}
      quickActions={[
        { label: "Register as a student", icon: UserPlus, shortcut: "r", href: "/register" },
        { label: "Log in", icon: LogIn, shortcut: "l", href: "/login" },
        { label: "Safety and emergency contacts", icon: ShieldAlert, shortcut: "s", href: "/safety" },
      ]}
      onNavigate={(href) => router.push(href)}
    />
  );
}
