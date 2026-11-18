# YMCA Hostels — Hostel Management System
### Design Document

**Project:** Hostel management portal for the JC Bose University of Science & Technology, YMCA (Faridabad) girls' hostels
**Date:** 2026-11-18
**Status:** Awaiting approval (nothing is built yet)

---

## 1. Intent & Why

The four girls' hostels — **Kasturba, Mother Teresa, Kalpana Chawla, and A. Lalita** — currently run on paper and physical sign-offs. A student going home has to get a leave slip signed "in ten places"; wardens track rooms, fees, and complaints by hand. This portal digitizes those daily operations into **one web app with two sides**: an **admin side** for the chief warden and wardens, and a **student side**.

The single most valuable outcome: a student submits a leave request, a warden approves it, and the **approved pass is shown at the gate** — no more chasing signatures. Everything else (rooms, fees, complaints, the home/return register) supports the same goal: replace paper with a reliable, visible record.

**Decided scope (from our conversation):** this is a **college / demo-grade project** that runs on a laptop with realistic seeded data. It is not (yet) a hardened production deployment for live use.

---

## 2. Goals / Non-Goals / Anti-Goals

### Goals
- One app, two role-based experiences (Admin + Student), with secure login.
- Admin: student admissions, room/bed allocation with live vacant-vs-occupied counts per hostel, fee records (mess monthly, hostel yearly, electricity/cooler), per-hostel complaint tracking, leave approvals, and a daily "went home / returned" register.
- Student: self-registration + room booking, own fee records with per-month recording, complaint box, and leave applications that produce a printable **gate pass** once approved.
- Public: homepage with the four hostels' photos, and a footer with address + a **Safety & Contacts** page (anti-ragging, anti-harassment, emergency numbers).
- Every feature fully working end to end on first run, with sample data — no dead buttons, no stubs.

### Non-Goals (explicitly out of scope for this version)
- Moving real money. Fee "payment" is **record-only** (mark paid/pending, generate a receipt). No payment gateway.
- Real hostel photos and real safety phone numbers — **placeholders** are used, wired so they are trivial to swap.
- Mobile native apps, SMS/email notifications, biometric/gate-hardware integration.
- Multi-university / multi-campus generalization.

### Anti-Goals (would make this a failure even if it "works")
- "AI slop": generic filler text, emoji used as icons, broken/placeholder links that go nowhere, inconsistent styling page to page.
- Features that look present but error out (e.g., a dashboard chart that crashes on empty data).
- A login that can be bypassed, or a student who can see another student's data or reach admin pages.

---

## 3. Constraints

- Runs on Windows 11, Node 24, with **one command** (`npm run dev`) and **no separate database server** to install.
- All data in a local file database; a seed script fills realistic demo data and demo logins.
- Claude cannot and will not move real money or fetch copyrighted real photos; placeholders only.
- Accessibility and responsiveness are requirements, not extras (contrast ≥ 4.5:1, keyboard nav, works 375px→1440px, SVG icons only).

---

## 4. Approaches Considered

1. **Static HTML/CSS/JS, no backend.** Rejected — logins, role separation, persisted fees/complaints/leave, and admin dashboards need a real database and server logic. A static site can only fake it, which violates the "every feature actually works" goal.
2. **Separate React (Vite) SPA + a standalone Express + SQLite API.** Workable, but two codebases, two dev servers, hand-rolled auth/CORS plumbing — more surface area for errors, against the "reliable, no faults" goal.
3. **✅ Chosen — one Next.js app (App Router) with built-in API routes, Prisma ORM, and a SQLite file database.** Single codebase, single command to run, server + UI + database access in one place, type-safe queries, mature and well-documented. Easiest path to a flawless demo on Windows with zero DB setup. This is the one sensible way given the scope.

---

## 5. Technology (my engineering calls)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript** | One app for UI + API; type safety catches errors before runtime |
| Database | **SQLite file** via **Prisma ORM** | No server to install; type-safe; trivial to seed and reset |
| Auth | **Custom**: `bcryptjs` password hashing + signed **JWT in an httpOnly cookie** (`jose`) + Next.js **middleware** guarding `/admin/*` and `/student/*` | Transparent, reliable, no fragile third-party auth config |
| Styling | **Tailwind CSS v4** + a small set of hand-built components | Consistent tokens, fast, no heavy UI library to fight |
| Icons | **lucide-react** (SVG) | Rule: never emoji as icons |
| Charts | **Recharts** | Occupancy / complaints / fees dashboards, with empty-data + accessible fallbacks |
| Forms & validation | **react-hook-form + zod** (shared client/server schemas) | One source of truth; real inline validation |
| Dates | **date-fns** | Leave ranges, fee periods, daily registers |
| PDF/print | Browser print stylesheet for the **gate pass** & fee receipt | No extra dependency; reliable |

Any choice above is mine, not something you committed to — flag anything you want changed.

---

## 6. Roles & Access

