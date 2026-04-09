# Tooling and Guards

## Purpose

This repository uses project tooling to enforce architecture boundaries during the Inkbranch v2 rebuild.

## Installed tooling

- ESLint (flat config) for code quality and import boundary rules.
- Prettier for consistent formatting.
- TypeScript type checking.
- Vitest as the initial unit-test scaffold.

## Scripts

- `npm run lint`: Runs ESLint directly.
- `npm run lint:fix`: Runs ESLint with auto-fix.
- `npm run typecheck`: Runs TypeScript in no-emit mode.
- `npm run format`: Writes formatting changes with Prettier.
- `npm run format:check`: Checks formatting without writing.
- `npm run test`: Starts Vitest in watch mode.
- `npm run test:run`: Runs Vitest once.
- `npm run verify`: Runs lint + typecheck + test:run + build.

## Why import restrictions exist

Layer boundaries are enforced so architecture drift is caught automatically:

- `src/ui` cannot import data internals or planner/runtime/generator service internals.
- `src/core` cannot import from app/ui/data.
- `src/data` cannot import from app/ui.
- `src/app/**/page.tsx` and `src/app/**/layout.tsx` cannot import planner/runtime/generator services directly.
- `src/lib` cannot become a junk-drawer dependency sink for core/data/app/ui concerns.

## Violations intentionally blocked

- UI components querying persistence modules directly.
- Core contracts/services importing framework or React layer code.
- App route components becoming direct homes for planner/runtime/generator service logic.
- Lib utilities reaching into business and persistence layers.

## Working within these guards

Future prompts should keep orchestration thin in `app`, put story logic in `core`, persistence wiring in `data`, and presentation in `ui`.
If a new prompt needs a boundary exception, document the reason explicitly before changing the guardrails.
