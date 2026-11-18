import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, Receipt } from "lucide-react";
import { getCurrentStudent } from "@/lib/student-data";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/stat-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Fees" };

const TYPE_LABEL: Record<string, string> = {
  MESS: "Mess fee",
  HOSTEL: "Hostel fee",
  ELECTRICITY: "Electricity & cooler",
};

export default async function StudentFeesPage() {
  const student = await getCurrentStudent();
  if (!student) return null;

  const fees = await db.feeRecord.findMany({
    where: { studentId: student.id },
    orderBy: [{ type: "asc" }, { createdAt: "desc" }],
  });

  const totalDue = fees.filter((f) => f.status === "PENDING").reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Fee records</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Mess fee (monthly), hostel fee (yearly) and electricity & cooler billing (monthly).
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5 text-right">
          <p className="text-xs font-medium text-ink-muted">Total due</p>
          <p className="font-mono text-lg font-bold text-ink">{formatINR(totalDue)}</p>
        </div>
      </div>

      {fees.length === 0 ? (
        <EmptyState icon={Wallet} title="No fee records yet" description="Your warden's office will add fee records once your admission is confirmed." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)] bg-[var(--color-surface)]">
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td className="px-4 py-3 font-medium text-ink">{TYPE_LABEL[fee.type]}</td>
                  <td className="px-4 py-3 font-mono text-ink-muted">{fee.periodLabel}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{formatINR(fee.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(fee.status)}>{fee.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {fee.status === "PAID" ? (
                      <Link
                        href={`/student/receipts/${fee.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
                      >
                        <Receipt className="size-3.5" aria-hidden="true" /> View
                      </Link>
                    ) : (
                      <span className="text-xs text-ink-muted">Not yet paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-ink-muted">
        Payments are recorded by your hostel&apos;s accounts office once received. This demo build does
        not process real payments.
      </p>
    </div>
  );
}
