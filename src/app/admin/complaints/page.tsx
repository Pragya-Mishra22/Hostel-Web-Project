import type { Metadata } from "next";
import { MessageSquareWarning } from "lucide-react";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { EmptyState, StatCard } from "@/components/ui/stat-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { ComplaintStatusForm } from "@/components/admin/complaint-status-form";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Complaints" };

const CATEGORY_LABEL: Record<string, string> = {
  ELECTRICAL: "Electrical",
  PLUMBING: "Plumbing",
  WIFI: "Wi-Fi",
  CLEANLINESS: "Cleanliness",
  MESS: "Mess",
  OTHER: "Other",
};

export default async function AdminComplaintsPage() {
  const staff = await getCurrentStaff();
  if (!staff) return null;
  const hostels = await getManagedHostels(staff);

  const complaints = await db.complaint.findMany({
    where: { hostelId: { in: hostels.map((h) => h.id) } },
    include: { student: { include: { user: true } }, hostel: true },
    orderBy: { createdAt: "desc" },
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const today = complaints.filter((c) => c.createdAt >= todayStart).length;
  const open = complaints.filter((c) => c.status === "OPEN").length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Complaint box</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Every complaint raised across {hostels.length > 1 ? "your hostels" : hostels[0]?.name ?? "your hostel"}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Raised today" value={today} icon={MessageSquareWarning} tone="brand" />
        <StatCard label="Still open" value={open} icon={MessageSquareWarning} tone="warning" />
        <StatCard label="Resolved" value={resolved} icon={MessageSquareWarning} tone="success" />
      </div>

      {complaints.length === 0 ? (
        <EmptyState icon={MessageSquareWarning} title="No complaints yet" description="New complaints from students will appear here." />
      ) : (
        <ul className="space-y-3">
          {complaints.map((c) => (
            <li key={c.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-accent-fg">
                    {CATEGORY_LABEL[c.category]} · {c.hostel.code}
                  </p>
                  <p className="mt-0.5 font-semibold text-ink">{c.title}</p>
                  <p className="text-xs text-ink-muted">
                    {c.student.user.name} ({c.student.rollNumber}) · {formatDate(c.createdAt)}
                  </p>
                </div>
                <Badge tone={statusTone(c.status)}>{c.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
              <ComplaintStatusForm complaintId={c.id} currentStatus={c.status} currentRemarks={c.remarks} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
