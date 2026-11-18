import { PrismaClient, Role, AdmissionStatus, FeeType, FeeStatus, ComplaintCategory, ComplaintStatus, LeaveStatus, MovementType } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const DEMO_PASSWORD = "Hostel@123";

function hash(password: string) {
  return bcrypt.hashSync(password, 10);
}

// ---- Static reference data --------------------------------------------

const HOSTELS = [
  {
    code: "KAST",
    name: "Kasturba Hall",
    address: "Kasturba Hall, JC Bose University of Science & Technology, Sector 6, Faridabad",
    description:
      "One of the university's oldest girls' hostels, known for its courtyard morning yoga sessions and its central location near the main academic block.",
    imageUrl: "/images/hostels/kasturba.jpg",
    wardenName: "Dr. Sunita Rawat",
    wardenPhone: "9810000101",
  },
  {
    code: "MTH",
    name: "Mother Teresa Hostel",
    address: "Mother Teresa Hostel, JC Bose University of Science & Technology, Sector 6, Faridabad",
    description:
      "A quieter hostel popular with senior students, with a reading room that stays open late during exam season.",
    imageUrl: null,
    wardenName: "Prof. Kavita Yadav",
    wardenPhone: "9810000102",
  },
  {
    code: "KC",
    name: "Kalpana Chawla Hostel",
    address: "Kalpana Chawla Hostel, JC Bose University of Science & Technology, Sector 6, Faridabad",
    description:
      "Named after the astronaut and alumna icon, this hostel houses many first-year engineering students and sits closest to the sports ground.",
    imageUrl: null,
    wardenName: "Dr. Meenakshi Sharma",
    wardenPhone: "9810000103",
  },
  {
    code: "ALAL",
    name: "A. Lalita Hostel",
    address: "A. Lalita Hostel, JC Bose University of Science & Technology, Sector 6, Faridabad",
    description:
      "The newest hostel block on campus, with a dedicated gym and a health centre that runs regular wellness camps for residents.",
    imageUrl: "/images/hostels/a-lalita.webp",
    wardenName: "Dr. Priya Malhotra",
    wardenPhone: "9810000104",
  },
] as const;

const FIRST_NAMES = [
  "Anjali", "Priya", "Neha", "Kavya", "Riya", "Sneha", "Pooja", "Ishita", "Simran", "Tanya",
  "Divya", "Aarushi", "Nikita", "Shreya", "Komal", "Ritika", "Vanshika", "Aditi", "Manya", "Palak",
  "Gauri", "Khushi", "Sakshi", "Mahi", "Anushka", "Bhavya", "Charu", "Diya",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Singh", "Yadav", "Chauhan", "Kaur", "Mishra", "Tyagi", "Rawat",
  "Malhotra", "Chaudhary", "Bansal", "Agarwal", "Rathi", "Jain",
];
const COURSES = ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "B.Tech Mechanical", "BBA", "B.Com (Hons)"];
const CITIES = ["Faridabad", "Gurugram", "Palwal", "Rohtak", "Panipat", "Rewari", "Hisar", "Sonipat"];

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

function monthsBack(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toLocaleString("en-IN", { month: "short", year: "numeric" });
}

