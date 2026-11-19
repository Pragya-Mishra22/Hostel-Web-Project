import { redirect } from "next/navigation";
import { AppShell, type AppNavItem } from "@/components/site/app-shell";
import { getCurrentStudent } from "@/lib/student-data";

// Plain string icon names (not component references): a Server Component
// can't pass a function as a prop into the client AppShell. See
// icon-registry.ts for why.
const NAV_ITEMS: AppNavItem[] = [
  { label: "Dashboard", href: "/student", icon: "LayoutDashboard" },
  { label: "Room", href: "/student/room", icon: "BedDouble" },
  { label: "Fees", href: "/student/fees", icon: "Wallet" },
  { label: "Complaints", href: "/student/complaints", icon: "MessageSquareWarning" },
  { label: "Leave", href: "/student/leave", icon: "CalendarClock" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const student = await getCurrentStudent();
  if (!student) redirect("/login");

  return (
    <AppShell area="student" navItems={NAV_ITEMS} userName={student.user.name} roleLabel={`Student · ${student.rollNumber}`}>
      {children}
    </AppShell>
  );
}
