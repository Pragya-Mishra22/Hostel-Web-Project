import "server-only";
import { db } from "@/lib/db";

export async function getHostelsWithOccupancy() {
  const hostels = await db.hostel.findMany({
    include: {
      rooms: { include: { beds: true } },
    },
    orderBy: { name: "asc" },
  });

  return hostels.map((hostel) => {
    const beds = hostel.rooms.flatMap((r) => r.beds);
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter((b) => b.studentId !== null).length;
    return {
      id: hostel.id,
      name: hostel.name,
      code: hostel.code,
      address: hostel.address,
      description: hostel.description,
      imageUrl: hostel.imageUrl,
      wardenName: hostel.wardenName,
      wardenPhone: hostel.wardenPhone,
      totalBeds,
      occupiedBeds,
      totalRooms: hostel.rooms.length,
    };
  });
}

export type HostelWithOccupancy = Awaited<ReturnType<typeof getHostelsWithOccupancy>>[number];
