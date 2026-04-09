# 10_planner_mvp.md

## Title
Inkbranch v2 — Planner MVP

## Objective
Implement the first deterministic MVP of the Inkbranch v2 planner.

This prompt exists to turn the planner from a contract layer into a working structural decision system.

By the end of this prompt, the repo should have:
- a real planner service implementation
- deterministic planning behavior
- authored-truth + runtime-context evaluation
- scene package creation
- decision package creation
- reveal eligibility handling
- pacing-aware structural selection
- ending eligibility evaluation
- planner diagnostics
- planner validation integration where appropriate
- documentation explaining how the MVP planner works

This prompt is about structural story planning.

This is not the prompt for:
- prose generation
- runtime commit orchestration
- reader UI implementation
- admin planner dashboards
- AI model usage inside planning

---

## Why this prompt matters
Inkbranch v2 needs a real structural brain.

The planner is that brain.

Without a real planner, the architecture will drift back toward:
- hand-authored scene chaining
- ad hoc route-level story logic
- generator-led story direction
- implicit “whatever seems next” behavior
- continuity buried in runtime state without structural reasoning

The MVP planner does not need to be perfect.
But it does need to be real.

It must:
- consume authored truth
- consume runtime context
- make deterministic structural decisions
- package a valid next scene
- package valid choices
- explain its decision shape clearly enough for future debugging

This prompt is where Inkbranch first becomes a true planner-led system.

---

## Product direction to preserve
Inkbranch v2 is not a beat-graph engine.

The planner must not work like:
- current beat -> next beat
- choice edge -> linked node
- branch tree traversal
- scene graph stepping

Instead the planner must work like:
- evaluate authored truth
- evaluate runtime context
- evaluate milestone state
- evaluate reveal legality
- evaluate pacing and ending readiness
- produce a valid next scene package and valid decision package

Core loop:
book bible -> planner -> scene package -> reader decision -> runtime update -> next scene package

The MVP planner must reinforce that architecture.

---

## Non-negotiable rules
1. Do not use AI/LLM generation in the planner.
2. Do not generate prose in the planner.
3. Do not implement runtime DB commits in the planner.
4. Do not reintroduce beat-graph-first logic.
5. Do not let the planner become a route/page helper.
6. Do not let the planner depend on UI code.
7. Do not let the planner depend directly on raw DB calls inside the service logic.
8. Use the data access layer to obtain planner inputs.
9. Keep the planner deterministic and inspectable.
10. Prefer explicit structural rules over hidden heuristics.

---

## Scope
You should implement:
- a concrete planner MVP service
- planner context loading support using the data access layer
- scene selection logic
- decision package construction
- reveal eligibility evaluation
- milestone targeting logic
- basic pacing-aware scene selection
- basic ending eligibility evaluation
- planner diagnostics and fallback behavior
- planner documentation

You should also:
- align the implementation with the planner contracts from `09`
- preserve the separation between planner and runtime/generator
- keep the planner deterministic
- keep outputs inspectable

---

## Out of scope
Do not implement:
- runtime scene instance persistence
- runtime event writes
- runtime knowledge updates
- generator prompts
- generator provider calls
- prose rendering
- reader route integration
- admin UI for planner diagnostics
- advanced planner optimization
- ML ranking
- stochastic planning
- hidden randomization that makes runs irreproducible

This prompt is the first real planner, not the final planner.

---

## MVP planner philosophy

### Principle 1 — deterministic first
The MVP planner should make deterministic decisions from:
- authored truth
- runtime context
- simple rule ordering
- explicit priorities

Do not add randomness unless there is a very strong reason and it is explicitly controlled.

The MVP should be explainable.

### Principle 2 — structural, not literary
The planner chooses:
- scene kind
- scene goal
- active milestone targets
- allowed reveals
- blocked reveals
- continuity facts
- valid choices
- ending eligibility

It does not choose:
- final prose wording
- narration style
- button copy polish
- cinematic phrasing

### Principle 3 — planner should prefer “valid next package” over “perfect next package”
The MVP planner should aim to reliably produce a valid next step.

It does not need to be maximally sophisticated yet.
It does need to be:
- stable
- explainable
- consistent with authored truth
- safe for future runtime integration

### Principle 4 — diagnostics matter
The planner should leave behind enough reasoning summary that later tools can answer:
- why this scene type was chosen
- which milestone it is targeting
- which reveals were allowed or blocked
- why endings are or are not eligible
- why certain choices were offered

### Principle 5 — fallbacks should be explicit
If the planner cannot produce a richer scene package, it should still be able to produce a valid fallback package.

Do not let the planner silently fail into undefined behavior.

---

## Required planner behavior

The MVP planner should support a full basic planning flow:

1. Load planning context
2. Evaluate unresolved milestones
3. Evaluate reveal legality
4. Evaluate pacing state
5. Evaluate ending readiness
6. Choose a next scene kind and scene goal
7. Choose a target milestone or fallback goal
8. Build continuity facts and scene constraints
9. Build a valid decision package
10. Return a planner result with diagnostics

This should be real implementation behavior, not placeholders.

---

## Required implementation structure

Use or normalize a structure like:

