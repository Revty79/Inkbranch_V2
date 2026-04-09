# Contributor Handoff

## What this repo is

Inkbranch v2 is a planner-first interactive fiction system with:

- relational authored truth
- deterministic planning
- runtime commit pipeline with inspectable event/state history
- constrained generator rendering
- explicit continuity guards

## How to approach new work safely

1. Start from architecture docs and module boundaries.
2. Confirm which layer owns the change before coding.
3. Add/adjust tests at the correct layer (`unit`, `integration`, `e2e`).
4. Run `npm run verify` before handing off.

## Placement guide

- `src/core/domain`: shared contracts and vocabulary
- `src/core/planner`: structural scene/choice planning
- `src/core/runtime`: commit orchestration + projections
- `src/core/generator`: presentational rendering boundaries
- `src/core/validators`: continuity/legality guard checks
- `src/data`: schema + query/mutation/mapping boundaries
- `src/ui`: presentational components only
- `src/app`: route composition and orchestration only

## Red lines (hard constraints)

1. Do not reintroduce beat graphs as core progression architecture.
2. Do not move engine logic into UI components/pages.
3. Do not let generator output mutate canonical/runtime truth.
4. Do not replace relational runtime truth with an opaque mega-blob.
5. Do not bypass data-layer boundaries from UI/core modules.
6. Do not treat generated prose as truth authority.

## Workflow expectations

- Use demo seed for practical local validation: `npm run seed:demo`.
- Validate route-level behavior with E2E checks (`npm run test:e2e`).
- Keep docs accurate when scripts, routes, or layer ownership changes.
- Prefer small, composable files and explicit typed contracts.

## When extending each area

- Planner: extend deterministic structural logic; keep truth decisions out of generator.
- Runtime: extend commit/projection/event semantics; preserve guard checks.
- Generator: extend rendering quality/safety while staying presentation-only.
- Validation: add explicit, inspectable guard rules with stable issue codes.
- Studio/Reader/Admin: improve workflows without absorbing core engine behavior.

## Prompt/STATUS continuation

This rebuild used a sequential prompt workflow tracked in `prompts/STATUS.md`.

If continuing with the same process:

1. Read `prompts/STATUS.md`.
2. Pick first unchecked queue item.
3. Execute prompt fully.
4. Run required verification.
5. Update queue + run log.
