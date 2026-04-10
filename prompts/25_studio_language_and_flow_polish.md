# 25_studio_language_and_flow_polish.md

## Goal
Polish Studio language and flow so the author-facing side of Inkbranch V2 feels clearer, more usable, and less like internal documentation.

This is a Studio UX/copy/flow refinement pass.
Do not change core architecture.

## Why
Studio in V2 is structurally sound, but parts of it still read too much like system design language rather than an author tool.
We want Studio to feel:
- clearer
- more concrete
- more guided
- more author-friendly

The author should feel like they are building a world/book/chronicle input set, not operating an exposed architecture diagram.

## Scope
Focus on:
- Studio section labels
- descriptions and helper copy
- page headers and subheaders
- empty states
- contextual guidance
- author workflow clarity between worlds, books, versions, canon, entities, and planning sections

Primary surfaces:
- `/studio`
- `/studio/worlds`
- `/studio/books`
- `/studio/versions`
- `/studio/canon`
- `/studio/entities`
- `/studio/planning`
- related Studio shared UI components

## Required outcomes
1. Studio language should feel author-facing, not architecture-facing.
2. Section purposes should be easier to understand quickly.
3. Empty states should help the author know what to create next.
4. Navigation between Studio sections should feel more intentional and connected.
5. The authoring flow should better communicate how the major parts relate:
   - worlds
   - books
   - versions
   - canon
   - entities
   - planning rules

## UX direction
Prefer:
- concrete language
- “what this section is for”
- “what to do next”
- concise author guidance
- less jargon where jargon is not needed

Keep necessary product vocabulary where it matters, but reduce unnecessary internal/system phrasing.

## Constraints
Do not:
- rewrite Studio architecture
- move logic into UI improperly
- change planner/runtime/generator ownership
- broaden into new large authoring features
- refactor unrelated routes outside scoped Studio polish

## Implementation guidance
- Improve clarity before adding complexity
- Prefer copy/layout/navigation polish over structural churn
- Use existing shared Studio components where possible
- Keep Studio professional, readable, and product-like
- Maintain architecture boundaries and route thinness

## Verification
Run:
- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:integration
- npm run build

If route behavior or visible author flow changed materially, also run:
- npm run test:e2e

## Deliverable
Make the changes, verify them, commit them, and update `prompts/STATUS.md`.