```text
src/core/planner/
  README.md
  contracts/
    ...
  services/
    context-loader.ts
    milestone-selector.ts
    reveal-evaluator.ts
    pacing-evaluator.ts
    ending-evaluator.ts
    scene-selector.ts
    decision-builder.ts
    planner-mvp.ts
    index.ts
  strategies/
    index.ts

# 10_planner_mvp.md

## Title
Inkbranch v2 — Planner MVP

## Objective
Implement the first deterministic MVP of the Inkbranch v2 planner.

This prompt exists to turn the planner from a contract layer into a working structural decision system.

By the end of this prompt, the repo should have:
- a real planner service implementation
- deterministic planning behavior
- authored-truth + runtime-context evaluation
- scene package creation
- decision package creation
- reveal eligibility handling
- pacing-aware structural selection
- ending eligibility evaluation
- planner diagnostics
- planner validation integration where appropriate
- documentation explaining how the MVP planner works

This prompt is about structural story planning.

This is not the prompt for:
- prose generation
- runtime commit orchestration
- reader UI implementation
- admin planner dashboards
- AI model usage inside planning

---

## Why this prompt matters
Inkbranch v2 needs a real structural brain.

The planner is that brain.

Without a real planner, the architecture will drift back toward:
- hand-authored scene chaining
- ad hoc route-level story logic
- generator-led story direction
- implicit “whatever seems next” behavior
- continuity buried in runtime state without structural reasoning

The MVP planner does not need to be perfect.
But it does need to be real.

It must:
- consume authored truth
- consume runtime context
- make deterministic structural decisions
- package a valid next scene
- package valid choices
- explain its decision shape clearly enough for future debugging

This prompt is where Inkbranch first becomes a true planner-led system.

---

## Product direction to preserve
Inkbranch v2 is not a beat-graph engine.

The planner must not work like:
- current beat -> next beat
- choice edge -> linked node
- branch tree traversal
- scene graph stepping

Instead the planner must work like:
- evaluate authored truth
- evaluate runtime context
- evaluate milestone state
- evaluate reveal legality
- evaluate pacing and ending readiness
- produce a valid next scene package and valid decision package

Core loop:
book bible -> planner -> scene package -> reader decision -> runtime update -> next scene package

The MVP planner must reinforce that architecture.

---

## Non-negotiable rules
1. Do not use AI/LLM generation in the planner.
2. Do not generate prose in the planner.
3. Do not implement runtime DB commits in the planner.
4. Do not reintroduce beat-graph-first logic.
5. Do not let the planner become a route/page helper.
6. Do not let the planner depend on UI code.
7. Do not let the planner depend directly on raw DB calls inside the service logic.
8. Use the data access layer to obtain planner inputs.
9. Keep the planner deterministic and inspectable.
10. Prefer explicit structural rules over hidden heuristics.

---

## Scope
You should implement:
- a concrete planner MVP service
- planner context loading support using the data access layer
- scene selection logic
- decision package construction
- reveal eligibility evaluation
- milestone targeting logic
- basic pacing-aware scene selection
- basic ending eligibility evaluation
- planner diagnostics and fallback behavior
- planner documentation

You should also:
- align the implementation with the planner contracts from `09`
- preserve the separation between planner and runtime/generator
- keep the planner deterministic
- keep outputs inspectable

---

## Out of scope
Do not implement:
- runtime scene instance persistence
- runtime event writes
- runtime knowledge updates
- generator prompts
- generator provider calls
- prose rendering
- reader route integration
- admin UI for planner diagnostics
- advanced planner optimization
- ML ranking
- stochastic planning
- hidden randomization that makes runs irreproducible

This prompt is the first real planner, not the final planner.

---

## MVP planner philosophy

### Principle 1 — deterministic first
The MVP planner should make deterministic decisions from:
- authored truth
- runtime context
- simple rule ordering
- explicit priorities

Do not add randomness unless there is a very strong reason and it is explicitly controlled.

The MVP should be explainable.

### Principle 2 — structural, not literary
The planner chooses:
- scene kind
- scene goal
- active milestone targets
- allowed reveals
- blocked reveals
- continuity facts
- valid choices
- ending eligibility

It does not choose:
- final prose wording
- narration style
- button copy polish
- cinematic phrasing

### Principle 3 — planner should prefer “valid next package” over “perfect next package”
The MVP planner should aim to reliably produce a valid next step.

It does not need to be maximally sophisticated yet.
It does need to be:
- stable
- explainable
- consistent with authored truth
- safe for future runtime integration

### Principle 4 — diagnostics matter
The planner should leave behind enough reasoning summary that later tools can answer:
- why this scene type was chosen
- which milestone it is targeting
- which reveals were allowed or blocked
- why endings are or are not eligible
- why certain choices were offered

### Principle 5 — fallbacks should be explicit
If the planner cannot produce a richer scene package, it should still be able to produce a valid fallback package.

Do not let the planner silently fail into undefined behavior.

---

## Required planner behavior

The MVP planner should support a full basic planning flow:

1. Load planning context
2. Evaluate unresolved milestones
3. Evaluate reveal legality
4. Evaluate pacing state
5. Evaluate ending readiness
6. Choose a next scene kind and scene goal
7. Choose a target milestone or fallback goal
8. Build continuity facts and scene constraints
9. Build a valid decision package
10. Return a planner result with diagnostics

This should be real implementation behavior, not placeholders.

---

## Required implementation structure

Use or normalize a structure like:

```text
src/core/planner/
  README.md
  contracts/
    ...
  services/
    context-loader.ts
    milestone-selector.ts
    reveal-evaluator.ts
    pacing-evaluator.ts
    ending-evaluator.ts
    scene-selector.ts
    decision-builder.ts
    planner-mvp.ts
    index.ts
  strategies/
    index.ts


Next is `11_runtime_commit_pipeline.md`, which is where the planner’s output starts becoming committed run history instead of just a valid proposal.
::contentReference[oaicite:1]{index=1}