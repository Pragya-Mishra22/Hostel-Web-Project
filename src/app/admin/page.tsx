import type { Metadata } from "next";
import { ClipboardCheck, BedDouble, CalendarClock, LogOut, LogIn as LogInIcon } from "lucide-react";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { StatCard } from "@/components/ui/stat-card";
import { OccupancyChart, ComplaintsChart, FeesChart } from "@/components/admin/dashboard-charts";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const staff = await getCurrentStaff();
  if (!staff) return null;

  const hostels = await getManagedHostels(staff);
  const hostelIds = hostels.map((h) => h.id);
  const hostelFilter = staff.role === "WARDEN" ? { hostelId: { in: hostelIds } } : {};
  const studentHostelFilter = staff.role === "WARDEN" ? { hostelId: { in: hostelIds } } : {};

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [pendingAdmissions, pendingLeaves, complaintsByStatus, feesByType, movementsToday, occupancyData] =
    await Promise.all([
      db.student.count({ where: { admissionStatus: "PENDING", ...studentHostelFilter } }),
      db.leaveApplication.count({ where: { status: "PENDING", ...hostelFilter } }),
      db.complaint.groupBy({ by: ["status"], _count: { _all: true }, where: hostelFilter }),
      db.feeRecord.groupBy({
        by: ["type", "status"],
        _sum: { amount: true },
        where: { student: studentHostelFilter },
      }),
      db.movementLog.findMany({
        where: { timestamp: { gte: todayStart, lte: todayEnd }, student: studentHostelFilter },
      }),
      db.hostel.findMany({
        where: hostelIds.length ? { id: { in: hostelIds } } : {},
        include: { rooms: { include: { beds: true } } },
        orderBy: { name: "asc" },
      }),
    ]);

  const occupancyChartData = occupancyData.map((h) => {
    const beds = h.rooms.flatMap((r) => r.beds);
    const occupied = beds.filter((b) => b.studentId).length;
    return { hostel: h.code, occupied, vacant: beds.length - occupied };
  });

  const statusLabel: Record<string, string> = { OPEN: "Open", IN_PROGRESS: "In progress", RESOLVED: "Resolved" };
  const complaintsChartData = ["OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => ({
    status: statusLabel[status],
    count: complaintsByStatus.find((c) => c.status === status)?._count._all ?? 0,
  }));

  const typeLabel: Record<string, string> = { MESS: "Mess", HOSTEL: "Hostel", ELECTRICITY: "Electricity" };
  const feesChartData = ["MESS", "HOSTEL", "ELECTRICITY"].map((type) => ({
    type: typeLabel[type],
    paid: feesByType.find((f) => f.type === type && f.status === "PAID")?._sum.amount ?? 0,
    pending: feesByType.find((f) => f.type === type && f.status === "PENDING")?._sum.amount ?? 0,
  }));

  const departuresToday = movementsToday.filter((m) => m.type === "DEPARTURE").length;
  const returnsToday = movementsToday.filter((m) => m.type === "RETURN").length;

  const totalBeds = occupancyChartData.reduce((s, h) => s + h.occupied + h.vacant, 0);
  const totalOccupied = occupancyChartData.reduce((s, h) => s + h.occupied, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">
          {staff.role === "CHIEF_WARDEN" ? "All hostels overview" : `${hostels[0]?.name ?? "Your hostel"} overview`}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">A snapshot of today across admissions, rooms, fees and leave.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Pending admissions" value={pendingAdmissions} icon={ClipboardCheck} tone={pendingAdmissions > 0 ? "warning" : "success"} />
        <StatCard label="Beds occupied" value={`${totalOccupied} / ${totalBeds}`} icon={BedDouble} tone="brand" />
        <StatCard label="Leaves awaiting decision" value={pendingLeaves} icon={CalendarClock} tone={pendingLeaves > 0 ? "warning" : "success"} />
        <StatCard label="Departed today" value={departuresToday} icon={LogOut} tone="warning" />
        <StatCard label="Returned today" value={returnsToday} icon={LogInIcon} tone="success" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-base font-bold text-ink">Room occupancy</h2>
          <OccupancyChart data={occupancyChartData} />
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-base font-bold text-ink">Complaints by status</h2>
          <ComplaintsChart data={complaintsChartData} />
        </div>

        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-base font-bold text-ink">Fee collection vs pending (Rs)</h2>
          <FeesChart data={feesChartData} />
        </div>
      </div>
    </div>
  );
}
