import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { student: true },
  });

  if (!user) {
    return NextResponse.json({ error: "No account found with that email." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  if (user.role === "STUDENT" && user.student?.admissionStatus === "PENDING") {
    return NextResponse.json(
      { error: "Your admission is still pending warden approval. You'll be able to log in once it's approved." },
      { status: 403 },
    );
  }
  if (user.role === "STUDENT" && user.student?.admissionStatus === "REJECTED") {
    return NextResponse.json(
      { error: "Your admission request was not approved. Contact your hostel warden for details." },
      { status: 403 },
    );
  }

  await setSessionCookie({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    hostelId: user.hostelId,
    studentId: user.student?.id ?? null,
  });

  const redirectTo = user.role === "STUDENT" ? "/student" : "/admin";
  return NextResponse.json({ ok: true, redirectTo });
}
