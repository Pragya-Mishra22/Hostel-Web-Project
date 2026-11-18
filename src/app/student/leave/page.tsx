import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { getCurrentStudent } from "@/lib/student-data";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/stat-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { NewLeaveForm } from "@/components/student/new-leave-form";
import { GatePass } from "@/components/student/gate-pass";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Leave" };

export default async function StudentLeavePage() {
  const student = await getCurrentStudent();
  if (!student) return null;

  const leaves = await db.leaveApplication.findMany({
    where: { studentId: student.id },
    include: { decidedBy: true },
    orderBy: { appliedAt: "desc" },
  });

  const hasPending = leaves.some((l) => l.status === "PENDING");
  const latestApproved = leaves.find((l) => l.status === "APPROVED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Leave &amp; gate pass</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Apply for leave; once your warden approves it, your gate pass appears below.
        </p>
      </div>

      {latestApproved ? (
        <GatePass
          leave={{
            id: latestApproved.id,
            studentName: student.user.name,
            rollNumber: student.rollNumber,
            hostelName: student.hostel?.name ?? "",
            fromDate: latestApproved.fromDate,
            toDate: latestApproved.toDate,
            destination: latestApproved.destination,
            reason: latestApproved.reason,
            decidedAt: latestApproved.decidedAt,
            decidedByName: latestApproved.decidedBy?.name ?? null,
          }}
        />
      ) : null}

      {hasPending ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-warning-600 dark:bg-amber-950/20">
          Your latest application is awaiting your warden&apos;s decision.
        </div>
      ) : (
        <NewLeaveForm />
      )}

      <div>
        <h2 className="mb-3 font-display text-base font-bold text-ink">Application history</h2>
        {leaves.length === 0 ? (
          <EmptyState icon={CalendarClock} title="No leave applications yet" description="Your applications and their status will appear here." />
        ) : (
          <ul className="space-y-3">
            {leaves.map((l) => (
              <li key={l.id} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{l.destination}</p>
                    <p className="text-xs text-ink-muted">
                      {formatDate(l.fromDate)} to {formatDate(l.toDate)}
                    </p>
                  </div>
                  <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{l.reason}</p>
                {l.wardenRemarks ? (
                  <p className="mt-2 rounded-lg bg-surface-muted px-3 py-2 text-xs text-ink-muted">
                    Warden&apos;s note: {l.wardenRemarks}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
