# 15_generator_integration.md

## Title
Inkbranch v2 — Generator Integration

## Objective
Integrate a real AI provider behind the established generator boundary for Inkbranch v2.

This prompt exists to wire live generation into the system without breaking the boundary established in `14_generator_boundary.md`.

By the end of this prompt, the repo should have:
- a real provider-backed generator adapter
- server-side generation integration
- schema-validated generation requests and responses
- safe provider configuration via environment variables
- generator orchestration that uses the live adapter
- fallback handling for provider failures
- focused tests for live integration boundaries where practical
- documentation for how live generation is configured and used

This prompt is about wiring the real provider into the existing generator boundary.

This is not the prompt for:
- letting AI decide story logic
- planner implementation
- runtime commit implementation
- full reader-submit integration
- admin generation dashboards
- prompt experimentation tooling
- provider lock-in across the whole app

---

## Why this prompt matters
Inkbranch v2 now has:
- a planner that decides structure
- a runtime that commits truth
- a reader shell and rendering layer
- a formal generator boundary

What it does not yet have is a real provider behind that boundary.

This prompt is where live generation becomes real.

But the architecture must remain intact.

The generator integration must not:
- become the hidden planner
- become the hidden runtime
- leak provider calls into pages or UI
- weaken validation
- turn output into untrusted freeform text blobs

Instead, this prompt should ensure:
- approved structure goes in
- validated presentation comes out
- failures are handled safely
- the rest of the app still depends on the generator interface, not the provider implementation

---

## Product direction to preserve
Inkbranch v2 remains:

book bible -> planner -> scene package -> runtime state -> generator presentation -> reader experience

The generator integration must preserve:
- planner-owned structural truth
- runtime-owned committed truth
- generator-owned presentation only

The provider may help with:
- readable scene prose
- polished option labels
- bounded presentation summaries

The provider must not decide:
- what happens next
- which reveals are legal
- which endings are valid
- what canon becomes true
- what effects should be committed

Do not let provider integration blur those lines.

---

## Non-negotiable rules
1. The live provider must stay behind the generator boundary.
2. Provider API calls must remain server-side only.
3. API keys must be loaded from environment variables, never client-exposed.
4. Generation input must remain schema-approved and bounded.
5. Generation output must be schema-validated before use.
6. Invalid or failed generation must fall back safely.
7. The integration must not decide story logic.
8. The integration must not mutate runtime truth directly.
9. The Reader and Studio UI must not call provider APIs directly.
10. Keep the rest of the app provider-agnostic.

---

## Scope
You should implement:
- a real provider-backed generator adapter
- environment wiring for the provider
- server-side generation orchestration using the existing generator service
- schema-validated scene generation path
- schema-validated choice-label generation path if part of the current design
- fallback handling for provider failures and invalid outputs
- integration-safe tests and docs

You should also:
- preserve the generator boundary from `14`
- align with the current scene rendering layer
- keep the system usable when generation is unavailable
- keep integration modular and replaceable

---

## Out of scope
Do not implement:
- planner decisions inside prompts
- runtime commit side effects inside generation
- client-side provider calls
- full retry queue infrastructure
- async background batch generation systems
- provider usage analytics dashboards
- human review tooling
- admin prompt labs
- model fine-tuning workflows
- multi-provider routing logic unless it remains extremely simple

This prompt is the first live generator integration, not the final AI ops layer.

---

## Integration philosophy

### Principle 1 — integration should change the adapter, not the architecture
The rest of the app should still depend on:
- generator contracts
- generator service interface
- generator result envelopes

The thing that changes here is:
- the adapter implementation is now real

The architecture should not need to know much more than that.

### Principle 2 — server-only generation
Live provider calls must happen server-side.

That means:
- no API keys in client components
- no provider SDK imports in reader UI
- no provider calls from the browser
- no loose route/page code doing ad hoc generation

### Principle 3 — validation remains mandatory
Even with a real provider, output validation must still happen.

Do not assume the provider always returns perfect output.

If validation fails:
- return structured failure or fallback
- do not pass unvalidated output through as if it were safe

### Principle 4 — fallback is part of the happy path
The system must still work when:
- provider credentials are missing in non-live environments
- the provider request fails
- the provider times out
- output is invalid
- generation is intentionally disabled

The app must remain readable and structurally sound.

