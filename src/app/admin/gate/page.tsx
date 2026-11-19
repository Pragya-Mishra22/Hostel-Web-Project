import type { Metadata } from "next";
import { DoorOpen, LogOut, LogIn } from "lucide-react";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { StatCard, EmptyState } from "@/components/ui/stat-card";
import { MovementActionButton } from "@/components/admin/movement-action-button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Gate register" };

export default async function AdminGatePage() {
  const staff = await getCurrentStaff();
  if (!staff) return null;
  const hostels = await getManagedHostels(staff);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [approvedLeaves, movementsToday] = await Promise.all([
    db.leaveApplication.findMany({
      where: { hostelId: { in: hostels.map((h) => h.id) }, status: "APPROVED" },
      include: { student: { include: { user: true } }, movementLogs: true },
      orderBy: { fromDate: "asc" },
    }),
    db.movementLog.findMany({
      where: { timestamp: { gte: todayStart, lte: todayEnd }, student: { hostelId: { in: hostels.map((h) => h.id) } } },
      include: { student: { include: { user: true } } },
      orderBy: { timestamp: "desc" },
    }),
  ]);

  const awaitingDeparture = approvedLeaves.filter((l) => !l.movementLogs.some((m) => m.type === "DEPARTURE"));
  const outNow = approvedLeaves.filter(
    (l) => l.movementLogs.some((m) => m.type === "DEPARTURE") && !l.movementLogs.some((m) => m.type === "RETURN"),
  );

  const departuresToday = movementsToday.filter((m) => m.type === "DEPARTURE").length;
  const returnsToday = movementsToday.filter((m) => m.type === "RETURN").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Gate register</h1>
        <p className="mt-1 text-sm text-ink-muted">Log who left and who&apos;s back, straight from an approved leave.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Left today" value={departuresToday} icon={LogOut} tone="warning" />
        <StatCard label="Returned today" value={returnsToday} icon={LogIn} tone="success" />
        <StatCard label="Currently out" value={outNow.length} icon={DoorOpen} tone="brand" />
      </div>

      <div>
        <h2 className="mb-3 font-display text-base font-bold text-ink">Approved, not yet departed</h2>
        {awaitingDeparture.length === 0 ? (
          <EmptyState icon={DoorOpen} title="Nothing to log" description="Every approved leave has a departure logged." />
        ) : (
          <ul className="space-y-2">
            {awaitingDeparture.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-4">
                <div>
                  <p className="font-medium text-ink">{l.student.user.name} ({l.student.rollNumber})</p>
                  <p className="text-xs text-ink-muted">
                    {formatDate(l.fromDate)} to {formatDate(l.toDate)} · {l.destination}
                  </p>
                </div>
                <MovementActionButton leaveId={l.id} type="DEPARTURE" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-display text-base font-bold text-ink">Currently out, awaiting return</h2>
        {outNow.length === 0 ? (
          <EmptyState icon={DoorOpen} title="Nobody's out" description="Everyone with an approved leave has returned." />
        ) : (
          <ul className="space-y-2">
            {outNow.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-4">
                <div>
                  <p className="font-medium text-ink">{l.student.user.name} ({l.student.rollNumber})</p>
                  <p className="text-xs text-ink-muted">Expected back by {formatDate(l.toDate)}</p>
                </div>
                <MovementActionButton leaveId={l.id} type="RETURN" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
