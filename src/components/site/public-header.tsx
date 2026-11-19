import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NotchNav } from "@/components/site/notch-nav";

/** Server wrapper: loads the hostels for the mega menu and checks who (if anyone) is signed in. */
export async function PublicHeader() {
  const [hostels, session] = await Promise.all([
    db.hostel.findMany({
      select: { id: true, name: true, code: true, description: true, imageUrl: true },
      orderBy: { name: "asc" },
    }),
    getSession(),
  ]);

  const dashboard = session
    ? session.role === "STUDENT"
      ? { href: "/student", label: "My dashboard" }
      : { href: "/admin", label: "Admin dashboard" }
    : undefined;

  return <NotchNav hostels={hostels} dashboard={dashboard} />;
}
