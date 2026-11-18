import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentStaff } from "@/lib/admin-data";

const bodySchema = z.object({ studentId: z.string().min(1) });

export async function POST(request: Request, { params }: { params: Promise<{ bedId: string }> }) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { bedId } = await params;
  const bed = await db.bed.findUnique({ where: { id: bedId }, include: { room: true } });
  if (!bed) return NextResponse.json({ error: "Bed not found." }, { status: 404 });
  if (staff.role === "WARDEN" && bed.room.hostelId !== staff.hostelId) {
    return NextResponse.json({ error: "That bed isn't in your hostel." }, { status: 403 });
  }
  if (bed.studentId) return NextResponse.json({ error: "That bed is already occupied." }, { status: 409 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  const student = await db.student.findUnique({ where: { id: parsed.data.studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });
  if (student.hostelId !== bed.room.hostelId) {
    return NextResponse.json({ error: "That student applied to a different hostel." }, { status: 400 });
  }
  if (student.admissionStatus !== "APPROVED") {
    return NextResponse.json({ error: "Approve this student's admission first." }, { status: 400 });
  }

  const existingBed = await db.bed.findUnique({ where: { studentId: student.id } });
  if (existingBed) {
    return NextResponse.json({ error: "This student already has a bed allocated." }, { status: 409 });
  }

  await db.bed.update({ where: { id: bedId }, data: { studentId: student.id } });
  return NextResponse.json({ ok: true });
}
