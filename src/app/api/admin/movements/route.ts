import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentStaff } from "@/lib/admin-data";

const bodySchema = z.object({
  leaveId: z.string().min(1),
  type: z.enum(["DEPARTURE", "RETURN"]),
});

export async function POST(request: Request) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  const leave = await db.leaveApplication.findUnique({ where: { id: parsed.data.leaveId } });
  if (!leave) return NextResponse.json({ error: "Leave application not found." }, { status: 404 });
  if (leave.status !== "APPROVED") {
    return NextResponse.json({ error: "Only approved leaves can be logged at the gate." }, { status: 400 });
  }
  if (staff.role === "WARDEN" && leave.hostelId !== staff.hostelId) {
    return NextResponse.json({ error: "That student isn't in your hostel." }, { status: 403 });
  }

  const existing = await db.movementLog.findFirst({ where: { leaveId: leave.id, type: parsed.data.type } });
  if (existing) {
    return NextResponse.json({ error: `A ${parsed.data.type.toLowerCase()} has already been logged for this leave.` }, { status: 409 });
  }
  if (parsed.data.type === "RETURN") {
    const departed = await db.movementLog.findFirst({ where: { leaveId: leave.id, type: "DEPARTURE" } });
    if (!departed) {
      return NextResponse.json({ error: "Log the departure before the return." }, { status: 400 });
    }
  }

  await db.movementLog.create({
    data: {
      studentId: leave.studentId,
      leaveId: leave.id,
      type: parsed.data.type,
      recordedByUserId: staff.userId,
    },
  });

  return NextResponse.json({ ok: true });
}
