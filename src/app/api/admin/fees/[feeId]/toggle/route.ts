import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStaff } from "@/lib/admin-data";
import { shortCode } from "@/lib/utils";

export async function POST(_request: Request, { params }: { params: Promise<{ feeId: string }> }) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { feeId } = await params;
  const fee = await db.feeRecord.findUnique({ where: { id: feeId }, include: { student: true } });
  if (!fee) return NextResponse.json({ error: "Fee record not found." }, { status: 404 });
  if (staff.role === "WARDEN" && fee.student.hostelId !== staff.hostelId) {
    return NextResponse.json({ error: "That record isn't in your hostel." }, { status: 403 });
  }

  const nowPaid = fee.status !== "PAID";
  await db.feeRecord.update({
    where: { id: feeId },
    data: {
      status: nowPaid ? "PAID" : "PENDING",
      paidAt: nowPaid ? new Date() : null,
      receiptNo: nowPaid ? fee.receiptNo ?? `RC-${shortCode(fee.id)}` : fee.receiptNo,
      recordedByUserId: staff.userId,
    },
  });

  return NextResponse.json({ ok: true, status: nowPaid ? "PAID" : "PENDING" });
}
