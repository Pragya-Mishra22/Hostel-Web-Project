import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStaff } from "@/lib/admin-data";

export async function POST(_request: Request, { params }: { params: Promise<{ bedId: string }> }) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { bedId } = await params;
  const bed = await db.bed.findUnique({ where: { id: bedId }, include: { room: true } });
  if (!bed) return NextResponse.json({ error: "Bed not found." }, { status: 404 });
  if (staff.role === "WARDEN" && bed.room.hostelId !== staff.hostelId) {
    return NextResponse.json({ error: "That bed isn't in your hostel." }, { status: 403 });
  }

  await db.bed.update({ where: { id: bedId }, data: { studentId: null } });
  return NextResponse.json({ ok: true });
}
