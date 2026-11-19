import Link from "next/link";
import type { Metadata } from "next";
import { BedDouble, Wallet, MessageSquareWarning, CalendarClock, ArrowRight, CheckCircle2 } from "lucide-react";
import { getCurrentStudent } from "@/lib/student-data";
import { db } from "@/lib/db";
import { StatCard } from "@/components/ui/stat-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function StudentDashboardPage() {
  const student = await getCurrentStudent();
  if (!student) return null;

  const [pendingFees, openComplaints, latestLeave] = await Promise.all([
    db.feeRecord.findMany({ where: { studentId: student.id, status: "PENDING" } }),
    db.complaint.count({ where: { studentId: student.id, status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    db.leaveApplication.findFirst({
      where: { studentId: student.id },
      orderBy: { appliedAt: "desc" },
    }),
  ]);

  const duesTotal = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Welcome back, {student.user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {student.hostel ? student.hostel.name : "No hostel assigned yet"} · Roll no. {student.rollNumber}
        </p>
      </div>

      {student.admissionStatus === "PENDING" ? (
        <div className="rounded-2xl border border-warning-500/30 bg-warning-soft px-5 py-4 text-sm text-warning-fg">
          Your admission is still pending warden approval. Some features unlock once you&apos;re approved.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Room"
          value={student.bed ? `Room ${student.bed.room.roomNumber}` : "Not allocated"}
          icon={BedDouble}
          tone={student.bed ? "success" : "warning"}
          hint={student.bed ? `Bed ${student.bed.bedNumber}` : "Visit the Room page to request one"}
        />
        <StatCard
          label="Fees due"
          value={formatINR(duesTotal)}
          icon={Wallet}
          tone={duesTotal > 0 ? "danger" : "success"}
          hint={`${pendingFees.length} pending record${pendingFees.length === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Open complaints"
          value={openComplaints}
          icon={MessageSquareWarning}
          tone={openComplaints > 0 ? "warning" : "success"}
        />
        <StatCard
          label="Latest leave"
          value={latestLeave ? latestLeave.status : "None yet"}
          icon={CalendarClock}
          tone={latestLeave?.status === "APPROVED" ? "success" : latestLeave?.status === "REJECTED" ? "danger" : "brand"}
        />
      </div>

      {latestLeave?.status === "APPROVED" ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-success-500/30 bg-success-soft p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success-fg" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">You have an approved gate pass</p>
              <p className="text-sm text-ink-muted">Show it at the gate when you leave or return.</p>
            </div>
          </div>
          <Link
            href="/student/leave"
            className="shrink-0 rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white hover:bg-success-600"
          >
            View gate pass
          </Link>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Fee dues</h2>
            <LineHoverLink href="/student/fees" className="flex items-center gap-1 text-sm font-medium text-accent-fg">
              View all <ArrowRight className="size-3.5" aria-hidden="true" />
            </LineHoverLink>
          </div>
          {pendingFees.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">You&apos;re all caught up, nothing pending.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pendingFees.slice(0, 4).map((f) => (
                <li key={f.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">
                    {f.type} · {f.periodLabel}
                  </span>
                  <span className="font-mono font-semibold text-ink">{formatINR(f.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Recent leave status</h2>
            <LineHoverLink href="/student/leave" className="flex items-center gap-1 text-sm font-medium text-accent-fg">
              Apply / view <ArrowRight className="size-3.5" aria-hidden="true" />
            </LineHoverLink>
          </div>
          {!latestLeave ? (
            <p className="mt-4 text-sm text-ink-muted">You haven&apos;t applied for leave yet.</p>
          ) : (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-ink">{latestLeave.destination}</span>
              <Badge tone={statusTone(latestLeave.status)}>{latestLeave.status}</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
