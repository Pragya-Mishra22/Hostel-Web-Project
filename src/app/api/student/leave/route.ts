import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-data";
import { leaveSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!student.hostelId) {
    return NextResponse.json({ error: "You need a hostel assigned before applying for leave." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = leaveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const openLeave = await db.leaveApplication.findFirst({
    where: { studentId: student.id, status: "PENDING" },
  });
  if (openLeave) {
    return NextResponse.json({ error: "You already have a leave application awaiting a decision." }, { status: 409 });
  }

  const leave = await db.leaveApplication.create({
    data: {
      studentId: student.id,
      hostelId: student.hostelId,
      fromDate: new Date(parsed.data.fromDate),
      toDate: new Date(parsed.data.toDate),
      reason: parsed.data.reason,
      destination: parsed.data.destination,
    },
  });

  return NextResponse.json({ ok: true, leave });
}
