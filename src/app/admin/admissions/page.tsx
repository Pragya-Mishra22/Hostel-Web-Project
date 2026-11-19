import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/stat-card";
import { AdmissionActions } from "@/components/admin/admission-actions";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admissions" };

export default async function AdmissionsPage() {
  const staff = await getCurrentStaff();
  if (!staff) return null;
  const hostels = await getManagedHostels(staff);

  const pending = await db.student.findMany({
    where: { admissionStatus: "PENDING", hostelId: { in: hostels.map((h) => h.id) } },
    include: { user: true, hostel: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Pending admissions</h1>
        <p className="mt-1 text-sm text-ink-muted">Review new student applications and approve or reject them.</p>
      </div>

      {pending.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No pending admissions" description="Nothing is waiting on your review right now." />
      ) : (
        <ul className="space-y-3">
          {pending.map((student) => (
            <li
              key={student.id}
              className="flex flex-col gap-4 rounded-xl border border-line bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-ink">{student.user.name}</p>
                <p className="text-sm text-ink-muted">
                  {student.rollNumber} · {student.course}, Year {student.year} · {student.hostel?.name}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Applied {formatDate(student.createdAt)} · Guardian: {student.guardianName} ({student.guardianPhone})
                </p>
              </div>
              <AdmissionActions studentId={student.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
