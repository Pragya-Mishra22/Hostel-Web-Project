import type { Metadata } from "next";
import { Phone, ShieldAlert, HeartPulse, Scale, Flame, Siren, Users } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/site/footer";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Safety & Contacts",
  description: "Who to call for ragging, harassment, medical, security or fire emergencies at JC Bose YMCA hostels.",
};

/**
 * Placeholder numbers: wired so the real university, anti-ragging cell and
 * ICC numbers can replace these directly (see DESIGN.md §12). All open as
 * tel: links so a tap/click dials straight away on a phone.
 */
const CONTACT_GROUPS: {
  title: string;
  icon: typeof ShieldAlert;
  tone: "danger" | "warning" | "brand";
  contacts: { label: string; phone: string; note?: string }[];
}[] = [
  {
    title: "Ragging & harassment",
    icon: ShieldAlert,
    tone: "danger",
    contacts: [
      { label: "University Anti-Ragging Committee", phone: "1800000101", note: "24x7, confidential" },
      { label: "Internal Complaints Committee (ICC) for harassment", phone: "1800000102" },
      { label: "UGC National Anti-Ragging Helpline", phone: "18001805522", note: "Toll-free, nationwide" },
      { label: "Chief Warden, Women's Hostels", phone: "9810000100" },
    ],
  },
  {
    title: "Medical emergency",
    icon: HeartPulse,
    tone: "danger",
    contacts: [
      { label: "Campus Health Centre", phone: "9810000201", note: "On-campus clinic" },
      { label: "National Ambulance Service", phone: "108" },
    ],
  },
  {
    title: "Fire & security",
    icon: Flame,
    tone: "warning",
    contacts: [
      { label: "Campus Security Control Room", phone: "9810000202", note: "24x7" },
      { label: "Fire Service (National)", phone: "101" },
      { label: "Police Control Room (National)", phone: "100" },
    ],
  },
  {
    title: "Legal & counselling support",
    icon: Scale,
    tone: "brand",
    contacts: [
      { label: "Women's Helpline (National)", phone: "1091" },
      { label: "Campus Counselling Cell", phone: "9810000203", note: "By appointment, confidential" },
    ],
  },
];

const toneClasses: Record<string, string> = {
  danger: "bg-red-50 text-danger-600 dark:bg-red-950/20",
  warning: "bg-amber-50 text-warning-600 dark:bg-amber-950/20",
  brand: "bg-brand-50 text-brand-700",
};

export default async function SafetyPage() {
  const hostels = await db.hostel.findMany({
    select: { name: true, code: true, wardenName: true, wardenPhone: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <div className="flex items-center gap-3 rounded-2xl border border-danger-500/30 bg-red-50 px-5 py-4 dark:bg-red-950/20">
          <Siren className="size-6 shrink-0 text-danger-600" aria-hidden="true" />
          <p className="text-sm font-medium text-danger-600">
            If you are in immediate danger, call 100 (Police) or 108 (Ambulance) first, then inform your
            warden.
          </p>
        </div>

        <h1 className="mt-10 font-display text-3xl font-bold text-ink md:text-4xl">Safety &amp; Contacts</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Every number below is organized by the kind of help you need, so you can call the right
          person without delay. These are placeholder contact numbers for this demo build and should
          be replaced with the university's current, verified numbers before real use.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {CONTACT_GROUPS.map((group) => (
            <div key={group.title} className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
              <div className="flex items-center gap-3">
                <span className={`flex size-10 items-center justify-center rounded-xl ${toneClasses[group.tone]}`}>
                  <group.icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="font-display text-lg font-bold text-ink">{group.title}</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {group.contacts.map((c) => (
                  <li key={c.label} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{c.label}</p>
                      {c.note ? <p className="text-xs text-ink-muted">{c.note}</p> : null}
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                    >
                      <Phone className="size-3.5" aria-hidden="true" />
                      {c.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-14 flex items-center gap-2 font-display text-2xl font-bold text-ink">
          <Users className="size-5 text-brand-600" aria-hidden="true" />
          Your hostel warden
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          For day-to-day issues, your own hostel&apos;s warden is usually the fastest person to reach.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hostels.map((h) => (
            <div key={h.code} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{h.code}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{h.name}</p>
              <p className="mt-1 text-sm text-ink-muted">{h.wardenName}</p>
              {h.wardenPhone ? (
                <a
                  href={`tel:${h.wardenPhone}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
                >
                  <Phone className="size-3.5" aria-hidden="true" /> {h.wardenPhone}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
