import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Phone, MapPin, GraduationCap, BedDouble } from "lucide-react";
import { getCurrentStaff } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { Badge, statusTone } from "@/components/ui/badge";
import { formatDate, formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Student profile" };

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await getCurrentStaff();
  if (!staff) return null;
  const { id } = await params;

  const student = await db.student.findUnique({
    where: { id },
    include: {
      user: true,
      hostel: true,
      bed: { include: { room: true } },
      feeRecords: { orderBy: { createdAt: "desc" } },
      complaints: { orderBy: { createdAt: "desc" } },
      leaves: { orderBy: { appliedAt: "desc" } },
    },
  });
  if (!student) notFound();
  if (staff.role === "WARDEN" && student.hostelId !== staff.hostelId) notFound();

  const duesTotal = student.feeRecords.filter((f) => f.status === "PENDING").reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{student.user.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {student.rollNumber} · {student.course}, Year {student.year}
          </p>
        </div>
        <Badge tone={statusTone(student.admissionStatus)}>{student.admissionStatus}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-line bg-card p-5 lg:col-span-1">
          <h2 className="font-display text-sm font-bold text-ink">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
              <dd className="text-ink">{student.phone}</dd>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
              <dd className="text-ink">{student.hostel?.name}</dd>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
              <dd className="text-ink">{student.bed ? `Room ${student.bed.room.roomNumber}, Bed ${student.bed.bedNumber}` : "Not allocated"}</dd>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ink-muted" aria-hidden="true" />
              <dd className="text-ink">{student.address}</dd>
            </div>
          </dl>
          <div className="border-t border-line pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Guardian</p>
            <p className="mt-1 text-sm text-ink">{student.guardianName}</p>
            <p className="text-sm text-ink-muted">{student.guardianPhone}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-line bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-ink">Fee records</h2>
            <span className="font-mono text-sm font-semibold text-ink">Due: {formatINR(duesTotal)}</span>
          </div>
          {student.feeRecords.length === 0 ? (
            <p className="text-sm text-ink-muted">No fee records yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {student.feeRecords.slice(0, 8).map((f) => (
                <li key={f.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-ink">
                    {f.type} · {f.periodLabel}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-ink-muted">{formatINR(f.amount)}</span>
                    <Badge tone={statusTone(f.status)}>{f.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-sm font-bold text-ink">Complaints</h2>
          {student.complaints.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">No complaints raised.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {student.complaints.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{c.title}</span>
                  <Badge tone={statusTone(c.status)}>{c.status.replace("_", " ")}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-sm font-bold text-ink">Leave history</h2>
          {student.leaves.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">No leave applications.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {student.leaves.map((l) => (
                <li key={l.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">
                    {l.destination} · {formatDate(l.fromDate)}
                  </span>
                  <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
