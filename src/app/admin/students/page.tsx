import Link from "next/link";
import type { Metadata } from "next";
import { Users, Search } from "lucide-react";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/stat-card";
import { Badge, statusTone } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Students" };

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const staff = await getCurrentStaff();
  if (!staff) return null;
  const hostels = await getManagedHostels(staff);
  const { q } = await searchParams;

  const students = await db.student.findMany({
    where: {
      hostelId: { in: hostels.map((h) => h.id) },
      ...(q
        ? {
            OR: [
              { rollNumber: { contains: q } },
              { user: { name: { contains: q } } },
            ],
          }
        : {}),
    },
    include: { user: true, hostel: true, bed: { include: { room: true } } },
    orderBy: { rollNumber: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Students</h1>
        <p className="mt-1 text-sm text-ink-muted">{students.length} student{students.length === 1 ? "" : "s"} in your hostel{hostels.length > 1 ? "s" : ""}.</p>
      </div>

      <form className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or roll number"
          className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] pl-10 pr-3.5 text-sm text-ink outline-none focus:border-brand-500"
        />
      </form>

      {students.length === 0 ? (
        <EmptyState icon={Users} title="No students found" description="Try a different search, or check back once admissions are approved." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Roll no.</th>
                <th className="px-4 py-3">Hostel</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)] bg-[var(--color-surface)]">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/students/${s.id}`} className="font-medium text-ink hover:text-brand-700 hover:underline">
                      {s.user.name}
                    </Link>
                    <p className="text-xs text-ink-muted">{s.course}, Year {s.year}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-muted">{s.rollNumber}</td>
                  <td className="px-4 py-3 text-ink-muted">{s.hostel?.code}</td>
                  <td className="px-4 py-3 text-ink-muted">{s.bed ? `${s.bed.room.roomNumber} / ${s.bed.bedNumber}` : "Not allocated"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(s.admissionStatus)}>{s.admissionStatus}</Badge>
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
