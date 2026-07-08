# MCP Tiered Tool Design

This document defines the tiered MCP tool contract for the Strategic Mirror
Agent update flow. It is the recommended upgrade path for private instances
that encounter the performance problem described in
[docs/mcp-update-performance.md](mcp-update-performance.md).

For the foundational flat tool contract used by simple or new private
instances, see
[agent/templates/mcp-memory-state-controller.md](../agent/templates/mcp-memory-state-controller.md).

## Relationship to the Existing Controller Template

The flat five-tool contract in
`agent/templates/mcp-memory-state-controller.md` remains valid and is the
right starting point for simple or new private instances. It defines
`read_index`, `propose_update`, `list_pending`, `apply_update`, and
`append_session_note`.

The tiered contract in this document is the recommended upgrade path for
instances that experience the bottleneck described in issue #42: every
controller invocation reads full artifact content even when only metadata is
needed. Adopting the tiered contract replaces or extends the flat contract's
read tools; the write path and approval model are unchanged.

This is not a breaking change. A private instance can migrate incrementally:
introduce `list_mirror_index` and the metadata tier first, then add summary
tools, and keep `apply_update` and `append_session_note` exactly as defined in
the existing template throughout.

## Governing Principles

The tiered contract inherits all governing principles from the existing
controller template and adds one:

- Prefer the cheapest tier that answers the question. Do not call
  `read_artifact` or `propose_update_from_selection` until a Tier 1 or Tier 2
  call has confirmed the artifact is relevant.

The write path is unchanged: `propose -> review -> apply` is the only path
that modifies Memory or State. Only `apply_update` may write to Memory or
State. It still requires proposal-specific explicit approval bound to a content
digest. No new write paths are introduced.

## Tool Tiers

### Tier 1: Metadata Only (Cheap)

These tools read the mirror index. They do not open artifact files.

#### `list_mirror_index()`

Returns the full mirror index: one entry per artifact, containing metadata
fields only (path, type, status, timestamps, content hash, stale flag, privacy
risk). See `schemas/mirror-index.schema.json` for the per-entry shape.

Use this to answer: what artifacts exist, which are stale, which have pending
proposals, and which carry high privacy risk.

Inputs: none required. Optional filter by `type` or `status`.

Outputs: array of index entries. No artifact file content.

#### `get_artifact_metadata(path)`

Returns the single index entry for one artifact. Same fields as one row from
`list_mirror_index()`.

Use this before deciding whether to call `get_artifact_summary` or
`read_artifact`.

Inputs: `path` -- a logical artifact identifier, not an arbitrary filesystem
path. Must be on the server-side allowlist.

Outputs: one index entry. No artifact file content.

### Tier 2: Summary Only (Medium Cost)

These tools open one artifact file but return only a bounded excerpt or
structured summary, not full content.

#### `get_artifact_summary(path)`

Returns a bounded excerpt or structured summary of one artifact. The summary
length is capped by server configuration.

Use this to confirm a proposal's rationale, check a State item's current
status, or decide whether to proceed to a full read. Do not use it to build a
proposal from scratch.

Inputs: `path` -- same allowlist constraint as `get_artifact_metadata`.

Outputs: logical identifier, layer, short summary or excerpt, last-modified
timestamp. Not full content.

#### `inspect_pending_updates()`

Lists pending proposals with their metadata fields: proposal ID, target layer,
target artifact, privacy risk, created date, content digest. Does not return
proposed content.

Use this to triage what needs review without reading any proposal body.

Inputs: optional `layer` filter, optional bounded result limit.

Outputs: array of proposal metadata records. No proposed content.

#### `detect_hygiene_warnings()`

Scans the mirror index for conditions that need attention. Does not open
artifact files.

Detected conditions include:

- State items past their stale-after date.
- Pending proposals older than a configured threshold.
- Memory, State, or proposal records with missing review dates.
- High-privacy-risk proposals.
- Proposals that target both Memory and State (invalid; must be flagged, not
  processed).
- Session notes with Memory or State candidates but no corresponding pending
  proposal.

Inputs: none required. Optional severity filter.

Outputs: array of warning records, each with condition type, affected artifact
logical identifier, and explanation. Does not mutate or approve anything.

### Tier 3: Full Content (Expensive, Explicit)

These are the only tools that open artifact files and load full content. Both
must be preceded by a Tier 1 or Tier 2 call that confirms the artifact is
relevant.

#### `read_artifact(path)`

