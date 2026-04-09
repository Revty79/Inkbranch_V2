# 14_generator_boundary.md

## Title
Inkbranch v2 — Generator Boundary

## Objective
Implement the formal generator boundary for Inkbranch v2.

This prompt exists to create the safe architectural boundary where AI is allowed to participate in the system.

By the end of this prompt, the repo should have:
- explicit generator service contracts
- explicit generator input schemas
- explicit generator output schemas
- structured validation for generator results
- a provider-agnostic generator boundary
- prompt-building structure for scene rendering requests
- fallback behavior when generation is unavailable or invalid
- generator-safe orchestration patterns
- documentation explaining exactly what the generator may and may not do

This prompt is about the boundary and contracts for generation.

This is not the prompt for:
- fully integrating a specific model/provider into live scene rendering
- letting AI decide story logic
- planner implementation
- runtime commit implementation
- final prose generation UX
- admin tooling for generation inspection

---

## Why this prompt matters
Inkbranch v2 needs AI, but only in the right place.

If AI is introduced without a hard boundary, the system will drift into the exact failure mode we do not want:
- AI deciding what story truth is
- AI deciding what reveals are legal
- AI deciding what the next scene should be
- AI deciding what choices are valid
- AI becoming a hidden logic engine
- continuity becoming dependent on prose instead of committed runtime truth

That cannot happen.

The generator boundary exists so AI can do what it is good at:
- turning approved structure into readable scene prose
- turning approved structural options into polished option text
- producing presentation from already-approved truth

The generator boundary exists so AI cannot do what it must not do:
- decide validity
- decide continuity truth
- decide runtime effects
- decide canon
- decide the next structural package

This prompt is where we lock that line in.

---

## Product direction to preserve
Inkbranch v2 is planner-led and runtime-committed.

The real product loop remains:

book bible -> planner -> scene package -> reader decision -> runtime state update -> next scene package

The generator participates only after structure is already valid.

That means the generator is downstream of:
- authoring truth
- planner validity
- runtime continuity

The generator is upstream of:
- reader-facing prose presentation
- polished option wording

The generator is not:
- the planner
- the runtime
- the canon authority
- the reveal arbiter
- the ending arbiter

Do not drift toward generator-led story architecture.

---

## Non-negotiable rules
1. The generator must not decide story logic.
2. The generator must not decide valid next scenes.
3. The generator must not decide valid choices.
4. The generator must not decide reveals, canon, or endings.
5. The generator must only consume approved, validated structure.
6. The generator must return schema-validated output.
7. Invalid generator output must not become runtime truth.
8. Fallback rendering must exist when generator output is missing or invalid.
9. Keep the generator provider-agnostic at the boundary.
10. Keep generation separate from planner, runtime commit, and UI ownership.

---

## Scope
You should implement:
- generator contracts if refinement is needed
- structured generator input schemas
- structured generator output schemas
- prompt-builder modules for generation requests
- generator result validation
- generator fallback result handling
- generator service interfaces
- provider-agnostic adapter contracts
- generator-safe orchestration boundaries
- documentation for generator responsibilities and limits

You should also:
- align the boundary with the planner output and runtime scene package model
- align generator contracts with the scene rendering layer
- preserve architecture boundaries
- keep all generation schema-first and inspectable

---

## Out of scope
Do not implement:
- final live model/provider wiring into reader routes
- planner decisions in the generator
- runtime commit logic in the generator
- admin UI for generation inspection
- advanced retry orchestration systems
- offline batch generation workflows
- prompt experimentation dashboards
- editorial review tooling
- image/audio generation
- custom fine-tuning workflows

This prompt is the generation boundary, not the full generation product.

---

## Generator philosophy

### Principle 1 — generation is presentation, not truth
The generator may transform:
- approved scene structure
- approved perspective framing
- approved reveal usage
- approved choice structure

into:
- readable prose
- readable option labels
- readable scene summaries
- presentation-safe rendered text blocks

The generator may not transform the structural truth itself.

### Principle 2 — generator input must be approved first
The generator must only receive input that is already:
- structurally valid
- planner-approved
- runtime-safe
- continuity-safe for presentation

The generator must not be handed raw “figure out the story” prompts.

### Principle 3 — output must be validated
The generator must return structured output that can be validated.

