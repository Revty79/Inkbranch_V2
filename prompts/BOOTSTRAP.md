# Inkbranch v2 Bootstrap

You are working on a full rebuild of Inkbranch.

This repository uses a strict sequential prompt workflow.

Your job is to continue executing prompts in order until one of these happens:
- there are no unchecked prompts left in `/prompts/STATUS.md`
- you hit a real blocker that cannot be resolved from repo context
- a prompt explicitly says to stop after completion

## Operating loop
1. Read `/prompts/STATUS.md`
2. Find the first unchecked item in the Queue
3. Open that prompt file
4. Execute that prompt completely
5. Run the required verification steps for that prompt
6. Update `/prompts/STATUS.md`
7. Return to `/prompts/STATUS.md` and continue with the next unchecked prompt
8. Repeat until the Queue is complete or a true blocker is reached

## Core rules
- This is a rebuild from scratch, not a refactor of the old Inkbranch architecture.
- Do not reintroduce beat-graph-first architecture.
- Do not mix UI logic with planner/runtime/generator logic.
- Do not create giant mega-files.
- Do not create a giant runtime JSON blob as the source of truth.
- Do not let generated prose become canon truth.
- The planner decides valid scenes and valid choices.
- The generator only turns approved structure into prose and structured option text.
- Runtime state must remain relational, inspectable, and clean.
- Prefer small, composable files.
- Prefer explicit interfaces and typed contracts.
- If a prompt conflicts with older code, follow the prompt and preserve architecture clarity.
- Do not rebuild completed work unless a later prompt explicitly instructs you to replace it.
- Do not skip unchecked prompts.
- Do not work on multiple prompts at once.
- Fully finish the current prompt before moving to the next one.

## Completion standard for each prompt
A prompt is only considered complete when all of the following are true:
- the requested implementation is finished
- required files are created or updated
- commands required by the prompt have been run
- verification steps required by the prompt have been completed
- any failing checks introduced by the prompt have been resolved or clearly logged
- `/prompts/STATUS.md` has been updated

If all completion conditions are not met, do not mark the prompt complete.

## STATUS update requirements
After completing each prompt:
- mark the Queue item as checked
- add a new Run Log entry
- include:
  - prompt file completed
  - status
  - summary
  - files changed
  - commands run
  - verification steps
  - follow-up notes / risks

If blocked:
- do not mark the Queue item as checked
- add a Run Log entry marked `blocked`
- explain the exact blocker
- list attempted work
- list files changed, if any
- stop after logging the blocker

## Execution posture
- Server-first
- Relational-first
- Planner-first
- AI-on-rails
- Inspectable runtime

## Important behavioral rule
When one prompt is fully completed and logged in `/prompts/STATUS.md`, immediately continue to the next unchecked prompt in the Queue unless a blocker or explicit stop instruction prevents it.