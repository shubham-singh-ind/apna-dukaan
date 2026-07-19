# Apna Dukaan

Hyperlocal neighborhood shop discovery platform (MVP). See [PROJECT.md](PROJECT.md) for the PRD + HLD.

## Stack

- **Next.js 15** (App Router, SSR) — public site + admin panel + versioned API routes
- **PostgreSQL** via **Prisma**
- **S3-compatible** object storage for images
- **JWT** cookie auth for the admin panel

> Note: The HLD describes a separate Node/Express backend. The MVP ships the API as
> Next.js route handlers under `/api/v1/*` for speed; it can be extracted into a
> standalone service later without changing the data model.

## Project structure

```
prisma/
  schema.prisma        # data model (PROJECT.md §7)
  seed.ts              # default admin + sample shop
src/
  app/
    (public)/          # homepage, listing, shop detail, search
    admin/             # dashboard, login, shops, categories, localities
    api/v1/            # public + /admin API route handlers
  components/          # public/ and admin/ UI components
  lib/                 # db, auth, s3, env, api helpers
  middleware.ts        # protects /admin and /api/v1/admin
  types/
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env      # then fill in DATABASE_URL, JWT_SECRET, S3_*

# 3. Set up the database
npm run db:generate       # generate Prisma client
npm run db:push           # create tables (or db:migrate for migrations)
npm run db:seed           # seed default admin + sample data

# 4. Run
npm run dev               # http://localhost:3000  (admin at /admin)
```

Default seeded admin: `admin@apnadukaan.local` / `changeme123` (override with
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |
| `npm run db:migrate` | Create + apply a migration |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Seed data |
```
# apna-dukaan
