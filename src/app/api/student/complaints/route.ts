import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-data";
import { complaintSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!student.hostelId) {
    return NextResponse.json({ error: "You need a hostel assigned before raising a complaint." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = complaintSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const complaint = await db.complaint.create({
    data: {
      studentId: student.id,
      hostelId: student.hostelId,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description,
    },
  });

  return NextResponse.json({ ok: true, complaint });
}
