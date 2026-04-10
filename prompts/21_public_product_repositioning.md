# 21_public_product_repositioning.md

## Goal
Reposition Inkbranch v2’s public-facing product surfaces so the app feels like a reader-first interactive fiction product instead of an architecture demo.

This prompt is about product-facing UX/copy/layout only.
Do not change core architecture.

## Why
Current v2 structure is strong, but public-facing surfaces still read too technically.
We want:
- V2 architecture retained
- V1-style product clarity and story-first feel restored

## Scope
Focus only on these surfaces unless needed for supporting components/styles:
- `/`
- `/reader`
- any shared public-facing shell or nav elements directly affecting those pages
- minimal shared styles/components needed to support the UX shift

## Required outcomes
1. Home page must:
   - clearly explain what Inkbranch is in user language
   - emphasize story worlds, chronicles, perspectives, and reading/playing
   - present obvious calls to action
   - stop foregrounding Admin as a primary user path

2. Reader entry page must:
   - feel like the beginning of a reading experience
   - avoid architecture-language like “committed runtime state” unless absolutely required
   - guide the user toward opening or continuing chronicles

3. Copy must:
   - use product language, not internal engine language
   - sound reader-first and story-first
   - be concise and confident

4. Navigation must:
   - prioritize Reader / reading flow
   - avoid making Admin feel like a normal entry point for ordinary users

## Constraints
Do not:
- modify planner/runtime/generator core logic
- move data logic into UI
- rewrite route architecture
- introduce fake features
- broaden scope into full reader-choice interaction work (that is next prompt)

## Design direction
Take inspiration from V1’s feel:
- stronger sense of authored worlds
- stronger invitation into chronicles and perspectives
- clearer “what do I do here?” experience

But do this using V2’s architecture and component organization.

## Verification
Run:
- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:integration
- npm run build

If route behavior or visible page flow changed materially, also run:
- npm run test:e2e

## Deliverable
Make the changes, verify them, commit them, and update `prompts/STATUS.md`.