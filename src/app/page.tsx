import Image from "next/image";
import { Building2, ClipboardCheck, Users, Home, LogIn, ArrowRight, Wallet, DoorOpen, ShieldCheck } from "lucide-react";
import { PublicHeader } from "@/components/site/public-header";
import { Footer } from "@/components/site/footer";
import { HostelCard } from "@/components/site/hostel-card";
import { HeroSearch } from "@/components/site/hero-search";
import { IntroLoader } from "@/components/site/intro-loader";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { LiquidButton } from "@/components/ui/liquid-button";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal";
import { FlipFadeText } from "@/components/ui/flip-fade-text";
import { FolderPreview, type FolderInfo } from "@/components/ui/folder-preview";
import { ParallaxGallery } from "@/components/ui/parallax-gallery";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { GlassDock } from "@/components/ui/glass-dock";
import { LineHoverAnchor, LineHoverLink } from "@/components/ui/line-hover-link";
import { homeFaqs, OFFICIAL_CHARGES_URL, OFFICIAL_RULES_URL } from "@/lib/faq-data";
import { getHostelsWithOccupancy } from "@/lib/hostel-data";

// Occupancy changes whenever a bed is allocated, so this page must never be prerendered.
export const dynamic = "force-dynamic";

const CARD_VARIANTS = ["brand", "gold", "success", "accent"] as const;

const GALLERY = [
  { src: "/images/campus/gate-2.avif", alt: "The university building and approach road" },
  { src: "/images/hostels/kasturba.jpg", alt: "Residents at a morning yoga session outside Kasturba Hall" },
  { src: "/images/campus/gym.jpg", alt: "The hostel gym" },
  { src: "/images/campus/wellness-camp.jpg", alt: "A health camp held for hostel residents" },
  { src: "/images/hostels/a-lalita.webp", alt: "The entrance of the A. Lalita Hostel" },
  { src: "/images/campus/gate-1.webp", alt: "The main entrance of the university" },
];

const INFO_FOLDERS: { label: string; info: FolderInfo }[] = [
  {
    label: "Who can apply",
    info: {
      title: "Eligibility and allotment",
      rows: [
        { label: "Girls studying at the university" },
        { label: "Home more than 60 km away" },
        { label: "First come, first served" },
        { label: "Form, fees and affidavits together" },
      ],
    },
  },
  {
    label: "Mess timings",
    info: {
      title: "Meal hours and bills",
      rows: [
        { label: "Breakfast", value: "7:30 to 9:30 am" },
        { label: "Lunch", value: "12:30 to 2:15 pm" },
        { label: "Dinner", value: "8:00 to 9:30 pm" },
        { label: "Bill due by", value: "12th, Rs 10/day fine" },
      ],
    },
  },
  {
    label: "Facilities",
    info: {
      title: "In the girls' hostels",
      rows: [
        { label: "Gym, badminton and basketball" },
        { label: "Reading room and common room" },
        { label: "Wi-Fi, RO water, power backup" },
        { label: "First aid, 24x7 ambulance, CCTV" },
      ],
    },
  },
  {
    label: "Leave and gate pass",
    info: {
      title: "Going home, in this portal",
      rows: [
        { label: "1  Apply in the portal" },
        { label: "2  Warden approves" },
        { label: "3  Show the pass at the gate" },
        { label: "4  Caretaker logs exit and return" },
      ],
    },
  },
];

const PHOTO_FOLDERS = [
  { label: "Campus", variant: "devi" as const, images: ["/images/campus/gate-1.webp", "/images/campus/gate-2.avif", "/images/hostels/kasturba.jpg", "/images/hostels/a-lalita.webp"] },
  { label: "Kasturba Hall", variant: "ardra" as const, images: ["/images/hostels/kasturba.jpg", "/images/campus/wellness-camp.jpg", "/images/campus/gym.jpg", "/images/campus/gate-1.webp"] },
  { label: "A. Lalita Hostel", variant: "hari" as const, images: ["/images/hostels/a-lalita.webp", "/images/campus/gate-2.avif", "/images/hostels/kasturba.jpg"] },
  { label: "Health and fitness", variant: "kubera" as const, images: ["/images/campus/gym.jpg", "/images/campus/wellness-camp.jpg", "/images/hostels/kasturba.jpg"] },
];

