import "server-only";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

/** Loads the signed-in student's full profile, or null if not a student / not found. */
export async function getCurrentStudent() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT" || !session.studentId) return null;

  const student = await db.student.findUnique({
    where: { id: session.studentId },
    include: {
      hostel: true,
      bed: { include: { room: true } },
      user: true,
    },
  });
  return student;
}

export async function requireCurrentStudent() {
  const student = await getCurrentStudent();
  if (!student) throw new Error("Not authenticated as a student.");
  return student;
}
