import type { Metadata } from "next";
import { MessageSquareWarning } from "lucide-react";
import { getCurrentStudent } from "@/lib/student-data";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/stat-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { NewComplaintForm } from "@/components/student/new-complaint-form";
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

export default async function StudentComplaintsPage() {
  const student = await getCurrentStudent();
  if (!student) return null;

  const complaints = await db.complaint.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Complaint box</h1>
        <p className="mt-1 text-sm text-ink-muted">Raise an issue and track it until it&apos;s resolved.</p>
      </div>

      <NewComplaintForm />

      {complaints.length === 0 ? (
        <EmptyState icon={MessageSquareWarning} title="No complaints yet" description="Anything you raise will show up here with its status." />
      ) : (
        <ul className="space-y-3">
          {complaints.map((c) => (
            <li key={c.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-accent-fg">{CATEGORY_LABEL[c.category]}</p>
                  <p className="mt-0.5 font-semibold text-ink">{c.title}</p>
                </div>
                <Badge tone={statusTone(c.status)}>{c.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
              {c.remarks ? (
                <p className="mt-2 rounded-lg bg-surface-muted px-3 py-2 text-xs text-ink-muted">
                  Warden&apos;s note: {c.remarks}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-ink-muted">Raised on {formatDate(c.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
