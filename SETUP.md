# SETUP: Run this project from a zip

YMCA Hostels portal (Next.js 16, React 19, Prisma + SQLite). Runs fully locally, no external services or API keys.

## 1. Requirements

- **Node.js 20.9 or newer** (22 LTS recommended). Check with `node -v`.
- **npm** (comes with Node).
- Windows, macOS or Linux. No database server needed: SQLite is a single file.

## 2. Setup (first time only)

Unzip, open a terminal **inside the project folder** (the one containing `package.json`), then run:

```bash
npm install
```

Create the environment file by copying the template (`.env` is not stored in git):

```bash
cp .env.example .env
```

(On Windows PowerShell: `Copy-Item .env.example .env`.) It contains two values:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me-to-a-long-random-string-at-least-32-chars"
```

`JWT_SECRET` signs login sessions; use any long random string. Login will not work without it.

Create the database and fill it with demo data:

```bash
npx prisma migrate dev --name init
```

```bash
npm run db:seed
```

The database file `prisma/dev.db` is not stored in git, so a fresh clone always needs these two commands.

## 3. Run

Development (hot reload):

```bash
npm run dev
```

Production-style (faster):

```bash
npm run build
```

```bash
npm run start
```

Open **http://localhost:3000**. Stop the server with `Ctrl + C`.

## 4. Demo logins

Password for **every** account: `Hostel@123`. Login page: `/login`.

| Role | Email |
|---|---|
| Chief warden (all hostels) | `chiefwarden@ymcahostels.demo` |
| Warden, Kasturba Hall | `warden.kast@ymcahostels.demo` |
| Warden, Mother Teresa Hostel | `warden.mth@ymcahostels.demo` |
| Warden, Kalpana Chawla Hostel | `warden.kc@ymcahostels.demo` |
| Warden, A. Lalita Hostel | `warden.alal@ymcahostels.demo` |
| Student | `priya.yadav1@ymcahostels.demo` |

Wardens only see their own hostel. A newly registered student cannot log in until a warden approves them under **Admin > Admissions**.

## 5. Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` / `npm run start` | Production build and run |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `npm run db:seed` | Wipe the demo tables and reseed (safe, local file only) |

## 6. Troubleshooting

- **Port 3000 in use:** stop the other server, or run `npx next dev -p 3001`.
- **"Cannot find module" or Prisma client errors:** run `npm install` then `npx prisma generate`.
- **Login says incorrect or the database is empty:** run `npm run db:seed`.
- **Stale build problems:** delete the `.next` folder and start again.
- **Do not use `prisma migrate reset` inside an AI agent session.** It is guarded; use `npm run db:seed` instead.

## 7. Project map

- `src/app/`: pages and API routes (`/admin`, `/student`, `/login`, `/register`, `/safety`, `src/app/api/*`).
- `src/components/`: UI (`ui/` shared components, `site/` public layout, `admin/`, `student/`).
- `src/proxy.ts`: route protection (Next.js 16 uses `proxy.ts`, not middleware).
- `prisma/schema.prisma`, `prisma/seed.ts`: data model and demo data.
- `Hostel Images/`, `public/`: photos and static assets.
- `DESIGN.md`: design decisions. `README.md`: overview.

## 8. Notes for AI agents

- This is Next.js 16, which has breaking changes. Read `node_modules/next/dist/docs/` before changing framework code (see `AGENTS.md`).
- Tailwind CSS 4 is configured in `src/app/globals.css` (no `tailwind.config`).
- Fee amounts are demo values and fees are record-only (no payments).
