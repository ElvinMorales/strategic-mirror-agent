# Changelog

## Unreleased

- Add a public section-update proposal schema, `propose_section_update` tool
  documentation with its anchor matching rules and whole-file digest scope
  decision, an apply_update section-splice behavior branch, and section-patch
  eval cases, for issue #50.
- Add a public pending-proposal sidecar metadata schema and reference it from
  the tiered tool design and Memory/State MCP controller contract, replacing
  generic "companion sidecar metadata file" wording.
- Document `apply_update`'s companion sidecar deletion on archive in the
  Memory/State MCP controller contract.
- Document `discard_update`'s companion sidecar move to the rejected
  directory in the tiered tool design.
- Add MCP update flow performance documentation, tiered tool contract, mirror
  index schema, update batch schema, synthetic mirror index example, and
  performance-oriented eval cases.
- Add explicit read-only and not-source-of-truth callout to the local
  Memory/State viewer specification.
- Add a public-safe local Memory/State viewer specification.
- Add Claude Desktop MCP setup notes and a Memory/State MCP controller contract
  template.
- Add Memory/State update proposal schema, synthetic examples, and MCP safety
  eval cases.

## 0.2.0

- Add a release-prep checklist with final release, social, and public-safety
  review material.
- Add a public communication package with release note, social post,
  field-note, and repo positioning drafts.
- Add an install guide for adapting the scaffold into Claude web, Claude Code,
  and local Markdown workflows.
- Add post-sprint documentation navigation for key scaffold docs, examples,
  decisions, templates, evals, and roadmap artifacts.
- Add a v0.2.0 roadmap note outlining must-have, maybe-later, and non-goal scope.
- Add framework mapping notes for adapting the scaffold across common agent host environments.
- Add valid synthetic schema instance examples for Memory, State, connector registry, and response outputs.
- Add an architecture decision record documenting connectors as adapter-layer
  artifacts.
- Add negative eval cases for voice, Memory/State, connector, boundary,
  public-safety, and psychoanalysis failure modes.
- Add GitHub issue and pull request templates for artifact, safety, and
  validation reviews.
- Expand the private instance starter guide with copy steps, Git safety,
  local-only connector guidance, and first-run checklists.
- Add a synthetic public-safe walkthrough for a workplace boundary-setting message.
- Add a visual artifact map for the 14-bucket taxonomy alignment.
- Add release notes for the initial public scaffold.

## 0.1.0

- Bootstrap public-safe Strategic Mirror Agent scaffold.
- Add direction, memory, state, guardrails, connector policy, templates, schemas, synthetic examples, evals, and validation scripts.
- Document private runtime boundary and connector posture.
- See the durable release note in [docs/release-notes-v0.1.0.md](docs/release-notes-v0.1.0.md).
