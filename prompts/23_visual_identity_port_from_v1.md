# 23_visual_identity_port_from_v1.md

## Goal
Bring the strongest visual identity qualities from Inkbranch V1 into Inkbranch V2 so the product feels branded, atmospheric, and story-first instead of plain or generic.

This is a visual/product-surface pass.
Do not change core architecture.

## Why
V2 has the stronger architecture, but its current presentation feels too plain and system-like.
V1 had a stronger visual identity:
- warmer ink-and-paper atmosphere
- clearer branded surfaces
- more memorable buttons, cards, panels, and page tone
- stronger sense that this is a story product

We want that feeling in V2 without regressing architecture or rebuilding the app into V1.

## Scope
Focus on:
- shared global styling
- shared visual tokens and reusable product-surface styles
- public/reader/studio surfaces that directly benefit from the identity pass
- existing UI components where visual treatment can be upgraded cleanly

You may update:
- `src/app/globals.css`
- shared UI components
- page-level composition where needed for visual consistency

## Required outcomes
1. The app should feel more like a branded interactive fiction product.
2. Public and reader-facing surfaces should feel warmer, richer, and more intentional.
3. Studio should still feel professional and usable, but not sterile.
4. Visual styling should be more cohesive across:
   - cards
   - panels
   - buttons
   - labels
   - headers
   - empty states
   - navigation elements
5. The design should support readability first, especially for story scenes and longer-form text.

## Design direction
Use V1 as inspiration, not as a literal copy.

Lean toward:
- ink / paper / manuscript / authored-world tone
- warm neutrals over flat gray UI
- clearer hierarchy
- more inviting cards and surfaces
- better button presence and CTA clarity
- stronger atmosphere without becoming visually noisy

Avoid:
- decorative clutter
- over-styling that hurts readability
- fragile one-off styles scattered across pages
- heavy redesign that breaks component reuse

## Constraints
Do not:
- change planner/runtime/generator logic
- move business logic into UI
- rewrite route architecture
- create a large disconnected design system rewrite
- widen scope into onboarding or reader interaction behavior beyond what is needed visually

## Implementation guidance
- Prefer improving shared styles over page-by-page hacks
- Reuse existing component structure where possible
- Keep typography readable for long-form story content
- Maintain mobile friendliness
- Preserve accessibility and contrast

## Verification
Run:
- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:integration
- npm run build

If route-visible UI behavior changed materially, also run:
- npm run test:e2e

## Deliverable
Make the changes, verify them, commit them, and update `prompts/STATUS.md`.