# 19_tests_and_quality_gates.md

## Title
Inkbranch v2 — Tests and Quality Gates

## Objective
Implement the testing strategy and quality gates for Inkbranch v2.

This prompt exists to prove that the rebuilt architecture actually holds together under repeatable verification.

By the end of this prompt, the repo should have:
- meaningful unit tests
- meaningful integration tests
- targeted end-to-end tests
- quality-gate scripts that fail on broken architecture or regressions
- a clear test organization strategy
- reliable verification commands for local development
- documentation explaining what is tested and how
- a repo state ready for final docs and handoff

This prompt is about hardening confidence in the rebuild.

This is not the prompt for:
- new product features
- new planner features
- new runtime features
- new generator features
- CI platform setup beyond repo-ready gates
- broad load testing or performance benchmarking
- analytics tooling

---

## Why this prompt matters
Inkbranch v2 is now a real system.

It includes:
- authoring truth
- relational runtime state
- planner logic
- runtime commit logic
- reader rendering
- generator boundaries and live integration
- admin inspection
- continuity guards
- demo seed content

Without real tests and quality gates, the rebuild is still fragile.

This prompt is where we stop relying on:
- “it seems to work”
- “the page loaded once”
- “Codex marked it done”
- “the demo content looked okay”

Instead, we create a test and verification system that can answer:
- does the planner still behave coherently
- do runtime commits still preserve truth correctly
- do continuity guards actually block bad states
- does the reader shell still render meaningful content
- does the generator boundary still remain safe
- does the demo seed still work
- do key end-to-end flows still function

This is the confidence layer.

---

## Product direction to preserve
Inkbranch v2 is planner-first, runtime-inspectable, and AI-on-rails.

The test strategy should reflect that architecture.

That means tests should be organized around:
- domain contracts
- planner behavior
- runtime behavior
- validation behavior
- rendering behavior
- generation boundary safety
- demo-content viability
- high-value user/system flows

Do not organize testing around:
- beat graphs
- next-node traversal maps
- giant UI snapshot dumps
- random unstructured smoke tests only

The tests should prove the architecture, not just the pages.

---

## Non-negotiable rules
1. Do not add fake tests that only assert imports exist.
2. Do not rely on end-to-end tests alone.
3. Do not rely on snapshot testing as the main confidence mechanism.
4. Do not skip planner/runtime/validation coverage.
5. Do not let tests bypass the architecture in unrealistic ways.
6. Do not weaken quality gates just to make the pipeline pass.
7. Keep tests readable and purpose-driven.
8. Keep unit, integration, and end-to-end concerns distinct.
9. Ensure the main verify workflow is clear and repeatable.
10. Use the existing stack cleanly rather than inventing a custom test universe.

---

## Scope
You should implement:
- unit tests for core logic areas
- integration tests for critical cross-layer flows
- targeted Playwright end-to-end tests for high-value routes/flows
- a clean test directory strategy
- stable test scripts
- a strong `verify` path
- test documentation
- any minimal test fixtures/helpers needed

You should also:
- align with the current Vitest and Playwright setup
- preserve architecture boundaries in tests
- keep the tests fast enough to be useful locally
- keep the gates strict enough to matter

---

## Out of scope
Do not implement:
- large-scale performance/load testing
- visual regression infrastructure unless already trivial and compatible
- browser matrix explosion
- distributed CI orchestration
- flaky screenshot-heavy testing strategy
- broad contract testing for future provider variants
- giant snapshot suites
- mutation testing frameworks
- enterprise-scale testing platforms

This prompt is about solid, maintainable rebuild confidence.

---

## Testing philosophy

### Principle 1 — test the architecture, not just the UI
Inkbranch v2 is a layered system.

That means the test strategy should prove:
- the planner stays structural
- runtime truth stays relational and inspectable
- generators stay presentation-only
- validation guards actually block bad states
- the reader can consume committed truth
- the admin can inspect committed truth

### Principle 2 — fast tests should cover the logic core
Use fast tests for:
- planner modules
- runtime commit modules
- validation modules
- data-layer shaping/mapping
- generator boundary behavior

These should be the day-to-day confidence backbone.

### Principle 3 — integration tests should prove cross-layer contracts
Integration tests should prove important handoffs such as:
- planner output to runtime instantiation
- runtime resolution to state/projection updates
- generator output validation to fallback handling
- seed/bootstrap to usable chronicle context

### Principle 4 — end-to-end tests should stay targeted
Use Playwright for a focused set of high-value flows, not an everything-suite. Next.js documents Playwright as the E2E path for app testing, while Vitest is the current unit/integration-friendly path. :contentReference[oaicite:1]{index=1}

### Principle 5 — quality gates should fail loudly
A broken lint/typecheck/test/e2e path should block the “done” state.

Do not let broken verification become normal.

### Principle 6 — the demo content must be part of confidence
The seeded demo content is now part of the product proof.

Tests and quality gates should verify that the seed still produces a usable system state.

---

## Required testing layers

