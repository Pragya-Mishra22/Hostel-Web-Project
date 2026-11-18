import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentStaff } from "@/lib/admin-data";

const bodySchema = z.object({
  decision: z.enum(["APPROVE", "REJECT"]),
  remarks: z.string().max(500).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ leaveId: string }> }) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { leaveId } = await params;
  const leave = await db.leaveApplication.findUnique({ where: { id: leaveId } });
  if (!leave) return NextResponse.json({ error: "Leave application not found." }, { status: 404 });
  if (staff.role === "WARDEN" && leave.hostelId !== staff.hostelId) {
    return NextResponse.json({ error: "That application isn't in your hostel." }, { status: 403 });
  }
  if (leave.status !== "PENDING") {
    return NextResponse.json({ error: "This application has already been decided." }, { status: 409 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  await db.leaveApplication.update({
    where: { id: leaveId },
    data: {
      status: parsed.data.decision === "APPROVE" ? "APPROVED" : "REJECTED",
      decidedAt: new Date(),
      decidedByUserId: staff.userId,
      wardenRemarks: parsed.data.remarks,
    },
  });

  return NextResponse.json({ ok: true });
}