export default async function HomePage() {
  const hostels = await getHostelsWithOccupancy();
  const totalBeds = hostels.reduce((sum, h) => sum + h.totalBeds, 0);
  const totalOccupied = hostels.reduce((sum, h) => sum + h.occupiedBeds, 0);
  const totalRooms = hostels.reduce((sum, h) => sum + h.totalRooms, 0);
  const navHostels = hostels.map((h) => ({
    id: h.id,
    name: h.name,
    code: h.code,
    description: h.description,
    imageUrl: h.imageUrl,
  }));

  return (
    <SmoothScroll>
      <IntroLoader />
      <PublicHeader />

      <main>
        {/* Hero: full-bleed photo, with the live numbers across the bottom edge */}
        <section className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-brand-950 text-white">
          <Image
            src="/images/campus/gate-2.avif"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/85 to-brand-950/25" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/90 via-transparent to-brand-950/40" />

          <div className="gutter grid flex-1 grid-cols-1 items-center gap-10 pb-12 pt-32 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
                <Building2 className="size-3.5" aria-hidden="true" />
                J C Bose University of Science &amp; Technology, YMCA, Faridabad
              </span>

              <GooeyTextReveal delay={0.2} className="mt-6">
                <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl xl:text-7xl">
                  A quieter, simpler way to run your hostel stay
                </h1>
              </GooeyTextReveal>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 text-xl font-semibold text-white/90 md:text-2xl">
                <span>One portal for</span>
                <FlipFadeText
                  words={["Rooms", "Fees", "Complaints", "Leave passes"]}
                  interval={2200}
                  letterDuration={0.5}
                  staggerDelay={0.05}
                  className="min-h-0 justify-start"
                  textClassName="text-xl normal-case tracking-normal text-gold-300 md:text-2xl dark:text-gold-300"
                />
              </div>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                Register for a room, track your fees month by month, raise a complaint, or apply for leave, then show an
                approved pass at the gate instead of chasing signatures across campus.
              </p>

              <div className="mt-8">
                <HeroSearch hostels={navHostels} />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <LiquidButton href="/register" variant="gold" size="lg" className="w-full sm:w-auto">
                  Register as a student <ArrowRight className="size-4" aria-hidden="true" />
                </LiquidButton>
                <LiquidButton href="/login" variant="dark" size="lg" className="w-full sm:w-auto">
                  <LogIn className="size-4" aria-hidden="true" /> Student or warden login
                </LiquidButton>
              </div>
            </div>

            {/* Live vacancy panel */}
            <aside aria-label="Live bed availability" className="lg:col-span-5">
              <div className="ml-auto w-full max-w-xl rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Live availability</p>
                    <p className="mt-1 font-display text-4xl font-extrabold tabular-nums">
                      {totalBeds - totalOccupied}
                      <span className="ml-2 text-base font-medium text-white/70">beds vacant of {totalBeds}</span>
                    </p>
                  </div>
                  <ShieldCheck className="size-8 text-success-fg" aria-hidden="true" />
                </div>
                <ul className="mt-5 space-y-3">
                  {hostels.map((h) => {
                    const pct = h.totalBeds > 0 ? Math.round((h.occupiedBeds / h.totalBeds) * 100) : 0;
                    return (
                      <li key={h.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{h.name}</span>
                          <span className="font-mono text-xs text-white/70">
                            {h.totalBeds - h.occupiedBeds} / {h.totalBeds} vacant
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
                          <div className="h-full rounded-full bg-gold-400" style={{ width: `${pct}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          </div>

          <dl className="relative z-10 grid grid-cols-2 border-t border-white/15 bg-white/5 backdrop-blur-md md:grid-cols-4">
            {[
              { label: "Hostels", value: hostels.length, icon: Building2 },
              { label: "Rooms", value: totalRooms, icon: DoorOpen },
              { label: "Total beds", value: totalBeds, icon: Users },
              { label: "Beds vacant", value: totalBeds - totalOccupied, icon: ClipboardCheck },
            ].map((stat) => (
              <div key={stat.label} className="gutter flex items-center gap-4 border-white/10 py-5 odd:border-r md:border-r md:last:border-r-0">
                <stat.icon className="size-6 text-gold-300" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-medium text-white/60">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold tabular-nums">{stat.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* Hostels */}
        <section id="hostels" className="gutter w-full bg-page py-20 md:py-28">
          <GooeyTextReveal mode="scroll" className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">Four hostels, one portal</h2>
            <p className="mt-4 text-base text-ink-muted md:text-lg">
              Compare beds and vacancy, then go straight to registration to request a seat in the hostel that suits you.
            </p>
          </GooeyTextReveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {hostels.map((hostel, i) => (
              <HostelCard key={hostel.id} hostel={hostel} variant={CARD_VARIANTS[i % CARD_VARIANTS.length]} />
            ))}
          </div>
        </section>

        {/* Essentials: folders that open to show information */}
        <section id="essentials" className="gutter w-full bg-surface-muted py-20 md:py-28">
          <GooeyTextReveal mode="scroll" className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">Hostel essentials</h2>
            <p className="mt-4 text-base text-ink-muted md:text-lg">
              Hover, tap or focus a folder to open it. Details come from the university&apos;s own hostel pages, so check{" "}
              <LineHoverAnchor href={OFFICIAL_RULES_URL} target="_blank" rel="noopener noreferrer" variant="double" className="font-semibold text-accent-fg">
                the official rules
              </LineHoverAnchor>{" "}
              for the latest.
            </p>
          </GooeyTextReveal>

          <div className="mt-24 grid grid-cols-1 justify-items-center gap-x-6 gap-y-28 sm:grid-cols-2 lg:grid-cols-4">
            {INFO_FOLDERS.map((f, i) => (
              <FolderPreview key={f.label} variant="info" size="xl" label={f.label} info={f.info} className={i % 2 ? "lg:mt-0" : ""} />
            ))}
          </div>

          <h3 className="mt-28 font-display text-2xl font-bold text-ink md:text-3xl">Photo folders</h3>
          <div className="mt-20 grid grid-cols-1 justify-items-center gap-x-6 gap-y-24 pb-8 sm:grid-cols-2 lg:grid-cols-4">
            {PHOTO_FOLDERS.map((f) => (
              <FolderPreview key={f.label} variant={f.variant} size="xl" label={f.label} images={f.images} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="gutter w-full bg-page py-20 md:py-28">
          <GooeyTextReveal mode="scroll" className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">How the portal works</h2>
          </GooeyTextReveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Users, title: "Register and get approved", body: "Create a student account and choose a hostel. Your warden reviews and approves it." },
              { icon: Home, title: "Book your bed", body: "Once approved, pick any vacant bed in your hostel and see your room on your dashboard." },
              { icon: Wallet, title: "Track fees and complaints", body: "See mess, hostel and electricity dues month by month, and raise a complaint your warden can act on." },
              { icon: DoorOpen, title: "Leave, approved digitally", body: "Apply for leave in the portal; once approved, show the pass at the gate instead of collecting signatures." },
            ].map((step, i) => (
              <div key={step.title} className="rounded-3xl border border-line bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-accent-fg">
                    <step.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-sm font-semibold text-ink-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Parallax gallery, full bleed */}
        <section aria-label="Life on campus" className="w-full bg-surface-muted pt-20 md:pt-28">
          <div className="gutter pb-12">
            <GooeyTextReveal mode="scroll" className="max-w-3xl">
              <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">Life on campus</h2>
              <p className="mt-4 text-base text-ink-muted md:text-lg">The campus and the places residents use every day. Scroll to watch it move.</p>
            </GooeyTextReveal>
          </div>
          <ParallaxGallery images={GALLERY} />
        </section>

        {/* FAQ */}
        <section id="faq" className="gutter w-full bg-page py-20 md:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <GooeyTextReveal mode="scroll">
                <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">Frequently asked questions</h2>
                <p className="mt-4 text-base text-ink-muted md:text-lg">Quick answers on admission, fees, leave and safety.</p>
              </GooeyTextReveal>
              <p className="mt-8 text-sm text-ink-muted">
                Answers are summarised from the university&apos;s{" "}
                <LineHoverAnchor href={OFFICIAL_RULES_URL} target="_blank" rel="noopener noreferrer" variant="slide" className="font-semibold text-accent-fg">
                  hostel rules
                </LineHoverAnchor>{" "}
                and{" "}
                <LineHoverAnchor href={OFFICIAL_CHARGES_URL} target="_blank" rel="noopener noreferrer" variant="slide" className="font-semibold text-accent-fg">
                  charges
                </LineHoverAnchor>{" "}
                pages. Have a safety concern instead?{" "}
                <LineHoverLink href="/safety" variant="double" className="font-semibold text-accent-fg">
                  See who to contact
                </LineHoverLink>
                .
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-line bg-card py-2">
                <FaqAccordion items={homeFaqs} />
              </div>
            </div>
          </div>
        </section>

        {/* Closing banner */}
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 py-20 text-white md:py-24">
          <div className="gutter flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold md:text-5xl">Ready to move in?</h2>
              <p className="mt-3 text-base text-white/80 md:text-lg">
                Register in a few minutes. Your warden reviews it, and you can book a bed as soon as you are approved.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <LiquidButton href="/register" variant="gold" size="lg">
                Register now <ArrowRight className="size-4" aria-hidden="true" />
              </LiquidButton>
              <LiquidButton href="/safety" variant="dark" size="lg">
                Safety and contacts
              </LiquidButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <GlassDock
        items={[
          { title: "Home", icon: "home", href: "/" },
          { title: "Hostels", icon: "marker", href: "/#hostels" },
          { title: "Essentials", icon: "doc", href: "/#essentials" },
          { title: "Contact", icon: "email", href: "mailto:girlshostel@jcboseust.ac.in" },
          { title: "Safety", icon: "ShieldAlert", href: "/safety" },
          { title: "Login", icon: "LogIn", href: "/login" },
        ]}
      />
    </SmoothScroll>
  );
}
