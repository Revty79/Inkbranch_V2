# 24_onboarding_and_discovery.md

## Goal
Improve onboarding and discovery so a new user can quickly understand what Inkbranch is, what to do first, and how to begin or continue a story.

This prompt is about user flow clarity.
Do not change core architecture.

## Why
Even with better public positioning and visual identity, users still need a clear path into the product.
The current app needs stronger:
- first-step guidance
- chronicle discovery
- start/continue flow clarity
- empty-state usefulness
- direction for readers encountering the product for the first time

We want Inkbranch V2 to feel guided and approachable instead of requiring the user to infer the flow.

## Scope
Focus on:
- public discovery surfaces
- reader chronicle entry points
- chronicle selection/start/continue flow
- empty states and instructional UI
- any supporting shared UI needed to clarify these flows

Potentially relevant routes/components include:
- `/`
- `/reader`
- `/reader/chronicles`
- `/reader/chronicles/[chronicleId]`
- related shared reader/public UI components

## Required outcomes
1. A new user should understand the first meaningful action quickly.
2. Discovery surfaces should guide users toward available stories/chronicles clearly.
3. Empty states should help users recover instead of just stating that nothing exists.
4. “Start reading” and “continue reading” paths should be obvious where applicable.
5. The flow should feel like a product onboarding experience, not a developer demo.

## Desired UX behavior
Improve clarity around:
- what a chronicle is
- what the reader does next
- whether the user is starting fresh or continuing
- where to go when there is no content yet
- how to move from discovery into active reading

Prefer:
- clear calls to action
- plain product language
- helpful next-step guidance
- reduced friction in the visible UI flow

## Constraints
Do not:
- rewrite core story logic
- change planner/runtime ownership
- broaden into a full studio overhaul
- invent unsupported back-end features
- expose internal technical concepts unnecessarily

## Implementation guidance
- Favor practical user guidance over abstract explanation
- Improve route-to-route continuity
- Strengthen list/card/empty-state CTA language
- Make navigation feel intentional
- Keep changes architecture-safe and scoped to user flow clarity

## Verification
Run:
- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:integration
- npm run build
- npm run test:e2e

## Deliverable
Make the changes, verify them, commit them, and update `prompts/STATUS.md`.