### 1. Unit tests
Use Vitest for focused unit tests of:
- planner selection/evaluation logic
- runtime service logic
- validation logic
- generator boundary logic
- mapping/render preparation logic

Vitest is appropriate here because it is fast and suited for this kind of TypeScript logic testing. :contentReference[oaicite:2]{index=2}

### 2. Integration tests
Use Vitest for integration-style tests of:
- planner + context loader
- runtime instantiation + projection refresh
- choice resolution + knowledge/canon/event updates
- generator service + validation + fallback
- seed/bootstrap coherence

These tests should touch multiple internal layers, but still stay repo-local and deterministic.

### 3. End-to-end tests
Use Playwright for targeted end-to-end tests of:
- Studio loads and key authoring surfaces render
- Reader can load a demo chronicle and current scene
- Admin can inspect a demo chronicle
- a core happy-path reader flow works if the current product state supports it
- generation fallback/live display path behaves coherently where practical

Playwright is the current official E2E testing route documented for Next.js apps. :contentReference[oaicite:3]{index=3}

---

## Required implementation structure

Use or normalize a structure like:

```text
tests/
  unit/
    planner/
    runtime/
    validators/
    generator/
    mappers/
  integration/
    planner-runtime/
    runtime-state/
    generator/
    seed/
  e2e/
    studio.spec.ts
    reader.spec.ts
    admin.spec.ts
    demo-flow.spec.ts
  fixtures/
    demo/
    runtime/
  helpers/
    test-env.ts
    seed.ts
    chronicle.ts


You may choose slightly different names if they are cleaner, but the separation should remain obvious:

unit
integration
e2e
fixtures/helpers

Do not throw everything into one flat tests folder without structure.

Required quality-gate scripts

Inspect and normalize package.json scripts so the repo has a clear verification path.

At minimum, ensure scripts exist or are normalized for:

lint
typecheck
test
test:run
test:unit
test:integration
test:e2e
verify

Recommended intent:

test → local friendly test mode if appropriate
test:run → single-run Vitest path
test:unit → unit tests only
test:integration → integration tests only
test:e2e → Playwright tests
verify → lint + typecheck + test:run + test:e2e or a practical equivalent

Keep scripts readable.
Do not create script clutter.

Required test coverage domains

You should ensure meaningful coverage for at least these areas.

1. Domain and contract safety

Test that key domain/generator/planner/runtime contracts behave as intended where logic exists around them.

Avoid trivial import-only tests.
Focus on meaningful structure and guard behavior.

2. Planner behavior

At minimum, test:

milestone targeting priority
fallback behavior when no milestone is eligible
reveal eligibility behavior
pacing-influenced scene selection
ending readiness blocking/allowing behavior
distinct decision package construction
3. Runtime behavior

At minimum, test:

scene instantiation creates the expected runtime records
choice resolution validates ownership/state
event log entries are appended
knowledge updates occur correctly
canon commits occur correctly
chronicle state refresh occurs correctly
perspective run projection updates occur correctly
4. Validation and continuity guards

At minimum, test:

illegal reveals are blocked
contradictory planner reveal state fails
invalid choice resolution is rejected
contradictory canon commit is rejected
invalid ending transition is rejected
projection mismatch is detected
invalid generator output degrades safely
5. Generator boundary/integration safety

At minimum, test:

structured output validation works
fallback activates when output is invalid
mock/noop adapter still works
live adapter path is bounded and validated
generator cannot mutate runtime truth directly
6. Reader rendering

At minimum, test:

prose path renders when prose exists
fallback path renders when prose is absent
empty scene state renders cleanly
choice rendering handles enabled/disabled states correctly
7. Demo seed viability

At minimum, test:

demo seed creates world/book/version relationships
demo content includes required planning artifacts
demo runtime bootstrap or demo chronicle path works
planner can operate on demo context
reader/admin can load demo content at a practical level
8. End-to-end critical routes

At minimum, E2E test:

Studio loads
Reader demo chronicle flow loads
Admin chronicle inspection loads

If the current runtime commit and reader flow are advanced enough, include one small end-to-end decision flow as well.

Do not force an unrealistic E2E if the app state does not yet support it cleanly, but do test the highest-value path that does exist.

Required implementation tasks
Task 1 — inspect current test/tooling state

Inspect:

existing Vitest config
existing Playwright config
package scripts
existing tests if any
current seed/bootstrap flow
current verification scripts

Determine the cleanest way to normalize the test strategy around the current architecture.

Task 2 — normalize test structure

Create or normalize the tests/ structure so unit, integration, and e2e concerns are clearly separated.

Keep helper/fixture placement sensible and maintainable.

Task 3 — add meaningful unit tests

Add focused unit tests for:

planner logic
runtime services
validation services
generator boundary behavior
rendering/preparation logic where relevant

These should be readable and architecture-focused.

Task 4 — add meaningful integration tests

Add integration tests for:

planner to runtime handoff
runtime updates to projection/history state
generator validation/fallback flow
seed/bootstrap coherence

Do not overbuild a giant integration suite, but do make the core seams real.

Task 5 — add targeted Playwright tests

Add Playwright tests for the highest-value user/system surfaces.

At minimum include:

Studio route loads
Reader route loads demo chronicle scene
Admin route loads chronicle inspection

If a small end-to-end choice/commit path is practical and stable, include it.

Keep Playwright focused and maintainable.

Task 6 — tighten quality-gate scripts

Update package.json scripts so local verification is obvious and repeatable.

Make sure the gates actually run what matters.

Do not leave verify too weak to be meaningful.

Task 7 — refine test config if needed

If needed, refine:

vitest.config.*
playwright.config.*
test setup files
env handling for tests
fixture/bootstrap helpers

Keep config practical.
Do not explode complexity.

Task 8 — ensure test env and seed flow are practical

Make sure tests can run against a practical environment.

If the test strategy relies on seeded demo data or a test bootstrap, make that explicit and documented.

Keep the test environment stable and repeatable.

Task 9 — document testing and quality gates

Create:

docs/testing-and-quality-gates.md

This doc should explain:

what test layers exist
what each layer is responsible for
which commands to run
what verify does
how demo seed/bootstrap fits into testing
how contributors should add future tests
what this prompt intentionally does not include
Task 10 — verify the whole gate

Run the full intended verification path and ensure:

lint passes
typecheck passes
unit tests pass
integration tests pass
e2e tests pass or the justified practical e2e subset passes
demo seed/bootstrap remains usable
no forbidden imports or architecture regressions were introduced
Task 11 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Tooling posture guidance

Next.js currently documents Vitest for unit-style testing and Playwright for E2E testing in App Router apps, so keep this prompt aligned with that split rather than inventing a novel stack.

That means:

Vitest for fast local logic and integration tests
Playwright for browser-level flow verification

Keep that split clear.

Design guidance
Good quality-gate design

Good:

meaningful logic coverage
targeted integration seams
focused e2e routes/flows
one clear verify path
test helpers/fixtures kept sane
demo content included in confidence story
Bad quality-gate design

Bad:

lots of trivial tests
giant brittle e2e suite
snapshot spam
verify script that skips important layers
tests that bypass the architecture unrealistically
flaky demo dependence with no stable setup
Safe simplification guidance

This is the quality-gate prompt, not infinite testing perfection.

Acceptable simplifications:

focus e2e on highest-value routes
keep integration tests tighter than full-system simulations
keep fixtures compact
use seed/bootstrap helpers instead of giant bespoke setups

Unacceptable shortcuts:

only smoke tests
no planner/runtime validation tests
no generator safety tests
no demo viability testing
verify script that only runs lint/typecheck
Guardrails against bad testing design
Do not do this

Bad patterns include:

writing only import/snapshot tests
putting all confidence on Playwright
skipping validation and runtime tests because “UI works”
adding brittle tests that know too much about internals but prove too little
tests that depend on hidden manual setup
quality gates so slow or flaky they are ignored
Do this instead

Good patterns include:

fast logic tests where the architecture lives
targeted integration tests for seam correctness
focused browser tests for core routes/flows
repeatable seed/bootstrap-aware test setup
one strong verify path that contributors can trust
Acceptance criteria

This prompt is complete only if all of the following are true:

Meaningful unit tests exist for planner/runtime/validation/generator/rendering logic.
Meaningful integration tests exist for key architecture seams.
Targeted Playwright end-to-end tests exist for key app surfaces.
Test structure is organized and maintainable.
package.json quality-gate scripts are clear and usable.
verify runs a meaningful verification path.
Demo seed/bootstrap viability is covered by tests or verified setup.
No architecture boundaries were weakened to make tests easier.
docs/testing-and-quality-gates.md exists and explains the strategy clearly.
Lint and typecheck pass.
Unit, integration, and e2e tests pass.
The repo is ready for 20_docs_and_handoff.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
unit tests pass
integration tests pass
e2e tests pass or justified target subset passes
verify passes
demo seed/bootstrap remains usable
no forbidden imports were introduced
no architecture regressions slipped in

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a fake confidence layer behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 19_tests_and_quality_gates.md

To:

 19_tests_and_quality_gates.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 19_tests_and_quality_gates.md
Status: completed
Summary:
implemented meaningful unit, integration, and e2e coverage for Inkbranch v2
added clear quality-gate scripts and a strong verify path
validated core planner/runtime/validation/generator/rendering/demo flows
documented the testing strategy and quality gates
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally scoped e2e coverage
note any test-environment assumptions
note that final docs/handoff remain for 20

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if Inkbranch gains a real confidence layer: meaningful tests, meaningful gates, and a verify workflow the team can actually trust.

It fails if testing stays superficial, e2e-heavy but logic-light, or too weak to protect the rebuild.


Next is `20_docs_and_handoff.md`, the final wrap-up prompt that turns the rebuild from “working repo” into “maintainable project someone can continue without guesswork.”
::contentReference[oaicite:5]{index=5}