Do not accept loose text blobs as the only contract surface.

The generator can still return prose, but it must do so inside a structured, validated response envelope.

### Principle 4 — provider choice must not leak into app architecture
The rest of Inkbranch should not need to care whether the generator is backed by:
- OpenAI
- another provider
- a mock implementation
- a local test stub

That means the app should depend on generator interfaces and schemas, not provider-specific calls.

### Principle 5 — fallback must be first-class
The app must remain usable when generation:
- is unavailable
- fails validation
- times out
- is disabled
- returns incomplete content

Fallback behavior must be deliberate and honest.

### Principle 6 — prompts are implementation details, not product truth
Prompt templates matter, but prompts do not become system truth.

The truth still lives in:
- authoring records
- planner outputs
- runtime commits

Prompts are instructions for rendering, not sources of canon.

---

## Required generator domains
You should define and/or refine contracts and implementation boundaries for the following areas.

### 1. Generator scene input
This is the approved structural input for generating a scene.

It should include things like:
- scene kind
- scene goal
- perspective info
- continuity facts allowed for presentation
- approved reveal usage
- scene constraints
- approved choice structures
- tone/style guidance that comes from authored truth and approved rendering context

It must not include:
- “decide what happens next”
- “invent a reveal if needed”
- “choose the best ending”
- open-ended story control authority

### 2. Generator scene output
This is the structured result of generation.

It should include:
- scene prose
- optional scene summary or recap if useful
- polished choice labels or choice display text
- optional presentation notes if they are bounded and useful

It must not include:
- authoritative continuity changes
- authoritative canon updates
- authoritative runtime effects
- hidden story decisions outside the approved structural package

### 3. Generator validation
The system must validate:
- shape of generated output
- presence of required fields
- optional content constraints if useful
- fallback eligibility when validation fails

This should make generation safe to consume.

### 4. Generator adapter interface
The generator boundary should define a provider-agnostic adapter interface.

The rest of the system should be able to depend on something like:
- `Generator`
- `SceneGenerator`
- `GenerateSceneInput`
- `GenerateSceneResult`

without caring about the provider implementation behind it.

### 5. Prompt building
Prompt-building belongs inside the generator layer, not elsewhere.

Prompt builders should transform approved structural input into provider-ready instructions.

They should not:
- decide story truth
- decide legality
- query the DB directly
- become giant logic engines

### 6. Fallback handling
When generation fails or is unavailable, the generator layer should return a bounded fallback result that the rendering layer can use safely.

This fallback should not pretend to be successful generated prose.

---

## Required implementation structure

Use or normalize a structure like:

