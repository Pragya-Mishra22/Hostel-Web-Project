import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentStaff } from "@/lib/admin-data";

const bodySchema = z.object({
  studentId: z.string().min(1),
  type: z.enum(["MESS", "HOSTEL", "ELECTRICITY"]),
  periodLabel: z.string().min(2),
  amount: z.coerce.number().int().positive(),
});

export async function POST(request: Request) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const student = await db.student.findUnique({ where: { id: parsed.data.studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });
  if (staff.role === "WARDEN" && student.hostelId !== staff.hostelId) {
    return NextResponse.json({ error: "That student isn't in your hostel." }, { status: 403 });
  }

  const existing = await db.feeRecord.findUnique({
    where: { studentId_type_periodLabel: { studentId: student.id, type: parsed.data.type, periodLabel: parsed.data.periodLabel } },
  });
  if (existing) {
    return NextResponse.json({ error: "A record for that student, type and period already exists." }, { status: 409 });
  }

  const fee = await db.feeRecord.create({
    data: {
      studentId: student.id,
      type: parsed.data.type,
      periodLabel: parsed.data.periodLabel,
      amount: parsed.data.amount,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, fee });
}
