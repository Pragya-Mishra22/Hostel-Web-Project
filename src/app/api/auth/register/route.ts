import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existingEmail = await db.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }
  const existingRoll = await db.student.findUnique({ where: { rollNumber: data.rollNumber } });
  if (existingRoll) {
    return NextResponse.json({ error: "That roll number is already registered." }, { status: 409 });
  }
  const hostel = await db.hostel.findUnique({ where: { id: data.preferredHostelId } });
  if (!hostel) {
    return NextResponse.json({ error: "Choose a valid hostel." }, { status: 400 });
  }

  const passwordHash = await hashPassword(data.password);

  await db.user.create({
    data: {
      name: data.name,
      email,
      passwordHash,
      phone: data.phone,
      role: "STUDENT",
      student: {
        create: {
          rollNumber: data.rollNumber,
          course: data.course,
          year: data.year,
          phone: data.phone,
          guardianName: data.guardianName,
          guardianPhone: data.guardianPhone,
          address: data.address,
          admissionStatus: "PENDING",
          hostelId: hostel.id,
        },
      },
    },
  });

  return NextResponse.json({
    ok: true,
    message:
      "Your registration has been submitted. The warden of your chosen hostel will review it, and you'll be able to log in once it's approved.",
  });
}
