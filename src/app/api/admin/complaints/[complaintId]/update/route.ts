import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentStaff } from "@/lib/admin-data";

const bodySchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
  remarks: z.string().max(500).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ complaintId: string }> }) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { complaintId } = await params;
  const complaint = await db.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
  if (staff.role === "WARDEN" && complaint.hostelId !== staff.hostelId) {
    return NextResponse.json({ error: "That complaint isn't in your hostel." }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  await db.complaint.update({
    where: { id: complaintId },
    data: {
      status: parsed.data.status,
      remarks: parsed.data.remarks ?? complaint.remarks,
      resolvedAt: parsed.data.status === "RESOLVED" ? new Date() : null,
    },
  });

  return NextResponse.json({ ok: true });
}
