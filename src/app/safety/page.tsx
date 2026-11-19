import type { Metadata } from "next";
import { Phone, Mail, ExternalLink, ShieldAlert, HeartPulse, Flame, Siren, Landmark } from "lucide-react";
import { PublicHeader } from "@/components/site/public-header";
import { Footer } from "@/components/site/footer";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal";
import { LineHoverAnchor } from "@/components/ui/line-hover-link";

export const metadata: Metadata = {
  title: "Safety & Contacts",
  description: "Who to call for ragging, harassment, medical, security or fire emergencies at JC Bose YMCA hostels.",
};

/**
 * University contacts are taken from the official officers' directory
 * (jcboseust.ac.in/contactofficers); national numbers are the public emergency
 * and helpline numbers. A contact has a phone, an email, or a web page.
 */
interface Contact {
  label: string;
  note?: string;
  phone?: string;
  phoneLabel?: string;
  email?: string;
  href?: string;
}

const CONTACT_GROUPS: {
  title: string;
  icon: typeof ShieldAlert;
  tone: "danger" | "warning" | "brand";
  contacts: Contact[];
}[] = [
  {
    title: "Ragging and harassment",
    icon: ShieldAlert,
    tone: "danger",
    contacts: [
      { label: "UGC National Anti-Ragging Helpline", phone: "18001805522", phoneLabel: "1800 180 5522", note: "Toll-free, nationwide" },
      { label: "University Proctor (Prof. Manjeet Singh)", phone: "01292310190", phoneLabel: "0129-2310190", email: "proctor@jcboseust.ac.in" },
      { label: "Chief Warden, Girls' Hostels (Prof. Neelam Turk)", email: "girlshostel@jcboseust.ac.in", note: "Email, as listed in the officers' directory" },
      { label: "University student grievance page", href: "https://jcboseust.ac.in/student-grievance", note: "File a grievance online" },
    ],
  },
  {
    title: "Medical emergency",
    icon: HeartPulse,
    tone: "danger",
    contacts: [
      { label: "National Ambulance Service", phone: "108" },
      { label: "University Medical Officer (Dr. Ankur Sharma)", email: "dispensary@jcboseust.ac.in", note: "The girls' hostels also offer first aid and a 24x7 ambulance" },
    ],
  },
  {
    title: "Fire, police and any emergency",
    icon: Flame,
    tone: "warning",
    contacts: [
      { label: "National Emergency Number", phone: "112" },
      { label: "Police", phone: "100" },
      { label: "Fire Service", phone: "101" },
      { label: "Women Helpline", phone: "1091", note: "Also 181" },
    ],
  },
  {
    title: "University offices",
    icon: Landmark,
    tone: "brand",
    contacts: [
      { label: "Registrar (Prof. Ajay Ranga)", phone: "01292310104", phoneLabel: "0129-2310104", email: "registrar@jcboseust.ac.in" },
      { label: "Dean, Student Welfare (Dr. Pradeep Kumar)", email: "chw@jcboseust.ac.in" },
      { label: "Full officers' directory", href: "https://jcboseust.ac.in/contactofficers", note: "Every university office and email" },
    ],
  },
];

const toneClasses: Record<string, string> = {
  danger: "bg-danger-soft text-danger-fg",
  warning: "bg-warning-soft text-warning-fg",
  brand: "bg-brand-soft text-accent-fg",
};

const pill =
  "inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-semibold text-accent-fg transition-transform hover:-translate-y-0.5";

export default function SafetyPage() {
  return (
    <>
      <PublicHeader />
      <main className="w-full bg-page">
        <section id="emergency" className="gutter bg-gradient-to-br from-brand-900 to-brand-950 pb-14 pt-32 text-white md:pb-20">
          <div className="flex items-center gap-3 rounded-2xl border border-danger-500/40 bg-danger-500/15 px-5 py-4">
            <Siren className="size-6 shrink-0 text-red-300" aria-hidden="true" />
            <p className="text-sm font-medium text-red-100">
              If you are in immediate danger, call 112 (any emergency), 100 (Police) or 108 (Ambulance) first, then inform your warden.
            </p>
          </div>

          <GooeyTextReveal className="mt-10 max-w-3xl">
            <h1 className="font-display text-4xl font-extrabold md:text-6xl">Safety &amp; Contacts</h1>
            <p className="mt-4 text-base text-white/75 md:text-lg">
              Every contact below is grouped by the kind of help you need, so you can reach the right person without delay.
              University details come from the official officers&apos; directory.
            </p>
          </GooeyTextReveal>
        </section>

        <section id="contacts" className="gutter py-14 md:py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
            {CONTACT_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col rounded-3xl border border-line bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className={`flex size-11 items-center justify-center rounded-2xl ${toneClasses[group.tone]}`}>
                    <group.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-lg font-bold text-ink">{group.title}</h2>
                </div>
                <ul className="mt-5 space-y-5">
                  {group.contacts.map((c) => (
                    <li key={c.label}>
                      <p className="text-sm font-medium leading-snug text-ink">{c.label}</p>
                      {c.note ? <p className="mt-0.5 text-xs text-ink-muted">{c.note}</p> : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.phone ? (
                          <a href={`tel:${c.phone}`} className={pill}>
                            <Phone className="size-3.5" aria-hidden="true" />
                            {c.phoneLabel ?? c.phone}
                          </a>
                        ) : null}
                        {c.email ? (
                          <a href={`mailto:${c.email}`} className={pill}>
                            <Mail className="size-3.5" aria-hidden="true" />
                            {c.email}
                          </a>
                        ) : null}
                        {c.href ? (
                          <a href={c.href} target="_blank" rel="noopener noreferrer" className={pill}>
                            <ExternalLink className="size-3.5" aria-hidden="true" />
                            Open page
                          </a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-3xl text-sm text-ink-muted">
            Your own hostel warden is usually the fastest person to reach for day-to-day matters; their details are on your
            hostel notice board. Directory details can change, so check the{" "}
            <LineHoverAnchor href="https://jcboseust.ac.in/contactofficers" target="_blank" rel="noopener noreferrer" variant="double" className="font-semibold text-accent-fg">
              official directory
            </LineHoverAnchor>{" "}
            if a number does not connect.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