### Principle 5 — prompts remain subordinate to approved structure
The provider prompt should be built only from approved generator input.

Do not expand prompt-building into “please decide the story.”

### Principle 6 — one provider now, boundary preserved for later
It is acceptable to integrate one provider now.

But the rest of the app should still be able to switch adapters later without major rewiring.

---

## Recommended provider posture
Use the existing generator boundary and integrate one real provider through a concrete adapter implementation.

A good v1 integration posture is:
- one provider adapter
- one scene generation entry path
- one choice generation entry path if needed
- one env-based configuration path
- validation + fallback always active

Do not overbuild multi-provider complexity yet.

---

## Required implementation structure

Use or normalize a structure like:

```text
src/core/generator/
  adapters/
    base.ts
    mock.ts
    openai.ts
    index.ts
  services/
    generate-scene.ts
    fallback.ts
    index.ts
  prompts/
    scene.ts
    choices.ts
    shared.ts
    index.ts
  validators/
    output.ts
    index.ts
  contracts/
    ...
src/lib/env/
  index.ts
docs/
  generator-integration.md

You may choose slightly different file names if they are clearer, but the provider-specific implementation should clearly live in the generator adapter layer.

Recommended meaning:

openai.ts → concrete live provider adapter
base.ts → provider-agnostic adapter interface
mock.ts → test/dev fallback adapter
generate-scene.ts → orchestration that uses the adapter and validation
fallback.ts → explicit safe fallback construction

Do not scatter provider calls across the app.

Required environment handling

Use environment variables for provider configuration.

At minimum, support a server-side provider API key in env configuration.

The committed example env file should use placeholders only.

Do not commit a real API key.

Environment handling should:

fail clearly when live generation is requested but the key is missing
allow mock/noop fallback operation when appropriate
keep provider secrets server-only

Do not expose provider keys with NEXT_PUBLIC_ variables.

Required implementation tasks
Task 1 — inspect the current generator boundary and env structure

Inspect:

src/core/generator/contracts/*
src/core/generator/adapters/*
src/core/generator/services/*
src/core/generator/prompts/*
src/core/generator/validators/*
current env helper usage
current reader rendering integration points

Determine how to add the live provider without weakening the boundary.

Task 2 — add provider env support

Update the repo env structure to support the live provider cleanly.

This should include:

placeholder keys in .env.example
server-safe env access helpers if needed
clear missing-key handling

Keep env handling minimal and explicit.

Do not build a huge config engine here.

Task 3 — implement the real provider adapter

Create the concrete provider adapter implementation.

This adapter should:

accept approved generator input
call the provider server-side
request structured output in a schema-aligned way
return data through the generator result contracts
never mutate runtime truth

Keep the adapter provider-specific but isolated.

Task 4 — integrate structured output generation

Use structured generation rather than loose freeform text where the provider/tooling supports it.

The integration should:

request output matching the generator output schema
validate the returned object
propagate clean success/failure/fallback envelopes

Do not weaken the boundary into “just get some text and hope.”

Task 5 — wire the provider adapter into generator orchestration

Update the generator orchestration path so it can:

use the live adapter in configured environments
use the mock/noop adapter in non-live or test scenarios
keep the calling code provider-agnostic

A clean selection mechanism is fine, such as:

env-based adapter selection
explicit dependency injection in service construction
a small factory if that is the clearest pattern

Do not overbuild a provider registry unless it remains very small and readable.

Task 6 — keep choice generation bounded

If the current generator design includes separate or additional choice-label generation, wire that through the same boundary discipline:

approved structural input only
validated output only
fallback on failure

Do not let generated choice text change the structural choice identity or legality.

Task 7 — implement robust failure handling

Ensure the live integration handles cases such as:

provider key missing
provider request failure
provider timeout
invalid structured output
partial output

Each should produce a clean structured result and safe fallback path.

Do not crash the reader experience if the provider fails.

Task 8 — connect live generation to the current rendering flow carefully

Integrate the live generator path into the scene rendering/application flow in a bounded way.

This should be done carefully:

do not let reader route files become provider clients
do not let generator calls mutate runtime truth
do not blur runtime persistence with presentation generation

A reasonable pattern is:

reader/runtime layer requests generated presentation through generator service
generator service returns validated presentation or fallback
rendering layer consumes that result safely

Keep the boundaries intact.

Task 9 — update the generator README

Update src/core/generator/README.md so it accurately reflects:

live provider adapter now exists
generation remains presentation-only
validation remains required
fallback remains first-class
the rest of the app depends on the boundary, not the provider implementation
Task 10 — create generator integration documentation

Create:

docs/generator-integration.md

This doc should explain:

which provider is integrated
where provider config lives
how env setup works
how schema-based generation is used
how fallback works
how the live adapter relates to the generator boundary
what this prompt intentionally does not do
what future refinement might include
Task 11 — refine exports

Update relevant barrels so the live adapter and generator service remain cleanly exposed where appropriate, without leaking provider specifics too broadly.

Keep exports intentional and readable.

Task 12 — verify the live integration

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
generator integration compiles cleanly
env-based configuration works
mock/noop path still works
live adapter path behaves correctly when configured
invalid output produces structured fallback
no forbidden imports were introduced
provider code remains server-side only
Task 13 — add focused generator integration tests

Add focused tests where practical, such as:

adapter selection chooses mock/noop when live env is absent
live adapter path rejects invalid output into fallback
generator service returns structured success on valid provider output
generation does not mutate runtime truth
prompt builders remain bounded to approved structural input

Keep tests focused and purposeful.
Do not build a full provider end-to-end lab here.

Task 14 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Recommended technical posture

A strong implementation choice here is:

provider adapter implemented against the generator interface
structured object generation using the schema tools already adopted in the project
validation always on
fallback always available
server-only execution

This keeps the integration aligned with the AI SDK’s schema-driven generation model and the server-first App Router architecture.

Prompt-building guidance

Prompt builders should remain disciplined.

They should clearly instruct the provider that:

the structural scene is already decided
reveals included are already approved
choices included are already approved
no new canon or continuity may be invented
the output must match the structured schema

Do not loosen this into creative “take over the scene” prompting.

Failure-handling guidance

Good failure handling:

structured failure result
explicit reason code
safe fallback result available
reader experience remains usable

Bad failure handling:

raw provider exception leaks into UI
invalid output passed through anyway
missing env crashes all generation paths
provider-specific junk leaks into the reader experience
Guardrails against bad generator integration
Do not do this

Bad patterns include:

provider SDK imports in UI components
provider calls directly from route pages
runtime tables being mutated by generator code
planner decisions being outsourced to the model
unvalidated text blobs becoming the scene body
provider-specific assumptions leaking through the whole app
API keys exposed to the client
Do this instead

Good patterns include:

concrete adapter behind the generator interface
server-side env handling
structured output generation
output validation and fallback
provider-agnostic calling surfaces
presentation-only integration
mock/noop support retained
Acceptance criteria

This prompt is complete only if all of the following are true:

A real provider-backed generator adapter exists.
Provider configuration is loaded through server-side environment handling.
The adapter remains behind the established generator boundary.
Structured generation is used for the integrated path.
Output validation is enforced.
Fallback behavior exists for missing env, provider failure, timeout, and invalid output.
The rest of the app remains provider-agnostic.
Provider code is not imported into UI components or client code.
The generator still does not decide story logic.
The generator still does not mutate runtime truth directly.
docs/generator-integration.md exists and explains the live integration clearly.
Lint and typecheck pass.
Focused generator integration tests exist and pass.
The repo is ready for 16_admin_inspector.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
generator integration compiles cleanly
mock/noop adapter path works
live adapter path works when configured
invalid output falls back safely
no forbidden imports were introduced
provider code remains server-side
generator boundary remains intact

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a fragile or boundary-breaking live integration behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 15_generator_integration.md

To:

 15_generator_integration.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 15_generator_integration.md
Status: completed
Summary:
integrated a live provider behind the established generator boundary
added server-side env wiring, structured generation, validation, and fallback handling
kept the rest of Inkbranch provider-agnostic and preserved presentation-only generation responsibilities
documented the live integration and added focused integration tests
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally deferred provider tuning
note any live-env assumptions
note that admin inspection remains for 16

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if a real provider is integrated behind the generator boundary without weakening validation, fallback, or architectural separation.

It fails if provider code leaks across the app, AI starts deciding story logic, or unvalidated output becomes trusted presentation.


Next is `16_admin_inspector.md`, which is where we finally build the observability surface for chronicles, scenes, events, knowledge, canon commits, and generation results.
::contentReference[oaicite:2]{index=2}