import Link from "next/link";
import { Building2, MapPin, Phone, Mail, ShieldAlert } from "lucide-react";
import { LineHoverAnchor, LineHoverLink } from "@/components/ui/line-hover-link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-line)] bg-surface-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            YMCA Hostels
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            The resident portal for the girls&apos; hostels of J C Bose University of Science &amp;
            Technology, YMCA, Faridabad.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Visit us</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li className="flex gap-2.5">
              <MapPin className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>Sector 6, Mathura Road, Faridabad, Haryana 121006</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>+91 129 227 2222 (University reception)</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>hostels@jcboseust.ac.in</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Quick links</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li>
              <LineHoverLink href="/#hostels">Our four hostels</LineHoverLink>
            </li>
            <li>
              <LineHoverLink href="/login">Student / warden login</LineHoverLink>
            </li>
            <li>
              <LineHoverLink href="/register">New student registration</LineHoverLink>
            </li>
            <li>
              <LineHoverAnchor href="https://www.jcboseust.ac.in" target="_blank" rel="noopener noreferrer">
                University website
              </LineHoverAnchor>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">In an emergency</h3>
          <Link
            href="/safety"
            className="mt-4 flex items-center gap-3 rounded-xl border border-danger-500/30 bg-red-50 px-4 py-3 text-sm font-semibold text-danger-600 transition-colors hover:bg-red-100 dark:bg-red-950/20"
          >
            <ShieldAlert className="size-5 shrink-0" aria-hidden="true" />
            Safety &amp; Contacts: anti-ragging, harassment and emergency numbers
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)] py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-ink-muted md:px-6">
          &copy; {year} J C Bose University of Science &amp; Technology, YMCA, Faridabad. Hostel portal
          built for demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
