# Authoring Schema

## Purpose

The authoring schema stores structured authored truth that planners consume.

## Authoring plane tables

- `worlds`
- `books`
- `book_versions`
- `canon_entries`
- `characters`
- `locations`
- `factions`
- `perspectives`
- `arc_milestones`
- `reveal_rules`
- `pacing_rules`
- `ending_rules`

## Why this is version-centered

`book_versions` is the anchor for authored truth so each playable version can be stable and inspectable.
Most authoring entities reference `book_version_id` directly to avoid ambiguity between draft/test/published states.

## Why this is not a beat graph

This schema models authored truth and planning inputs.
It intentionally avoids beat-node/edge/next-beat graph structures and avoids runtime state columns.

## JSON usage policy

`jsonb` columns are bounded support fields for metadata and rule configuration (`*_rules_json`, `metadata_json`, `tags_json`).
Main truth fields (identity, keys, names, statuses, relationships) stay relational.

## Key relationships

- `worlds -> books`
- `books -> book_versions`
- `book_versions -> canon_entries`
- `book_versions -> characters`
- `book_versions -> locations`
- `book_versions -> factions`
- `book_versions -> perspectives`
- `book_versions -> arc_milestones`
- `book_versions -> reveal_rules`
- `book_versions -> pacing_rules`
- `book_versions -> ending_rules`
- `characters -> perspectives`

## Runtime relationship

Runtime tables and commit-state structures are documented in [Runtime Schema](runtime-schema.md).
