import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStaff, getManagedHostels } from "@/lib/admin-data";

/** Staff-only student search for the admin command palette (scoped to the staff member's hostels). */
export async function GET(request: Request) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ students: [] });

  const hostels = await getManagedHostels(staff);
  const students = await db.student.findMany({
    where: {
      hostelId: { in: hostels.map((h) => h.id) },
      OR: [{ rollNumber: { contains: q } }, { user: { name: { contains: q } } }],
    },
    include: { user: true, hostel: true },
    orderBy: { rollNumber: "asc" },
    take: 8,
  });

  return NextResponse.json({
    students: students.map((s) => ({
      id: s.id,
      name: s.user.name,
      rollNumber: s.rollNumber,
      hostel: s.hostel?.code ?? "",
      status: s.admissionStatus,
    })),
  });
}
