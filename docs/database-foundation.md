# Database Foundation

## Purpose

This prompt establishes the persistence backbone for Inkbranch v2 without adding business schema tables yet.

## Packages

- `drizzle-orm` for type-safe database access.
- `drizzle-kit` for migration generation and migration tooling.
- `pg` as the PostgreSQL driver.

## File locations

- Drizzle config: `drizzle.config.ts`
- DB client/config/health wiring: `src/data/db/`
- Schema root: `src/data/schema/index.ts`
- Migration output directory: `drizzle/`

## Local environment setup

Set `DATABASE_URL` in a local non-committed env file (for example `.env.local`).

Committed `.env.example` uses placeholders only:

`DATABASE_URL=postgresql://inkbranch_app:your_password_here@localhost:5432/inkbranch_dev`

If your password includes `@`, URL-encode it as `%40` inside the connection string.

## Scripts

- `npm run db:generate`: Generate migrations from the Drizzle schema definitions.
- `npm run db:migrate`: Apply generated migrations.
- `npm run db:studio`: Open Drizzle Studio.
- `npm run db:check`: Run a local DB connectivity check (`select 1`).

## Preferred workflow

1. Define or update schema under `src/data/schema`.
2. Run `npm run db:generate`.
3. Run `npm run db:migrate`.
4. Optionally inspect with `npm run db:studio`.

## What this prompt intentionally does not include

- No authoring schema yet (`04_authoring_schema.md`).
- No runtime schema yet (`05_runtime_schema.md`).
- No query/mutation business logic yet.
- No planner/runtime/generator domain logic in the data layer.

## Architecture reminder

The database layer is relational-first infrastructure. It should stay explicit, inspectable, and separate from UI and story-logic concerns.