async function main() {
  console.log("Clearing existing data...");
  await db.movementLog.deleteMany();
  await db.leaveApplication.deleteMany();
  await db.complaint.deleteMany();
  await db.feeRecord.deleteMany();
  await db.bed.deleteMany();
  await db.room.deleteMany();
  await db.student.deleteMany();
  await db.user.deleteMany();
  await db.hostel.deleteMany();

  console.log("Creating hostels, rooms and beds...");
  const hostelRecords = [];
  for (const h of HOSTELS) {
    const hostel = await db.hostel.create({
      data: {
        name: h.name,
        code: h.code,
        address: h.address,
        description: h.description,
        imageUrl: h.imageUrl,
        wardenName: h.wardenName,
        wardenPhone: h.wardenPhone,
      },
    });

    // 3 floors x 5 rooms, capacity cycling 2/3/4 beds.
    for (let floor = 1; floor <= 3; floor++) {
      for (let r = 1; r <= 5; r++) {
        const roomNumber = `${floor}0${r}`;
        const capacity = [2, 3, 4, 2, 3][r - 1];
        const room = await db.room.create({
          data: { hostelId: hostel.id, roomNumber, floor, capacity },
        });
        for (let b = 1; b <= capacity; b++) {
          await db.bed.create({ data: { roomId: room.id, bedNumber: b } });
        }
      }
    }
    hostelRecords.push(hostel);
  }

  console.log("Creating chief warden and wardens...");
  const chiefWarden = await db.user.create({
    data: {
      name: "Dr. Alka Singh",
      email: "chiefwarden@ymcahostels.demo",
      passwordHash: hash(DEMO_PASSWORD),
      phone: "9810000100",
      role: Role.CHIEF_WARDEN,
    },
  });

  const wardenUsers = [];
  for (const hostel of hostelRecords) {
    const hData = HOSTELS.find((h) => h.code === hostel.code)!;
    const emailLocal = hData.code.toLowerCase();
    const warden = await db.user.create({
      data: {
        name: hData.wardenName,
        email: `warden.${emailLocal}@ymcahostels.demo`,
        passwordHash: hash(DEMO_PASSWORD),
        phone: hData.wardenPhone,
        role: Role.WARDEN,
        hostelId: hostel.id,
      },
    });
    wardenUsers.push(warden);
  }

  console.log("Creating students...");
  const allBeds = await db.bed.findMany({ include: { room: true } });
  const bedsByHostel = new Map<string, typeof allBeds>();
  for (const bed of allBeds) {
    const list = bedsByHostel.get(bed.room.hostelId) ?? [];
    list.push(bed);
    bedsByHostel.set(bed.room.hostelId, list);
  }

  const totalStudents = 28;
  const students: { id: string; hostelId: string | null }[] = [];

  for (let i = 0; i < totalStudents; i++) {
    const hostel = hostelRecords[i % hostelRecords.length];
    const firstName = pick(FIRST_NAMES, i);
    const lastName = pick(LAST_NAMES, i + 3);
    const name = `${firstName} ${lastName}`;
    const rollNumber = `JCB${2023 + (i % 3)}${String(1000 + i).slice(-4)}`;
    const emailLocal = `${firstName}.${lastName}${i}`.toLowerCase();

    // Most admissions are approved; a few stay pending so the admin queue has real work.
    const admissionStatus: AdmissionStatus =
      i % 9 === 0 ? AdmissionStatus.PENDING : i % 13 === 0 ? AdmissionStatus.REJECTED : AdmissionStatus.APPROVED;

    const user = await db.user.create({
      data: {
        name,
        email: `${emailLocal}@ymcahostels.demo`,
        passwordHash: hash(DEMO_PASSWORD),
        phone: `9${String(800000000 + i * 37).slice(0, 9)}`,
        role: Role.STUDENT,
      },
    });

    const student = await db.student.create({
      data: {
        userId: user.id,
        rollNumber,
        course: pick(COURSES, i),
        year: (i % 4) + 1,
        phone: user.phone!,
        guardianName: `${pick(LAST_NAMES, i + 7)} ${pick(["Kumar", "Prakash", "Lal", "Devi"], i)}`,
        guardianPhone: `9${String(700000000 + i * 53).slice(0, 9)}`,
        address: `House No. ${100 + i}, ${pick(CITIES, i)}, Haryana`,
        admissionStatus,
        // The hostel a student applied to, same as a real admission form.
        // Bed allocation (below) is the separate step gated on approval.
        hostelId: hostel.id,
      },
    });

    students.push({ id: student.id, hostelId: student.hostelId });

    // Allocate a bed to roughly 70% of approved students, leaving real vacancy.
    if (admissionStatus === AdmissionStatus.APPROVED && i % 10 < 7) {
      const available = (bedsByHostel.get(hostel.id) ?? []).filter((b) => true);
      const bed = available.find((b) => true);
      // Find a still-unassigned bed for this hostel.
      const freeBed = await db.bed.findFirst({
        where: { room: { hostelId: hostel.id }, studentId: null },
      });
      if (freeBed) {
        await db.bed.update({ where: { id: freeBed.id }, data: { studentId: student.id } });
      }
      void bed;
    }

    if (admissionStatus !== AdmissionStatus.APPROVED) continue;

    // Fee records: mess + electricity for the last 4 months, hostel fee for the year.
    for (let m = 3; m >= 0; m--) {
      const periodLabel = monthsBack(m);
      const messPaid = (i + m) % 4 !== 0; // most months paid, some pending
      await db.feeRecord.create({
        data: {
          studentId: student.id,
          type: FeeType.MESS,
          periodLabel,
          amount: 3200,
          status: messPaid ? FeeStatus.PAID : FeeStatus.PENDING,
          paidAt: messPaid ? new Date() : null,
          receiptNo: messPaid ? `MS-${rollNumber}-${periodLabel.replace(" ", "")}` : null,
        },
      });

      const elecPaid = (i + m) % 5 !== 0;
      await db.feeRecord.create({
        data: {
          studentId: student.id,
          type: FeeType.ELECTRICITY,
          periodLabel,
          amount: 450 + (i % 3) * 50,
          status: elecPaid ? FeeStatus.PAID : FeeStatus.PENDING,
          paidAt: elecPaid ? new Date() : null,
          receiptNo: elecPaid ? `EL-${rollNumber}-${periodLabel.replace(" ", "")}` : null,
        },
      });
    }

    const hostelFeePaid = i % 6 !== 0;
    await db.feeRecord.create({
      data: {
        studentId: student.id,
        type: FeeType.HOSTEL,
        periodLabel: "2026-27",
        amount: 48000,
        status: hostelFeePaid ? FeeStatus.PAID : FeeStatus.PENDING,
        paidAt: hostelFeePaid ? new Date() : null,
        receiptNo: hostelFeePaid ? `HF-${rollNumber}-2026-27` : null,
      },
    });

    // Complaints: about a third of students have raised one.
    if (i % 3 === 0) {
      const categories = Object.values(ComplaintCategory);
      const category = categories[i % categories.length];
      const status = i % 3 === 0 ? ComplaintStatus.RESOLVED : i % 3 === 1 ? ComplaintStatus.OPEN : ComplaintStatus.IN_PROGRESS;
      await db.complaint.create({
        data: {
          studentId: student.id,
          hostelId: hostel.id,
          category,
          title: complaintTitleFor(category),
          description: complaintDescriptionFor(category),
          status,
          remarks: status === ComplaintStatus.RESOLVED ? "Fixed by the maintenance staff." : null,
          resolvedAt: status === ComplaintStatus.RESOLVED ? new Date() : null,
        },
      });
    }

    // Leave applications: a mix of pending, approved (with movement logs) and rejected.
    if (i % 4 !== 3) {
      const today = new Date();
      const from = new Date(today);
      from.setDate(from.getDate() + (i % 4 === 0 ? -2 : 3));
      const to = new Date(from);
      to.setDate(to.getDate() + 2 + (i % 3));

      const status: LeaveStatus = i % 4 === 0 ? LeaveStatus.APPROVED : i % 4 === 1 ? LeaveStatus.PENDING : LeaveStatus.REJECTED;
      const warden = wardenUsers[hostelRecords.indexOf(hostel)];

      const leave = await db.leaveApplication.create({
        data: {
          studentId: student.id,
          hostelId: hostel.id,
          fromDate: from,
          toDate: to,
          reason: i % 2 === 0 ? "Going home for a family function." : "Festival break with family.",
          destination: pick(CITIES, i + 2),
          status,
          decidedAt: status !== LeaveStatus.PENDING ? new Date() : null,
          decidedByUserId: status !== LeaveStatus.PENDING ? warden.id : null,
          wardenRemarks: status === LeaveStatus.REJECTED ? "Please reapply with your guardian's confirmation." : null,
        },
      });

      // For approved leaves starting today or in the past, log a departure (and sometimes a return).
      if (status === LeaveStatus.APPROVED && from <= today) {
        await db.movementLog.create({
          data: { studentId: student.id, leaveId: leave.id, type: MovementType.DEPARTURE, recordedByUserId: warden.id },
        });
        if (i % 8 === 0) {
          await db.movementLog.create({
            data: { studentId: student.id, leaveId: leave.id, type: MovementType.RETURN, recordedByUserId: warden.id },
          });
        }
      }
    }
  }

  console.log(`Seeded ${hostelRecords.length} hostels, ${wardenUsers.length + 1} staff accounts, ${students.length} students.`);
  console.log("\nDemo logins (password for all: Hostel@123):");
  console.log("  Chief warden:  chiefwarden@ymcahostels.demo");
  for (const h of HOSTELS) console.log(`  Warden (${h.code}):  warden.${h.code.toLowerCase()}@ymcahostels.demo`);
  console.log("  Any seeded student email also works, e.g. anjali.sharma0@ymcahostels.demo");
}

