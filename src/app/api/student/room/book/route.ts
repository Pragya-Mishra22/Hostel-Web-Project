import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-data";
import { roomBookingSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (student.admissionStatus !== "APPROVED") {
    return NextResponse.json({ error: "Your admission must be approved before you can book a bed." }, { status: 403 });
  }
  if (student.bed) {
    return NextResponse.json({ error: "You already have a bed allocated." }, { status: 409 });
  }

  const body = await request.json().catch(() => null);
  const parsed = roomBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const bed = await db.bed.findUnique({ where: { id: parsed.data.bedId }, include: { room: true } });
  if (!bed || bed.room.hostelId !== student.hostelId) {
    return NextResponse.json({ error: "That bed isn't in your assigned hostel." }, { status: 400 });
  }
  if (bed.studentId) {
    return NextResponse.json({ error: "That bed was just taken. Pick another." }, { status: 409 });
  }

  await db.bed.update({ where: { id: bed.id }, data: { studentId: student.id } });
  return NextResponse.json({ ok: true });
}
