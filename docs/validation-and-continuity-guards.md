# Validation And Continuity Guards

## Purpose

Inkbranch v2 uses an explicit guard layer to prevent invalid structural state and continuity drift from silently entering committed runtime truth.

The guard layer protects:

- planner scene package coherence
- reveal legality
- runtime instantiation and choice-resolution transitions
- knowledge update consistency
- canon commit consistency
- chronicle projection coherence
- ending eligibility/transition safety
- generator presentation safety at truth boundaries

## What Continuity Means

Continuity in Inkbranch v2 is consistency over time between:

- authored truth
- planner-approved structure
- runtime-committed records
- presentational generator output

Continuity guards reject states where these layers contradict one another.

## Where Guards Run

Guards run in real execution paths, not only in standalone files:

- before runtime scene instantiation (`validatePlannerScenePackage`, `validateRuntimeInstantiationInput`)
- during choice resolution (`validateChoiceResolutionInput`)
- before reveal-derived effects are committed (`validateRevealUsage`)
- before knowledge updates are applied (`validateKnowledgeUpdateInput`)
- before canon commits are applied (`validateCanonCommitEffectsInput`)
- after chronicle projection refresh (`validateChronicleProjectionInput`)
- during ending transitions (`validateEndingTransition`)
- during generator output handling (`validateGeneratorOutputSafety`)

## Blocking vs Safe Degrade

Blocking examples:

- illegal/blocked reveal usage
- invalid choice resolution state
- contradictory canon commit values
- knowledge state regression
- chronicle projection mismatch
- invalid ending transition

Safe-degrade examples:

- generator output safety/schema failures (fallback presentation is returned)

## Structured Results

Guards return structured results with:

- domain
- timestamp
- stable issue codes
- severity
- blocking status
- fallback allowance
- optional context

This makes failures inspectable and easier to surface in admin/debug workflows.

## Architecture Boundaries Preserved

The guard layer does not:

- mutate runtime truth directly
- replace planner logic
- replace runtime orchestration
- push continuity logic into UI routes/components
- treat generated prose as continuity authority

## Out Of Scope For This Prompt

- automated remediation or state-rewrite tooling
- planner/runtimes feature expansion
- broad policy engines beyond current continuity safety
- admin mutation controls

Seed/demo content and broader quality hardening continue in later prompts.
