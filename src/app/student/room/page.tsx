import type { Metadata } from "next";
import { BedDouble, CheckCircle2 } from "lucide-react";
import { getCurrentStudent } from "@/lib/student-data";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/stat-card";
import { RoomPicker, type RoomOption } from "@/components/student/room-picker";

export const metadata: Metadata = { title: "Room" };

export default async function StudentRoomPage() {
  const student = await getCurrentStudent();
  if (!student) return null;

  if (student.bed) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-ink">Your room</h1>
        <div className="flex items-center gap-4 rounded-2xl border border-success-500/30 bg-success-soft p-6">
          <span className="flex size-12 items-center justify-center rounded-xl bg-success-600 text-white">
            <BedDouble className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-ink">
              Room {student.bed.room.roomNumber}, Bed {student.bed.bedNumber}
            </p>
            <p className="text-sm text-ink-muted">
              Floor {student.bed.room.floor} · {student.hostel?.name}
            </p>
          </div>
          <CheckCircle2 className="ml-auto size-5 shrink-0 text-success-fg" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (student.admissionStatus !== "APPROVED") {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-ink">Your room</h1>
        <EmptyState
          icon={BedDouble}
          title="Room booking opens once you're approved"
          description="Your hostel warden needs to approve your admission before you can pick a bed. Check back soon."
        />
      </div>
    );
  }

  const rooms = await db.room.findMany({
    where: { hostelId: student.hostelId! },
    include: { beds: true },
    orderBy: [{ floor: "asc" }, { roomNumber: "asc" }],
  });

  const roomOptions: RoomOption[] = rooms
    .map((room) => ({
      roomId: room.id,
      roomNumber: room.roomNumber,
      floor: room.floor,
      capacity: room.capacity,
      beds: room.beds
        .sort((a, b) => a.bedNumber - b.bedNumber)
        .map((b) => ({ id: b.id, bedNumber: b.bedNumber, taken: b.studentId !== null })),
    }))
    .filter((room) => room.beds.some((b) => !b.taken));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Book a bed</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Available beds in {student.hostel?.name}. Pick one and confirm.
        </p>
      </div>

      {roomOptions.length === 0 ? (
        <EmptyState icon={BedDouble} title="No beds available right now" description="Every bed in your hostel is currently occupied. Contact your warden for the waitlist." />
      ) : (
        <RoomPicker rooms={roomOptions} />
      )}
    </div>
  );
}
