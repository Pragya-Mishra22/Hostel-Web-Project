import Link from "next/link";
import { Building2, MapPin, Phone, Mail, ShieldAlert } from "lucide-react";
import { LineHoverAnchor, LineHoverLink } from "@/components/ui/line-hover-link";

/** Full-width footer: address, quick links and the safety shortcut. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-line bg-surface-muted">
      <div className="gutter grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            YMCA Hostels
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            The resident portal for the girls&apos; hostels of J C Bose University of Science &amp; Technology, YMCA,
            Faridabad: Kasturba, Mother Teresa, Kalpana Chawla and A. Lalita.
          </p>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-ink">Visit us</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent-fg" aria-hidden="true" />
              <span>Sector 6, Mathura Road, Faridabad, Haryana 121006</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent-fg" aria-hidden="true" />
              <LineHoverAnchor href="tel:01292310190" variant="fade">
                0129-2310190 (University Proctor)
              </LineHoverAnchor>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent-fg" aria-hidden="true" />
              <LineHoverAnchor href="mailto:girlshostel@jcboseust.ac.in" variant="swap">
                girlshostel@jcboseust.ac.in (Chief Warden, Girls)
              </LineHoverAnchor>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-ink">Quick links</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li>
              <LineHoverLink href="/#hostels" variant="slide">
                Our four hostels
              </LineHoverLink>
            </li>
            <li>
              <LineHoverLink href="/#faq" variant="double">
                Questions and answers
              </LineHoverLink>
            </li>
            <li>
              <LineHoverLink href="/login" variant="grow">
                Student / warden login
              </LineHoverLink>
            </li>
            <li>
              <LineHoverLink href="/register" variant="pulse">
                New student registration
              </LineHoverLink>
            </li>
            <li>
              <LineHoverAnchor href="https://www.jcboseust.ac.in" target="_blank" rel="noopener noreferrer" variant="bounce">
                University website
              </LineHoverAnchor>
            </li>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <h3 className="text-sm font-semibold text-ink">In an emergency</h3>
          <Link
            href="/safety"
            className="mt-4 flex items-center gap-3 rounded-2xl border border-danger-500/30 bg-danger-soft px-4 py-3.5 text-sm font-semibold text-danger-fg transition-transform hover:-translate-y-0.5"
          >
            <ShieldAlert className="size-6 shrink-0" aria-hidden="true" />
            Safety &amp; Contacts: who to call for ragging, harassment, medical and security emergencies
          </Link>
        </div>
      </div>

      <div className="border-t border-line pb-24 pt-5">
        <p className="gutter text-center text-xs text-ink-muted">
          &copy; {year} J C Bose University of Science &amp; Technology, YMCA, Faridabad. Hostel portal built for
          demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
