# YMCA Hostels — Hostel Management Portal

A hostel management portal for the girls' hostels of J C Bose University of
Science & Technology, YMCA, Faridabad — Kasturba, Mother Teresa, Kalpana
Chawla and A. Lalita. Built as a local demo with realistic seeded data; see
[DESIGN.md](./DESIGN.md) for the full design doc and the reasoning behind
every technical choice.

## Running it

```bash
npm install
npx prisma migrate dev --name init   # first time only — creates dev.db
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
| Student | Any **approved** seeded student — open `/admin/students` after logging in as staff to find one, or register a new account at `/register` and approve it yourself from `/admin/admissions`. |

## Resetting the demo data

```bash
npm run db:seed
```

This clears every table and reseeds fresh (4 hostels, 5 staff accounts, 28
students with a realistic mix of fee/complaint/leave states). Safe to run
any time — it only touches the local `prisma/dev.db` SQLite file.

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` / `npm run start` — production build and run
- `npm run db:seed` — reset and reseed demo data

## Known, accepted limitation

`npm run lint` currently fails with an upstream `@eslint/eslintrc` /
`eslint-config-next` compatibility bug under ESLint 9 flat config (both
`eslint-plugin-react` and `typescript-eslint` ship self-referential flat
configs that crash the legacy compat shim's error formatter). This is an
ecosystem issue, not an app defect — correctness is instead verified via
`npx tsc --noEmit` (clean) and `npm run build` (clean), both of which are
re-run after every change.
