import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/stat-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { LeaveDecisionForm } from "@/components/admin/leave-decision-form";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Leaves" };

export default async function AdminLeavesPage() {
  const staff = await getCurrentStaff();
  if (!staff) return null;
  const hostels = await getManagedHostels(staff);

  const leaves = await db.leaveApplication.findMany({
    where: { hostelId: { in: hostels.map((h) => h.id) } },
    include: { student: { include: { user: true } } },
    orderBy: { appliedAt: "desc" },
  });

  const pending = leaves.filter((l) => l.status === "PENDING");
  const decided = leaves.filter((l) => l.status !== "PENDING");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Leave applications</h1>
        <p className="mt-1 text-sm text-ink-muted">Approve or reject requests; approved ones become a gate pass.</p>
      </div>

      <div>
        <h2 className="mb-3 font-display text-base font-bold text-ink">Awaiting a decision ({pending.length})</h2>
        {pending.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nothing waiting" description="No leave applications need your decision right now." />
        ) : (
          <ul className="space-y-3">
            {pending.map((l) => (
              <li key={l.id} className="rounded-xl border border-warning-500/30 bg-warning-soft p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{l.student.user.name} ({l.student.rollNumber})</p>
                    <p className="text-sm text-ink-muted">
                      {formatDate(l.fromDate)} to {formatDate(l.toDate)} · {l.destination}
                    </p>
                  </div>
                  <Badge tone="warning">PENDING</Badge>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{l.reason}</p>
                <LeaveDecisionForm leaveId={l.id} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-display text-base font-bold text-ink">Decided</h2>
        {decided.length === 0 ? (
          <p className="text-sm text-ink-muted">No past decisions yet.</p>
        ) : (
          <ul className="space-y-2">
            {decided.slice(0, 20).map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-lg border border-line bg-card px-4 py-2.5 text-sm">
                <span className="text-ink">
                  {l.student.user.name} · {l.destination}
                </span>
                <Badge tone={statusTone(l.status)}>{l.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