- **CHIEF_WARDEN** — full access across all four hostels.
- **WARDEN** — assigned to one hostel; manages only that hostel's rooms, students, complaints, leaves, fees, and gate register.
- **STUDENT** — only their own profile, room, fees, complaints, and leaves.

Middleware redirects by role after login; students can never reach `/admin/*` and wardens only see their hostel's data.

---

## 7. Data Model (Prisma)

- **User** — id, name, email, passwordHash, role, phone. Student users link to a Student profile; warden users link to a hostel.
- **Hostel** — id, name, code, address, description, imageUrl (placeholder), wardenName/phone. Seeded with the four hostels.
- **Room** — id, hostelId, roomNumber, floor, capacity (beds: 1–4).
- **Bed** — id, roomId, bedNumber, studentId (null = vacant). Occupancy and vacancy counts are derived from beds — always accurate.
- **Student** — id, userId, rollNumber, course, year, phone, guardianName/phone, address, hostelId, bedId, admissionStatus (PENDING/APPROVED/REJECTED), photoUrl (placeholder).
- **FeeRecord** — id, studentId, type (**MESS** monthly / **HOSTEL** yearly / **ELECTRICITY** monthly — cooler billing folded in here), periodLabel (e.g. "Nov 2026" or "2026–27"), amount, status (PAID/PENDING), paidAt, receiptNo, recordedByUserId.
- **Complaint** — id, studentId, hostelId, category (ELECTRICAL/PLUMBING/WIFI/CLEANLINESS/MESS/OTHER), title, description, status (OPEN/IN_PROGRESS/RESOLVED), createdAt, resolvedAt, remarks.
- **LeaveApplication** — id, studentId, hostelId, fromDate, toDate, reason, destination, status (PENDING/APPROVED/REJECTED), appliedAt, decidedAt, decidedByUserId, wardenRemarks.
- **MovementLog** — id, studentId, leaveId, type (DEPARTURE/RETURN), timestamp, recordedByUserId. Powers the "how many went home / returned today" register.

---

## 8. Pages & Feature Behavior

### Public
- **`/` Home** — hero, the four hostel cards with photos, quick stats, "how it works", footer with address.
- **`/safety` Safety & Contacts** — emergency, anti-ragging, anti-harassment contacts (placeholder numbers, labeled by role/purpose).
- **`/login`** — one login; routes to the right portal by role.
- **`/register`** — student self-registration → creates a **PENDING** admission for a warden to approve.

### Student portal (`/student/*`)
- **Dashboard** — room/allocation status, fees due this month, open complaints, pending leaves, latest gate pass.
- **Room booking** — pick hostel + available room/bed (shows live vacancy); request → warden allocates/confirms.
- **Fees** — table by type and period; mark/record a month's payment → printable **receipt**; dues highlighted.
- **Complaints** — raise one (category + description); track status (open/in-progress/resolved).
- **Leave** — apply (dates, reason, destination); track status; when approved, view/print the **gate pass** (student + dates + warden approval + QR-less verification code).

### Admin portal (`/admin/*`)
- **Dashboard** — occupancy per hostel (chart), complaints today/open/resolved (chart), fee collection vs pending (chart), today's departures/returns. Empty-data states handled.
- **Admissions** — queue of pending registrations; approve/reject.
- **Rooms** — per-hostel room grid with bed occupancy; **allocate/vacate beds**; live vacant/occupied/total counts.
- **Students** — searchable list; profile detail.
- **Fees** — student × period matrix; filter by hostel/type/month; mark paid/pending; see who hasn't paid which month.
- **Complaints** — per-hostel board grouped by status; daily counts; resolve with remarks.
- **Leaves** — approval queue; approve/reject with remarks.
- **Gate register** — mark a student's DEPARTURE / RETURN against an approved leave; daily counts of who's out and who's back.

---

## 9. Design System (adapted via ui-ux-pro-max)

The skill's generator recommended a cold, mono-font "data-dense dashboard". I'm **keeping its rigor** (KPI cards, status colors, WCAG AA, hover/empty/loading states) but **rejecting the techy mono headings** — a university hostel site should feel warm and institutional, not like a trading terminal.

- **Identity:** institutional **deep blue** primary (`#1D4ED8`/navy family) with a warm **amber/gold** accent for calls to action — a classic, trustworthy campus feel.
- **Status colors:** success green, warning amber, danger red, used consistently for fees/complaints/leave states (never color alone — always an icon or label too).
- **Typography:** headings **Plus Jakarta Sans**, body/UI **Inter**, data/IDs/receipts in a **tabular mono** (JetBrains Mono) so fee columns and roll numbers line up.
- **Components:** card-based layouts, 8px spacing rhythm, visible focus rings, 44px touch targets, lucide SVG icons throughout.
- **Responsive & accessible:** mobile-first, verified at 375 / 768 / 1024 / 1440px; `prefers-reduced-motion` respected; charts have table/text fallbacks.
- Per-feature implementation will be cross-checked against **modern-web-guidance** (forms, auth cookies, data fetching, image loading) as each module is built.