```text
src/core/generator/
  README.md
  contracts/
    input.ts
    output.ts
    result.ts
    service.ts
    issues.ts
    index.ts
  adapters/
    base.ts
    mock.ts
    index.ts
  prompts/
    scene.ts
    choices.ts
    shared.ts
    index.ts
  validators/
    output.ts
    index.ts
  services/
    generate-scene.ts
    fallback.ts
    index.ts

You may choose slightly different names if they are clearer, but the responsibilities should remain distinct.

Recommended meaning:

contracts/input.ts → approved generator input shapes
contracts/output.ts → structured output shapes
contracts/result.ts → success/failure/fallback envelopes
contracts/service.ts → generator service interface
contracts/issues.ts → generator issue and failure contracts
adapters/base.ts → provider-agnostic adapter contract
adapters/mock.ts → non-provider mock/test implementation
prompts/scene.ts → scene prose prompt builder
prompts/choices.ts → choice label prompt builder
validators/output.ts → schema validation helpers
services/generate-scene.ts → orchestration boundary for generation requests
services/fallback.ts → safe fallback construction

Do not implement this as one giant file.

Required contract areas
1. Generator input contracts

Create or refine contracts such as:

GeneratorSceneInput
GeneratorPerspectiveInput
GeneratorChoiceInput
GeneratorRevealInput
GeneratorToneInput
GeneratorContinuityInput

These should describe only the safe, approved input that generation needs.

2. Generator output contracts

Create or refine contracts such as:

GeneratedSceneOutput
GeneratedChoiceOutput
GeneratedScenePresentation
GeneratedChoicePresentation
GeneratedSceneEnvelope

These should represent presentation output only.

3. Generator result contracts

Create or refine contracts such as:

GeneratorResult
GeneratorSuccessResult
GeneratorFailureResult
GeneratorFallbackResult
GeneratorDiagnostics

These should make success, failure, and fallback explicit.

4. Generator service contracts

Create or refine contracts such as:

SceneGenerator
GeneratorService
GenerateSceneRequest
GenerateSceneResponse

These define the boundary that the rest of the app will call later.

5. Generator issue contracts

Create or refine contracts such as:

GeneratorIssue
GeneratorIssueCode
GeneratorIssueSeverity
GeneratorFailureReason
GeneratorFallbackReason

These should support later observability and debugging.

Required implementation tasks
Task 1 — inspect current generator contracts, scene rendering layer, and planner/runtime outputs

Inspect:

src/core/generator/contracts/*
src/core/planner/*
src/core/runtime/*
src/ui/reader/*
current scene presentation shape
current contract and validation patterns

Determine how to formalize the generator boundary without leaking structural logic into generation.

Task 2 — refine or create generator input schemas

Create the approved generator input schemas.

These should be the exact safe inputs generation is allowed to consume.

They should be explicit and bounded.

Do not pass raw planner or runtime payload blobs through unchanged if a smaller safe input shape is better.

Task 3 — refine or create generator output schemas

Create structured output schemas for generated results.

These should support:

prose
choice presentation
optional bounded presentation metadata

They should remain presentation-focused.

Task 4 — create generator result and issue envelopes

Create clear success/failure/fallback result contracts.

These should allow higher layers to know:

generation succeeded
generation failed
generation fell back to non-AI rendering
output failed validation
provider is unavailable
generation was intentionally skipped
Task 5 — define provider-agnostic adapter interface

Create the base generator adapter contract.

This should define the minimal provider-facing interface the rest of the system can depend on.

Also create a mock or noop implementation suitable for testing and non-provider development flow.

Do not wire the real provider into live reader flow yet.

Task 6 — implement prompt builders

Implement prompt-builder modules for generation requests.

At minimum, support building prompts for:

scene prose
choice wording

Prompt builders should consume only approved generator input shapes.

They should clearly instruct the model that:

structure is already decided
canon/reveal legality is already decided
runtime effects are not to be invented
output must stay within the provided schema

Do not let prompt builders become hidden planners.

Task 7 — implement output validation

Implement validation helpers for generator output.

These should:

validate schema shape
produce meaningful issues when invalid
support fallback selection cleanly

If the repo already uses schema tools consistently, stay aligned with that pattern.

Task 8 — implement generator orchestration boundary

Implement the generator service boundary that:

accepts approved generator input
uses an adapter interface
validates results
returns structured success/failure/fallback envelopes
never mutates runtime truth directly

This orchestration should remain bounded and readable.

Do not integrate it into reader routes yet if that would blur responsibilities.

Task 9 — implement fallback behavior

Implement explicit fallback construction for cases such as:

provider unavailable
invalid output
timeout or generation failure
generation disabled

Fallback output should remain presentation-safe and honest.

It may reuse the existing structural fallback rendering shape if that is the cleanest design.

Task 10 — update generator README

Update src/core/generator/README.md so it clearly states:

what the generator owns
what the generator must not own
that generator output is presentation, not truth
how the boundary relates to planner, runtime, and reader rendering
Task 11 — create generator boundary documentation

Create:

docs/generator-boundary.md

This doc should explain:

what the generator is allowed to do
what the generator is not allowed to do
what generator input looks like
what generator output looks like
why structured validation exists
how fallback works
why the generator is not the story logic engine
what later prompt 15_generator_integration.md will build on top of this boundary
Task 12 — refine exports

Update relevant barrels such as:

src/core/generator/contracts/index.ts
src/core/generator/adapters/index.ts
src/core/generator/prompts/index.ts
src/core/generator/services/index.ts

Keep exports intentional and readable.

Task 13 — verify the generator boundary

Run the appropriate verification commands and ensure:

lint passes
typecheck passes
generator contracts compile
output validation works
mock/noop generation path works
no forbidden imports were introduced
generator boundary remains separate from planner and runtime mutation logic
Task 14 — add focused generator-boundary tests

Add focused tests such as:

valid generator output passes schema validation
invalid generator output returns structured failure/fallback
mock adapter returns a valid structured result
prompt builders only consume approved structural inputs
generator service does not mutate runtime or planner state

Keep tests focused and purposeful.
Do not build full provider-integration tests yet.

Task 15 — update STATUS

Update /prompts/STATUS.md only after the prompt is truly complete.

Prompt-building guidance

Prompt builders should be explicit about the generator’s role.

They should clearly communicate:

the scene structure is already decided
the perspective is already decided
reveals included are already approved
choices included are already approved
no new canon or continuity may be invented
output must stay within schema

Do not write prompts that invite the model to “take control of the story.”

Validation guidance

Validation should focus on:

required field presence
schema correctness
safe output availability
bounded presentation metadata
clean fallback when validation fails

Do not overbuild linguistic quality scoring here.
That is not the purpose of this prompt.

Fallback guidance

Fallback must be treated as a normal supported path.

Good fallback behavior:

explicit fallback result envelope
clear reason code
safe presentation content available
no claim that AI prose was successfully generated

Bad fallback behavior:

swallow the error and return junk
pretend prose was generated when it was not
allow invalid output through because “it looks close enough”
let failure crash the reader experience
Guardrails against bad generator design
Do not do this

Bad patterns include:

generator deciding what scene comes next
generator deciding what choices are valid
generator inventing new reveals or canon
generator mutating runtime state
prompt builders reading directly from the DB
raw provider calls scattered through the app
loose text-only outputs with no validation
fallback hidden inside random UI code
Do this instead

Good patterns include:

approved structural input only
structured output schemas
provider-agnostic adapter contract
prompt builders inside generator layer
explicit validation
explicit fallback result
clear separation from planner, runtime, and UI ownership
Acceptance criteria

This prompt is complete only if all of the following are true:

The generator boundary is explicitly defined and implemented.
Approved generator input schemas exist.
Structured generator output schemas exist.
Generator success/failure/fallback result envelopes exist.
A provider-agnostic adapter interface exists.
A mock or noop adapter exists for non-provider development/test flow.
Prompt builders exist for scene and choice generation.
Output validation exists and is enforced.
Explicit fallback handling exists.
The generator does not own planner logic.
The generator does not own runtime commit logic.
No beat-graph-first logic or naming was introduced.
docs/generator-boundary.md exists and explains the boundary clearly.
Lint and typecheck pass.
Focused generator-boundary tests exist and pass.
The repo is ready for 15_generator_integration.md.

If any of these are false, do not mark the prompt complete.

Verification requirements

Before marking complete, verify all of the following with actual commands where possible:

lint passes
typecheck passes
generator contracts compile cleanly
validation helpers behave correctly
mock/noop adapter path works
prompt builders consume only approved structural inputs
no forbidden imports were introduced
generator boundary remains separate from planner, runtime, and UI ownership

If verification fails:

fix the issue
rerun verification
only then mark complete

Do not leave a vague or unsafe generator boundary behind.

STATUS update instructions

After completing the work, update /prompts/STATUS.md.

Mark queue item

Change:

 14_generator_boundary.md

To:

 14_generator_boundary.md

Only do this if the prompt is truly complete.

Add run log entry

Append a run log entry in this shape:

Prompt: 14_generator_boundary.md
Status: completed
Summary:
implemented the formal generator boundary for Inkbranch v2
defined approved generator input/output schemas, validation, adapter contracts, and fallback behavior
kept AI generation constrained to presentation rather than story logic or runtime truth
documented the generator boundary and added focused boundary tests
Files changed:
list all significant files added/updated/removed
Commands run:
list actual commands run
Verification:
list actual verification performed
Follow-up notes / risks:
note any intentionally deferred provider-specific details
note any fallback behavior expected to deepen later
note that live provider integration remains for 15

If blocked:

do not check the queue item
add a run log entry with Status: blocked
describe the exact blocker
include attempted work
include files changed
include commands run
stop after logging
Final instruction

This prompt succeeds if AI becomes a constrained rendering layer with schema-validated inputs and outputs.

It fails if AI becomes the story logic engine, runtime truth owner, or a loose unvalidated text blob sitting in the middle of the architecture.


Next is `15_generator_integration.md`, where the real provider gets wired behind this boundary without breaking the separation.
::contentReference[oaicite:1]{index=1}