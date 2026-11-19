import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { getCurrentStudent } from "@/lib/student-data";
import { db } from "@/lib/db";
import { formatDate, formatINR, shortCode } from "@/lib/utils";
import { PrintButton } from "@/components/student/print-button";

export const metadata: Metadata = { title: "Receipt" };

const TYPE_LABEL: Record<string, string> = {
  MESS: "Mess fee",
  HOSTEL: "Hostel fee",
  ELECTRICITY: "Electricity & cooler charge",
};

export default async function ReceiptPage({ params }: { params: Promise<{ feeId: string }> }) {
  const { feeId } = await params;
  const student = await getCurrentStudent();
  if (!student) return null;

  const fee = await db.feeRecord.findUnique({ where: { id: feeId } });
  if (!fee || fee.studentId !== student.id || fee.status !== "PAID") notFound();

  return (
    <div className="mx-auto max-w-xl">
      <div className="no-print mb-4 flex justify-end">
        <PrintButton />
      </div>

      <div className="rounded-2xl border border-line bg-card p-8 print:rounded-none print:border-0 print:p-0">
        <div className="flex items-center gap-3 border-b border-line pb-5">
          <span className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-base font-bold text-ink">J C Bose University of Science &amp; Technology, YMCA</p>
            <p className="text-xs text-ink-muted">Hostel Fee Receipt</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">Receipt number</dt>
            <dd className="font-mono font-semibold text-ink">{fee.receiptNo ?? shortCode(fee.id)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Paid on</dt>
            <dd className="font-medium text-ink">{fee.paidAt ? formatDate(fee.paidAt) : "Not recorded"}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Student</dt>
            <dd className="font-medium text-ink">{student.user.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Roll number</dt>
            <dd className="font-mono font-medium text-ink">{student.rollNumber}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Hostel</dt>
            <dd className="font-medium text-ink">{student.hostel?.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Fee type</dt>
            <dd className="font-medium text-ink">{TYPE_LABEL[fee.type]}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Billing period</dt>
            <dd className="font-medium text-ink">{fee.periodLabel}</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-surface-muted px-5 py-4 print:bg-transparent print:px-0">
          <span className="text-sm font-semibold text-ink">Amount paid</span>
          <span className="font-mono text-xl font-bold tabular-nums text-ink">{formatINR(fee.amount)}</span>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          This is a system-generated receipt from the hostel portal and does not require a signature.
        </p>
      </div>
    </div>
  );
}
