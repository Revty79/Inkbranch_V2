# Inkbranch v2

Inkbranch v2 is a planner-led, book-first, world-first interactive fiction platform.

It is not a beat-graph-first system.

## Core product loop

`authored truth -> planner scene package -> runtime commit -> reader render -> next planner cycle`

Core ownership:

- Authoring data defines possible truth.
- Planner decides valid scene structure and choice structure.
- Runtime commits what happened in relational state + event history.
- Generator renders approved structure into presentation (never canon truth).

## Stack

- Next.js App Router + TypeScript
- PostgreSQL + Drizzle ORM
- Vitest (unit/integration)
- Playwright (targeted E2E)

## Quick start

1. Install dependencies:
   - `npm install`
2. Configure env:
   - copy `.env.example` values into local env (at minimum `DATABASE_URL`)
3. Run migrations:
   - `npm run db:migrate`
4. Seed demo package:
   - `npm run seed:demo`
5. Start app:
   - `npm run dev`

High-value routes after seeding:

- Studio: `/studio`
- Reader chronicle list: `/reader/chronicles`
- Demo reader scene: `/reader/chronicles/d2b85a5a-fd5e-4208-8aa1-60162d083f26/scene`
- Admin demo chronicle: `/admin/chronicles/d2b85a5a-fd5e-4208-8aa1-60162d083f26`

## Testing and verification

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`
- Full gate: `npm run verify`

`verify` runs lint + typecheck + unit + integration + build + e2e.

## Architecture red lines (do not regress)

1. Do not reintroduce beat-graph-first core architecture.
2. Do not put planner/runtime/generator engine logic into UI components or pages.
3. Do not let generator output decide story truth or canon state.
4. Do not move runtime truth into a giant opaque blob.
5. Do not bypass data boundaries with ad hoc DB access from UI/core layers.
6. Do not treat generated prose as canonical truth.

## Documentation map

Start with [docs/README.md](docs/README.md), then:

- Architecture: [docs/architecture-overview.md](docs/architecture-overview.md), [docs/module-boundaries.md](docs/module-boundaries.md), [docs/rebuild-principles.md](docs/rebuild-principles.md)
- Local setup: [docs/local-setup.md](docs/local-setup.md)
- Demo seed: [docs/demo-book.md](docs/demo-book.md), [docs/seed-data.md](docs/seed-data.md)
- Testing/gates: [docs/testing-and-quality-gates.md](docs/testing-and-quality-gates.md)
- Contributor handoff: [docs/contributor-handoff.md](docs/contributor-handoff.md)
