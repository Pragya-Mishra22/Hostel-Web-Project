import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStaff } from "@/lib/admin-data";
import { z } from "zod";

const bodySchema = z.object({ decision: z.enum(["APPROVE", "REJECT"]) });

export async function POST(request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { studentId } = await params;
  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });
  if (staff.role === "WARDEN" && student.hostelId !== staff.hostelId) {
    return NextResponse.json({ error: "That student applied to a different hostel." }, { status: 403 });
  }
  if (student.admissionStatus !== "PENDING") {
    return NextResponse.json({ error: "This admission has already been decided." }, { status: 409 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  await db.student.update({
    where: { id: studentId },
    data: { admissionStatus: parsed.data.decision === "APPROVE" ? "APPROVED" : "REJECTED" },
  });

  return NextResponse.json({ ok: true });
}
