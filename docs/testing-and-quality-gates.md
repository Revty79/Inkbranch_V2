# Testing and Quality Gates

## Goal

Inkbranch v2 testing is organized to prove architecture behavior, not only route rendering.

Coverage is split into:

- `tests/unit`: fast logic-level checks (planner, validators, generator boundary, reader mapping/render prep, seed package structure)
- `tests/integration`: cross-module seam checks (planner -> runtime handoff, runtime commit pipeline updates, generator integration, reader/admin data-backed component behavior, seed bootstrap coherence)
- `tests/e2e`: focused browser route/flow checks with Playwright (Studio, Reader demo chronicle, Admin chronicle inspection, basic reader navigation flow)

## Commands

- `npm run test`: Vitest watch mode
- `npm run test:run`: run all unit + integration tests once
- `npm run test:unit`: run unit tests only
- `npm run test:integration`: run integration tests only
- `npm run test:e2e`: seed demo data, then run Playwright E2E tests
- `npm run verify`: lint + typecheck + unit + integration + build + e2e

## Demo seed in testing

E2E coverage depends on the seeded demo chronicle path.

`test:e2e` runs `seed:demo` first so Reader/Admin routes have deterministic runtime state.

Default local DB assumption (if `DATABASE_URL` is not set in environment):

- `postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev`

## Playwright posture

Playwright is intentionally targeted:

- `tests/e2e/studio.spec.ts`
- `tests/e2e/reader.spec.ts`
- `tests/e2e/admin.spec.ts`
- `tests/e2e/demo-flow.spec.ts`

This is not a giant brittle UI suite; it validates high-value route viability and one practical user flow.

## Adding future tests

When adding tests:

1. Prefer unit tests for pure logic.
2. Add integration tests for cross-layer seams.
3. Use E2E only for route-level/product-level confidence.
4. Keep fixtures/helpers deterministic and inspectable.
5. Avoid snapshot-heavy or import-only tests.

## Out of scope in this prompt

- load/performance benchmarking
- visual regression infrastructure
- CI platform orchestration
- exhaustive browser matrix expansion

## Related docs

- [Local Setup](local-setup.md)
- [Seed Data](seed-data.md)
- [Contributor Handoff](contributor-handoff.md)