Reads the full content of one allowlisted artifact file.

Use only after `get_artifact_metadata` or `get_artifact_summary` has confirmed
the artifact is relevant to the current task.

Inputs: `path` -- logical identifier on the server-side allowlist. `layer` --
`memory`, `state`, or `session-notes`.

Outputs: logical identifier, layer, full content, last-modified timestamp,
content digest. Explicit statement that the result is private runtime data.

#### `propose_update_from_selection(paths)`

Accepts a list of pre-identified logical artifact paths (typically session
notes identified by Tier 1 or Tier 2 calls) and produces one batched proposal
bundle for a single human review pass. See `schemas/update-batch.schema.json`.

This tool writes only to the pending directory. It does not touch Memory or
State.

Use only after `inspect_pending_updates` or `list_mirror_index` has identified
the relevant artifacts. Do not call with arbitrary paths.

Inputs:
- `paths`: list of allowlisted logical artifact identifiers.
- `rationale`: concise explanation of why these artifacts were selected.
- `source_summary`: reviewed provenance without credentials or raw exports.

Validation:
- Each path must pass the layer-specific allowlist check.
- Content size, encoding, and required metadata must be valid.
- Mixed-layer proposals (targeting both Memory and State in one bundle item)
  are rejected.
- Secrets, executable payloads, and path-traversal instructions are rejected.

Outputs:
- Bundle ID and pending artifact logical identifier.
- Per-proposal: proposal ID, target layer, target artifact ID, content digest,
  status `pending_review`.
- Explicit statement that Memory and State were not modified.

## Tool Cost Summary

| Tool | Tier | Opens artifact files? | Writes? |
| --- | --- | --- | --- |
| `list_mirror_index` | 1 | No | No |
| `get_artifact_metadata` | 1 | No | No |
| `get_artifact_summary` | 2 | Yes (excerpt only) | No |
| `inspect_pending_updates` | 2 | No | No |
| `detect_hygiene_warnings` | 2 | No | No |
| `read_artifact` | 3 | Yes (full content) | No |
| `propose_update_from_selection` | 3 | Yes (full content) | Pending dir only |
| `apply_update` (from flat contract) | Write | Yes | Memory or State |
| `append_session_note` (from flat contract) | Write | No | Session notes only |

## Relationship to Flat Contract Tools

| Flat contract tool | Tiered contract equivalent or note |
| --- | --- |
| `read_index` (mode: summary) | Replaced by `list_mirror_index` and `get_artifact_metadata` |
| `read_index` (mode: full) | Replaced by `read_artifact` |
| `list_pending` | Replaced by `inspect_pending_updates` |
| `propose_update` (single target) | Extended by `propose_update_from_selection` (multi-path bundle) |
| `apply_update` | Unchanged; retained from flat contract |
| `append_session_note` | Unchanged; retained from flat contract |

No tool from the flat contract is removed. A private instance may run both
contracts during a migration period.

## Context-Budget Rules

- Tier 1 calls may be made freely without a context-budget check.
- Tier 2 calls must be bounded: summaries capped at a configured maximum
  length; `inspect_pending_updates` results capped at a configured count.
- A Tier 3 call without a preceding Tier 1 or Tier 2 call on the same artifact
  is a controller-level warning condition.
- A batched proposal bundle reduces Tier 3 round-trips: one
  `propose_update_from_selection` call covers multiple candidates identified in
  a single review pass.

## Memory and State Boundary Rules

These rules are inherited from
[docs/memory-vs-state.md](memory-vs-state.md) and
[agent/templates/mcp-memory-state-controller.md](../agent/templates/mcp-memory-state-controller.md).
The tiered contract adds one enforcement point:

- `detect_hygiene_warnings` flags as invalid any pending proposal that targets
  both Memory and State. Such proposals must be split and resubmitted
  separately before either can be applied.
- `propose_update_from_selection` rejects any bundle item that would mix
  layers. The caller must separate Memory and State candidates into distinct
  items.

The `type` field in each mirror index entry (see
`schemas/mirror-index.schema.json`) must be one of: `memory`, `state`,
`pending`, `applied`, or `session-note`. An entry without a valid type must be
treated as a hygiene warning, not silently accepted.

## Public Safety

All documentation, schemas, examples, and evals for this tool design use
synthetic data only. No real personal names, workplace content, private Memory,
live State, session notes, logs, credentials, or environment values appear
anywhere in this file or the files it references.
