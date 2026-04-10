# AGENTS.md

## Mission
This repository is Inkbranch v2.

Your job is NOT to redesign the architecture.
Your job is to improve the product experience on top of the existing architecture.

Primary directive:
- Keep V2's architecture, boundaries, planner/runtime/generator separation, and test discipline.
- Port the BEST user-facing product qualities from V1 into V2.
- Make the app feel like a story product, not an internal architecture demo.

## Non-negotiables
Do not:
- collapse core/data/ui/app boundaries
- move engine logic into UI pages/components
- reintroduce beat-graph-first architecture
- let generated prose become canon truth
- remove or weaken tests/verification gates
- perform broad rewrites outside the scoped prompt

## Product direction
Use this rule of thumb:
- V2 brain
- V1 heart

Meaning:
- Keep V2 as the foundation
- Restore V1’s stronger product UX, story-first language, onboarding, and visual identity

## UX rules
Default toward:
- story-first language
- reader-first flows
- concrete calls to action
- user-facing labels instead of internal engine terminology
- fewer “planner/runtime/commit/generator” phrases in normal user surfaces
- preserving Admin as an internal/inspection surface, not the main product face

Avoid:
- architecture-speak on landing pages and reader pages
- exposing internal IDs or technical references to normal users
- empty “shell-only” feeling pages where a real workflow should exist

## Implementation priorities
When a prompt asks for UX/product work, prioritize:
1. Reader experience
2. Public landing and discovery
3. Chronicle onboarding
4. Visual/design consistency
5. Studio clarity for authors
6. Admin polish last

## Working style
- Read existing docs and route structure before changing anything
- Prefer small, composable edits
- Preserve existing route contracts unless the prompt explicitly allows route changes
- Reuse existing components where possible
- Keep copy concise and product-facing

## Required checks
After any code change, run:
- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:integration
- npm run build

If the task touches live flows or route behavior, also run:
- npm run test:e2e

## Git expectations
- Make focused commits
- Do not leave the worktree dirty
- Summarize exactly what changed, what was verified, and any remaining gaps

## Scope discipline
If a prompt is broad, do not try to solve the whole product at once.
Complete only the scoped pass fully, verify it, commit it, and stop.