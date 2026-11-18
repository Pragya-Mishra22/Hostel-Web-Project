import Link from "next/link";
import Image from "next/image";
import { Building2, ShieldCheck, ClipboardCheck, Users, Home, LogIn, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { HostelCard } from "@/components/site/hostel-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ParallaxGallery } from "@/components/ui/parallax-gallery";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { GlassDock } from "@/components/ui/glass-dock";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { homeFaqs } from "@/lib/faq-data";
import { getHostelsWithOccupancy } from "@/lib/hostel-data";

export default async function HomePage() {
  const hostels = await getHostelsWithOccupancy();
  const totalBeds = hostels.reduce((sum, h) => sum + h.totalBeds, 0);
  const totalOccupied = hostels.reduce((sum, h) => sum + h.occupiedBeds, 0);

  const galleryImages = [
    { src: "/images/campus/gate-1.webp", alt: "Main entrance of J C Bose University of Science & Technology, YMCA" },
    { src: "/images/hostels/kasturba.jpg", alt: "Residents at a morning session outside Kasturba Hall" },
    { src: "/images/campus/gym.jpg", alt: "Hostel gym used by residents" },
    { src: "/images/campus/wellness-camp.jpg", alt: "A health and wellness camp held for hostel residents" },
    { src: "/images/hostels/a-lalita.webp", alt: "Entrance of the A. Lalita Hostel" },
    { src: "/images/campus/gate-2.avif", alt: "University campus building" },
  ];

  return (
    <SmoothScroll>
      <Navbar />

      {/* ---------------------------------------------------------------- */}
      {/* Hero — layout cue taken from the reference screenshot (headline + */}
      {/* subcopy + quick-action bar on the left, a photo collage on the    */}
      {/* right instead of a cartoon illustration, kept calmer/institutional) */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-[var(--color-surface)] px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700">
              <Building2 className="size-3.5" aria-hidden="true" />
              J C Bose University of Science &amp; Technology, YMCA, Faridabad
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] text-ink md:text-5xl">
              A quieter, simpler way to run your hostel stay
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted md:text-lg">
              Register for a room, track your fees month by month, raise a complaint, or apply for
              leave, then show an approved pass at the gate instead of chasing signatures across
              campus.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/register">
                <Button size="lg" liquid className="w-full sm:w-auto">
                  Register as a student <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <LogIn className="size-4" aria-hidden="true" /> Warden / student login
                </Button>
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--color-line)] pt-6">
              <div>
                <dt className="text-xs font-medium text-ink-muted">Hostels</dt>
                <dd className="font-display text-2xl font-bold text-ink">{hostels.length}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-muted">Total beds</dt>
                <dd className="font-display text-2xl font-bold text-ink">{totalBeds}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-muted">Beds vacant</dt>
                <dd className="font-display text-2xl font-bold text-success-600">{totalBeds - totalOccupied}</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-5 gap-3">
            <div className="col-span-3 row-span-2 overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/images/campus/gate-1.webp"
                alt="Main gate of J C Bose University of Science & Technology, YMCA"
                width={600}
                height={760}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="col-span-2 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/hostels/kasturba.jpg"
                alt="Kasturba Hall"
                width={300}
                height={220}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-2 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/hostels/a-lalita.webp"
                alt="A. Lalita Hostel"
                width={300}
                height={220}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-ink shadow-lg">
              <ShieldCheck className="size-4 text-success-600" aria-hidden="true" />
              Ladies-only residences, warden on duty 24x7
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Hostels */}
      {/* ---------------------------------------------------------------- */}
      <section id="hostels" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <ScrollReveal as="h2" className="font-display text-3xl font-bold text-ink md:text-4xl">
          Four hostels, one portal
        </ScrollReveal>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Browse each hostel below, or go straight to registration to request a room once you've
          decided.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hostels.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How it works */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-surface-muted px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal as="h2" className="font-display text-3xl font-bold text-ink md:text-4xl">
            How the portal works
          </ScrollReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Register & get allocated",
                body: "Create a student account, pick a hostel, and your warden confirms a room and bed for you.",
              },
              {
                icon: ClipboardCheck,
                title: "Track fees & complaints",
                body: "See mess, hostel and electricity dues month by month, and raise a complaint that your warden can act on.",
              },
              {
                icon: Home,
                title: "Leave, approved digitally",
                body: "Apply for leave in the portal; once your warden approves it, show the pass at the gate instead of collecting signatures.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Campus life parallax gallery */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <ScrollReveal as="h2" className="font-display text-3xl font-bold text-ink md:text-4xl">
          Life on campus
        </ScrollReveal>
        <p className="mt-3 max-w-2xl text-ink-muted">
          A look at the campus and the amenities residents use day to day.
        </p>
        <div className="mt-10">
          <ParallaxGallery images={galleryImages} />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-surface-muted px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal as="h2" className="text-center font-display text-3xl font-bold text-ink md:text-4xl">
            Frequently asked questions
          </ScrollReveal>
          <div className="mt-10 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-6">
            <FaqAccordion items={homeFaqs} />
          </div>
          <p className="mt-6 text-center text-sm text-ink-muted">
            Have a safety concern instead?{" "}
            <LineHoverLink href="/safety" className="font-semibold text-brand-700">
              See who to contact
            </LineHoverLink>
            .
          </p>
        </div>
      </section>

      <Footer />

      <GlassDock
        items={[
          { title: "Home", icon: "Home", href: "/" },
          { title: "Hostels", icon: "Building2", href: "/#hostels" },
          { title: "Safety", icon: "ShieldAlert", href: "/safety" },
          { title: "Login", icon: "LogIn", href: "/login" },
        ]}
      />
    </SmoothScroll>
  );
}
