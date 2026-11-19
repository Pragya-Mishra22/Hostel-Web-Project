import { redirect } from "next/navigation";
import { AppShell, type AppNavItem } from "@/components/site/app-shell";
import { getCurrentStaff } from "@/lib/admin-data";

// Plain string icon names (not component references): a Server Component
// can't pass a function as a prop into the client AppShell. See
// icon-registry.ts for why.
const NAV_ITEMS: AppNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Admissions", href: "/admin/admissions", icon: "ClipboardCheck" },
  { label: "Rooms", href: "/admin/rooms", icon: "BedDouble" },
  { label: "Students", href: "/admin/students", icon: "Users" },
  { label: "Fees", href: "/admin/fees", icon: "Wallet" },
  { label: "Complaints", href: "/admin/complaints", icon: "MessageSquareWarning" },
  { label: "Leaves", href: "/admin/leaves", icon: "CalendarClock" },
  { label: "Gate register", href: "/admin/gate", icon: "DoorOpen" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff();
  if (!staff) redirect("/login");

  const roleLabel = staff.role === "CHIEF_WARDEN" ? "Chief Warden" : "Warden";

  return (
    <AppShell area="admin" navItems={NAV_ITEMS} userName={staff.name} roleLabel={roleLabel}>
      {children}
    </AppShell>
  );
}
