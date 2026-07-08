# MCP Update Flow: Performance Problem and Target Architecture

This document maps directly to the eight acceptance criteria in issue #42.
Each section heading notes which criterion it addresses.

## Purpose

The current MCP update flow reads six fixed context files in full on every
controller invocation. This creates unnecessary token cost, slows down
lightweight operations such as stale detection, and makes the controller
harder to extend. This document describes the bottleneck, the target
architecture, and how the tiered design resolves each acceptance criterion.

## The Bottleneck (AC1)

The flat controller contract defined in
[agent/templates/mcp-memory-state-controller.md](../agent/templates/mcp-memory-state-controller.md)
provides five tools: `read_index`, `propose_update`, `list_pending`,
`apply_update`, and `append_session_note`. Each `read_index` call with
`mode: full` loads the complete content of one artifact. There is no
metadata-only tier.

In a private instance with six context files, a single controller session that
checks for stale State items and pending proposals touches all six files at
full content, even when no content is needed and only timestamps or status
flags are relevant. The practical effects are:

- Token cost scales with artifact size, not with the information actually
  needed.
- Stale-state detection, hygiene checking, and pending-update inspection all
  require full reads even though each task needs only a few metadata fields.
- High-privacy-risk proposals are read in full before a reviewer decides
  whether to inspect them at all.
- There is no way for the controller to answer "which artifacts need
  attention?" without reading every artifact.

## Target Architecture: Metadata-First Design (AC1, AC2)

The target architecture introduces a lightweight index layer and splits
read operations into three cost tiers.

### Tier 1: Metadata only (cheap)

A persistent mirror index holds per-artifact metadata: path, type, status,
timestamps, content hash, stale flag, and privacy risk level. The schema is
defined in `schemas/mirror-index.schema.json`.

`list_mirror_index()` returns this index without opening any artifact file.
`get_artifact_metadata(path)` returns the index entry for one artifact.

These calls answer "what exists and what needs attention?" at near-zero token
cost.

### Tier 2: Summary only (medium cost)

`get_artifact_summary(path)` returns a bounded excerpt or structured summary
of one artifact. This is enough to confirm a proposal's rationale or check a
State item's current status without loading the full file.

`inspect_pending_updates()` lists pending proposals with their metadata fields
(proposal ID, target layer, privacy risk, created date, digest) but not their
full proposed content.

`detect_hygiene_warnings()` scans the index for stale flags, overdue review
dates, and high-privacy proposals. It reads the index, not the artifact files.

### Tier 3: Full content (expensive, explicit)

`read_artifact(path)` and `propose_update_from_selection(paths)` are the only
tools that open artifact files and load full content. Both are reserved for
situations where a human or the agent has already confirmed via Tier 1 or
Tier 2 that full content is needed.

### Context-budget rules (AC2)

- Tier 1 calls may be made freely without a context-budget check.
- Tier 2 calls should be bounded: limit summaries to a configured maximum
  length and limit `inspect_pending_updates()` results to a configured count.
- Tier 3 calls must be preceded by a Tier 1 or Tier 2 call that confirms the
  artifact is relevant. A cold Tier 3 call with no prior metadata check is a
  controller-level warning condition.
- A batched proposal bundle groups multiple candidate changes for one review
  pass, reducing the number of Tier 3 calls needed per session. The schema is
  defined in `schemas/update-batch.schema.json`.

### Update batching (AC2)

Rather than proposing one change per controller invocation, the tiered design
supports batched proposals: a single review pass covers multiple candidate
changes selected from session notes or a set of paths. The
`propose_update_from_selection(paths)` tool accepts a list of pre-identified
paths and produces one proposal bundle for human review.

This reduces the round-trips needed to process a typical session's worth of
Memory and State candidates.

## Safety Boundaries Are Preserved (AC3)

The tiered design does not change the write path. The `propose -> review ->
apply` sequence remains the only way to modify Memory or State:

- `list_mirror_index`, `get_artifact_metadata`, `get_artifact_summary`,
  `inspect_pending_updates`, and `detect_hygiene_warnings` are all read-only.
- `propose_update_from_selection` writes only to the pending directory. It
  does not touch Memory or State.
- `read_artifact` is read-only.
- `apply_update` (from the existing flat contract) remains the only tool
  allowed to write to Memory or State, and it still requires proposal-specific
  explicit approval bound to a content digest.

No new write paths are introduced. The tiered design adds cheaper read paths;
it does not weaken or bypass the approval boundary.

## Viewer Remains Read-Only (AC4)

The local viewer described in
[docs/local-memory-state-viewer.md](local-memory-state-viewer.md) is not
part of the update flow. It is an observability surface derived from approved
artifacts. It does not invoke `apply_update` or any write tool. The tiered
tool design does not change this. See the viewer spec for the explicit
read-only and not-source-of-truth guarantee.

## Memory and State Remain Clearly Separated (AC5)

The mirror index schema (defined in `schemas/mirror-index.schema.json`)
includes a `type` field whose enum distinguishes `memory` from `state`,
`pending`, `applied`, and `session-note` entries. Every index entry is
explicitly classified.

`detect_hygiene_warnings()` includes a Memory/State boundary check: if a
pending proposal targets both layers, it is flagged as invalid rather than
processed. The tiered tool design preserves the classification rules in
[docs/memory-vs-state.md](memory-vs-state.md).

For the full tiered tool contract, including explicit Memory/State boundary
enforcement rules, see `docs/mcp-tiered-tool-design.md`.

## Synthetic Data Only (AC6, AC7)

All examples in this repository use synthetic paths, timestamps, and content.
No real personal names, workplace content, private Memory, live State, session
notes, logs, credentials, or environment values appear anywhere in this
document or in the linked schemas and examples.

A synthetic instance conforming to the mirror index schema is provided in
`examples/synthetic-mirror-index.json`.

## Evaluation Coverage (AC8)

At least five performance-oriented eval cases are sketched in
`evals/mcp-update-performance-cases.md`. The cases cover:

1. Stale-state detection from metadata only, without reading artifact content.
2. Old-pending-update detection without reading full proposal bodies.
3. High-privacy-risk proposal detection via short excerpts only.
4. Memory/State boundary violation detected from selected file paths.
5. Proposal generation from selected session notes only.

## Acceptance Criteria Traceability

| Criterion | Section(s) in this document and linked files |
| --- | --- |
| AC1: Docs explain the performance problem and optimization direction | "The Bottleneck", "Target Architecture" |
| AC2: Tool contract distinguishes cheap metadata calls from expensive full reads | "Target Architecture", "Context-budget rules", docs/mcp-tiered-tool-design.md |
| AC3: propose -> review -> apply boundaries preserved | "Safety Boundaries Are Preserved" |
| AC4: Viewer remains read-only and not source of truth | "Viewer Remains Read-Only", docs/local-memory-state-viewer.md |
| AC5: Memory and State remain clearly separated | "Memory and State Remain Clearly Separated", schemas/mirror-index.schema.json |
| AC6: Examples use synthetic data only | "Synthetic Data Only" |
| AC7: No private Memory, State, session notes, logs, or credentials | "Synthetic Data Only" |
| AC8: At least one performance-oriented eval case added or sketched | "Evaluation Coverage", evals/mcp-update-performance-cases.md |