function complaintTitleFor(category: ComplaintCategory) {
  switch (category) {
    case ComplaintCategory.ELECTRICAL:
      return "Room light not working";
    case ComplaintCategory.PLUMBING:
      return "Bathroom tap is leaking";
    case ComplaintCategory.WIFI:
      return "Wi-Fi keeps disconnecting";
    case ComplaintCategory.CLEANLINESS:
      return "Corridor needs cleaning";
    case ComplaintCategory.MESS:
      return "Food quality concern";
    default:
      return "General maintenance request";
  }
}

function complaintDescriptionFor(category: ComplaintCategory) {
  switch (category) {
    case ComplaintCategory.ELECTRICAL:
      return "The tube light near the study table has stopped working since yesterday evening.";
    case ComplaintCategory.PLUMBING:
      return "There's a constant drip from the bathroom tap, it's wasting water through the night.";
    case ComplaintCategory.WIFI:
      return "The Wi-Fi drops every evening after 8pm, making it hard to attend online classes.";
    case ComplaintCategory.CLEANLINESS:
      return "The third-floor corridor hasn't been swept in a few days.";
    case ComplaintCategory.MESS:
      return "Dinner has been undercooked twice this week, could the mess committee take a look.";
    default:
      return "Needs attention from the hostel maintenance staff.";
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
