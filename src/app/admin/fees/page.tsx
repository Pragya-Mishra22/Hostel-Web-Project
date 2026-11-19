import type { Metadata } from "next";
import { Wallet } from "lucide-react";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { EmptyState, StatCard } from "@/components/ui/stat-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { FeeToggleButton } from "@/components/admin/fee-toggle-button";
import { AddFeeForm } from "@/components/admin/add-fee-form";
import Link from "next/link";
import { formatINR, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Fees" };

const TYPE_LABEL: Record<string, string> = { MESS: "Mess", HOSTEL: "Hostel", ELECTRICITY: "Electricity & cooler" };

export default async function AdminFeesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const staff = await getCurrentStaff();
  if (!staff) return null;
  const hostels = await getManagedHostels(staff);
  const { type, status } = await searchParams;

  const fees = await db.feeRecord.findMany({
    where: {
      student: { hostelId: { in: hostels.map((h) => h.id) } },
      ...(type ? { type: type as never } : {}),
      ...(status ? { status: status as never } : {}),
    },
    include: { student: { include: { user: true, hostel: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const students = await db.student.findMany({
    where: { hostelId: { in: hostels.map((h) => h.id) }, admissionStatus: "APPROVED" },
    include: { user: true },
    orderBy: { rollNumber: "asc" },
  });

  const totalPending = fees.filter((f) => f.status === "PENDING").reduce((s, f) => s + f.amount, 0);
  const totalPaid = fees.filter((f) => f.status === "PAID").reduce((s, f) => s + f.amount, 0);

  const filterLink = (params: Record<string, string | undefined>) => {
    const merged = { type, status, ...params };
    const qs = new URLSearchParams(
      Object.entries(merged).filter(([, v]) => v) as [string, string][],
    ).toString();
    return `/admin/fees${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Fee records</h1>
        <p className="mt-1 text-sm text-ink-muted">Mess, hostel and electricity &amp; cooler charges, by student.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Collected (shown below)" value={formatINR(totalPaid)} icon={Wallet} tone="success" />
        <StatCard label="Pending (shown below)" value={formatINR(totalPending)} icon={Wallet} tone="warning" />
      </div>

      <AddFeeForm students={students.map((s) => ({ id: s.id, name: s.user.name, rollNumber: s.rollNumber }))} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Type</span>
        {["MESS", "HOSTEL", "ELECTRICITY"].map((t) => (
          <Link
            key={t}
            href={filterLink({ type: type === t ? undefined : t })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              type === t ? "border-brand-600 bg-brand-600 text-white" : "border-line text-ink-muted",
            )}
          >
            {TYPE_LABEL[t]}
          </Link>
        ))}
        <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Status</span>
        {["PENDING", "PAID"].map((s) => (
          <Link
            key={s}
            href={filterLink({ status: status === s ? undefined : s })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              status === s ? "border-brand-600 bg-brand-600 text-white" : "border-line text-ink-muted",
            )}
          >
            {s}
          </Link>
        ))}
      </div>

      {fees.length === 0 ? (
        <EmptyState icon={Wallet} title="No fee records match" description="Try clearing a filter, or add a new record above." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-card">
              {fees.map((f) => (
                <tr key={f.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{f.student.user.name}</p>
                    <p className="font-mono text-xs text-ink-muted">{f.student.rollNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{TYPE_LABEL[f.type]}</td>
                  <td className="px-4 py-3 font-mono text-ink-muted">{f.periodLabel}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{formatINR(f.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(f.status)}>{f.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <FeeToggleButton feeId={f.id} status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
