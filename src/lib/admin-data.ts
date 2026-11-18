import "server-only";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getCurrentStaff() {
  const session = await getSession();
  if (!session || (session.role !== "CHIEF_WARDEN" && session.role !== "WARDEN")) return null;
  return {
    userId: session.userId,
    name: session.name,
    role: session.role as "CHIEF_WARDEN" | "WARDEN",
    hostelId: session.hostelId ?? null,
  };
}

export async function requireCurrentStaff() {
  const staff = await getCurrentStaff();
  if (!staff) throw new Error("Not authenticated as staff.");
  return staff;
}

/** A warden only ever sees their own hostel; the chief warden sees every hostel (optionally filtered). */
export function hostelScope(staff: { role: "CHIEF_WARDEN" | "WARDEN"; hostelId: string | null }, filterHostelId?: string | null) {
  if (staff.role === "WARDEN") return staff.hostelId ?? "__none__";
  return filterHostelId ?? undefined;
}

export async function getManagedHostels(staff: { role: "CHIEF_WARDEN" | "WARDEN"; hostelId: string | null }) {
  if (staff.role === "WARDEN") {
    if (!staff.hostelId) return [];
    const hostel = await db.hostel.findUnique({ where: { id: staff.hostelId } });
    return hostel ? [hostel] : [];
  }
  return db.hostel.findMany({ orderBy: { name: "asc" } });
}
