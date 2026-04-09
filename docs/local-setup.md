# Local Setup

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 15+ reachable locally

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Use `.env.example` as reference.

Required for most local work:

- `DATABASE_URL`

Common local defaults:

- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- `GENERATOR_PROVIDER=mock`
- `GENERATOR_ENABLED=true`

## 3) Prepare database

Run migrations:

```bash
npm run db:migrate
```

Optional health check:

```bash
npm run db:check
```

## 4) Seed demo content

```bash
npm run seed:demo
```

This creates/updates the demo authored package and bootstraps a demo chronicle.

## 5) Start the app

```bash
npm run dev
```

## 6) Verify key surfaces

- Studio: `http://localhost:3000/studio`
- Reader chronicles: `http://localhost:3000/reader/chronicles`
- Reader demo scene: `http://localhost:3000/reader/chronicles/d2b85a5a-fd5e-4208-8aa1-60162d083f26/scene`
- Admin demo chronicle: `http://localhost:3000/admin/chronicles/d2b85a5a-fd5e-4208-8aa1-60162d083f26`

## 7) Run verification

Unit:

```bash
npm run test:unit
```

Integration:

```bash
npm run test:integration
```

E2E (runs seed first):

```bash
npm run test:e2e
```

Full gate:

```bash
npm run verify
```

## Troubleshooting notes

- If E2E web server startup times out, stop stale `next dev` processes and rerun `npm run test:e2e`.
- If seed script fails with DB connection errors, confirm `DATABASE_URL` is set in the shell running the command.
