import Link from "next/link";
import type { Metadata } from "next";
import { BedDouble, Home, Users } from "lucide-react";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { StatCard, EmptyState } from "@/components/ui/stat-card";
import { RoomGrid } from "@/components/admin/room-grid";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Rooms" };

export default async function AdminRoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ hostel?: string }>;
}) {
  const staff = await getCurrentStaff();
  if (!staff) return null;
  const hostels = await getManagedHostels(staff);
  if (hostels.length === 0) {
    return <EmptyState icon={Home} title="No hostel assigned" description="Contact the chief warden to be assigned to a hostel." />;
  }

  const { hostel: hostelParam } = await searchParams;
  const activeHostel = hostels.find((h) => h.id === hostelParam) ?? hostels[0];

  const rooms = await db.room.findMany({
    where: { hostelId: activeHostel.id },
    include: { beds: { include: { student: { include: { user: true } } } } },
    orderBy: [{ floor: "asc" }, { roomNumber: "asc" }],
  });

  const unassigned = await db.student.findMany({
    where: { hostelId: activeHostel.id, admissionStatus: "APPROVED", bed: null },
    include: { user: true },
    orderBy: { rollNumber: "asc" },
  });

  const beds = rooms.flatMap((r) => r.beds);
  const totalBeds = beds.length;
  const occupied = beds.filter((b) => b.studentId).length;

  const roomGridData = rooms.map((room) => ({
    id: room.id,
    roomNumber: room.roomNumber,
    floor: room.floor,
    capacity: room.capacity,
    beds: room.beds
      .sort((a, b) => a.bedNumber - b.bedNumber)
      .map((b) => ({
        id: b.id,
        bedNumber: b.bedNumber,
        studentName: b.student?.user.name ?? null,
        rollNumber: b.student?.rollNumber ?? null,
      })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Rooms &amp; beds</h1>
        <p className="mt-1 text-sm text-ink-muted">Allocate or vacate beds for approved students.</p>
      </div>

      {hostels.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {hostels.map((h) => (
            <Link
              key={h.id}
              href={`/admin/rooms?hostel=${h.id}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                h.id === activeHostel.id
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-[var(--color-line)] text-ink-muted hover:border-brand-300 hover:text-ink",
              )}
            >
              {h.code}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total beds" value={totalBeds} icon={BedDouble} tone="brand" />
        <StatCard label="Occupied" value={occupied} icon={Users} tone="success" />
        <StatCard label="Vacant" value={totalBeds - occupied} icon={Home} tone="warning" />
      </div>

      <RoomGrid
        rooms={roomGridData}
        unassignedStudents={unassigned.map((s) => ({ id: s.id, name: s.user.name, rollNumber: s.rollNumber }))}
      />
    </div>
  );
}
