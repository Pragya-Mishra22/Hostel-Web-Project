# YMCA Hostels: Hostel Management Portal

A hostel management portal for the girls' hostels of J C Bose University of
Science & Technology, YMCA, Faridabad: Kasturba Hall, Mother Teresa Hostel,
Kalpana Chawla Hostel and A. Lalita Hostel. It is a local demo that runs on a
seeded SQLite database. See [DESIGN.md](./DESIGN.md) for the design notes.

## What it does

**Public site:** home page with a hero notch menu, the four hostels, essentials
folders, FAQ, a safety and contacts page, and a Ctrl+K search.

**Student portal:** register and choose a hostel, book a bed once approved, see
fee records (mess, hostel, electricity and cooler), raise complaints, apply for
leave and show the approved gate pass to the caretaker.

**Admin portal (chief warden and wardens):** admissions, room and bed
allocation with vacant and occupied counts, per-student fee records, complaint
box with status, leave approval and the gate register (who left and who came
back). Wardens only see the hostel they manage.

## Running it

Full step-by-step guide: [SETUP.md](./SETUP.md).

```bash
npm install
cp .env.example .env                 # then set JWT_SECRET to any long random string
npx prisma migrate dev --name init   # first time only, creates prisma/dev.db
npm run db:seed                      # fills it with demo data (safe to re-run)
npm run dev
```

Open <http://localhost:3000>.

## Demo logins

Password for every account: **`Hostel@123`**

| Role | Email |
|---|---|
| Chief warden (all hostels) | `chiefwarden@ymcahostels.demo` |
| Warden, Kasturba Hall | `warden.kast@ymcahostels.demo` |
| Warden, Mother Teresa Hostel | `warden.mth@ymcahostels.demo` |
| Warden, Kalpana Chawla Hostel | `warden.kc@ymcahostels.demo` |
| Warden, A. Lalita Hostel | `warden.alal@ymcahostels.demo` |
| Student | `priya.yadav1@ymcahostels.demo`, or register at `/register` and approve the account from `/admin/admissions`. |

## Scripts

- `npm run dev`: development server (Turbopack)
- `npm run build` and `npm run start`: production build and run
- `npm run lint`: ESLint (Next.js core-web-vitals and TypeScript rules)
- `npx tsc --noEmit`: type check
- `npm run db:seed`: clear the demo tables and reseed them (idempotent, only touches `prisma/dev.db`)

## Where the content comes from

Hostel facts, mess timings, FAQ answers, safety contacts and the officers'
directory were collected from the official university pages
(jcboseust.ac.in). Photos are the ones in `Hostel Images/`. Kalpana Chawla and
Mother Teresa have no photo yet, so their cards say "Photo coming soon".

## Things to know

- **Fee amounts are demo values.** The university publishes its charges in a
  PDF that was not read for this project, so the amounts in the seed data are
  placeholders. The public pages link to the official charges document instead
  of quoting numbers. Fees are record-only; no payment is taken.
- **Individual warden names and phone numbers** are not published, so the
  safety page lists the university-level contacts and points students to
  their hostel notice board.
- `npm audit` still reports advisories in the Prisma CLI toolchain. They affect
  the dev-time CLI, not the running app.