---

## 10. Seed / Demo Data

A reset-able seed script creates: the 4 hostels with rooms+beds, 1 chief warden, 4 wardens (one per hostel), ~25 students across hostels with a realistic mix of fee records (paid/pending across months), complaints (open/resolved), leaves (pending/approved), and movement logs — so every screen looks alive on first run. Demo logins printed to the console and documented in the README.

---

## 11. Build Phases (how it will be executed)

1. **Scaffold & install** — Next.js + TypeScript + Tailwind + Prisma + deps; project skeleton; `.env`.
2. **Database & seed** — Prisma schema, migrate, seed script with demo data.
3. **Auth** — register/login, password hashing, JWT cookie, middleware, role routing.
4. **Public site** — home (four hostels), safety page, footer, shared layout & design system.
5. **Student portal** — dashboard, room booking, fees + receipt, complaints, leave + gate pass.
6. **Admin portal** — dashboard + charts, admissions, rooms/beds, students, fees matrix, complaints board, leaves queue, gate register.
7. **Polish & verify** — empty/loading/error states, responsive + accessibility pass, run the app and click through every feature; README with run steps and demo logins.

Each phase is runnable; the app never ends a phase broken.

---

## 12. Left to the Builder

- Exact room counts/numbering per hostel (sensible defaults seeded; easy to edit).
- Precise fee amounts and which months are pre-paid in the demo (realistic defaults).
- Final copy for the homepage "about" blurb (institutional placeholder, easy to edit).
- Placeholder image treatment (tasteful campus/building imagery) and the folder/manifest where you later drop the real photos and real safety numbers.

---

## 13. Addendum — Motion & Component Library

You supplied a large reference set of custom components (liquid-morph buttons, GSAP scroll reveals, a parallax image gallery, a glass dock, a mega-menu navbar, a command-style search, a line-hover link, a FAQ accordion, a kinetic-text loader) and real hostel photos in `Hostel Images/`. This section records how they're adapted, and why, so the build stays error-free and fast.

**Real photos.** The six files in `Hostel Images/` (campus/hostel photography) replace the placeholder plan from §12 for the homepage hero and hostel gallery — copied into `/public/images/hostels/`, optimized, served via `next/image`.

**Hero layout reference.** The "Find My Hostel" screenshot you attached is used **only** as a layout cue for the home page hero (illustration-less, calmer, more institutional) — not copied verbatim, not applied anywhere else.

**Component adaptations (my calls, with reasons):**
- **Buttons** — one `Button` component (cva-based, like your `LiquidButton`) with real variants (primary/secondary/outline/destructive/accent) × sizes (sm/default/lg), so color and size genuinely vary by context across the site. The hover "liquid ink" blob effect is real (SVG turbulence/displacement filter) but gated to marketing-page buttons only (home, login, register); it's dropped on data-dense admin/student screens (fee tables, complaint lists) where many buttons render at once — running a per-button animated SVG filter there would cause the exact lag you asked me to avoid. Those buttons get a lighter press/hover treatment instead. All respect `prefers-reduced-motion`.
- **Scroll reveal** — implemented with **GSAP + ScrollTrigger + SplitText** (now free in GSAP's core package) for section headings on public pages, with a Framer Motion fallback for simple fades — not applied inside admin/student tables for the same lag reason.
- **Parallax image gallery** — built from your `Skiper30` pattern using the real hostel photos, on the home page only.
- **FAQ accordion** — built from your pattern. **Apify MCP isn't connected in this session**, so I can't scrape the live YMCA site through it; I've written the FAQ content from the university's public, general information (hostel rules, fees, visiting hours, safety) in my own words, kept short and clearly editable, rather than leaving it fake or copying text verbatim.
- **Glass dock** — kept as a fixed, expand/compress-on-hover glass dock for quick navigation, **without** the GSAP `MorphSVGPlugin` icon-morphing (an optional plugin that can silently no-op if it fails to load — a fragile dependency for a "zero errors" build). Icons use smooth scale/translate + tooltip instead, same feel, no fragile dependency.
- **Mega-menu navbar** — adapted structurally for this site's real sections (Home, Hostels, Safety, Login) instead of generic SaaS content.
- **Search modal** — adapted to the site's icon system. Your reference uses `@phosphor-icons/react`; the rest of the site uses `lucide-react` (per the UI/UX skill's "one icon set sitewide" rule), so the search modal uses `lucide-react` icons too, to stay visually consistent.
- **Line-hover links** — used site-wide for inline text links, as you asked.
- **Kinetic-text loader** — used as the shared loading state for anything slower than ~300ms.
- **Copy rule** — no literal `--` in any on-page sentence/copy anywhere on the site.

**New dependencies this adds:** `framer-motion`, `gsap`, `lenis`, `class-variance-authority`, `clsx`, `tailwind-merge`. All are installed and locked to specific versions.
