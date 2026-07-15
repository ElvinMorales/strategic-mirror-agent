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

Each pending proposal may have a companion sidecar metadata file conforming to
`schemas/pending-sidecar.schema.json`. Before including a sidecar metadata
entry in the returned array, the implementation must verify that the
companion `.pending.md` file still exists (a directory listing check -- no
content read). An orphaned sidecar (its `.pending.md` has been deleted) must
be excluded from results rather than returned as a phantom proposal. This is a
known edge case: sidecar cleanup is not atomic, so a brief window exists after
deletion where the sidecar may still be present. Callers should not assume the
absence of a result means the pending directory is clean.

Inputs: optional `layer` filter, optional bounded result limit.

Outputs: array of proposal metadata records, each confirmed to have a live
companion file. No proposed content.

#### `detect_hygiene_warnings()`

Scans the mirror index for conditions that need attention. Does not open
artifact files.

Detected conditions include:

- State items past their stale-after date.
- Pending proposals older than a configured threshold.
- Memory, State, or proposal records with missing review dates.
- High-privacy-risk proposals.

In v1, `privacy_risk` is hardcoded to `"high"` for all six governed context
files, so the "high-privacy pending proposal" hygiene condition matches any
existing pending proposal and provides no discrimination between proposals until
`privacy_risk` is parameterized per-artifact in v2.

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

### Write Tier: Discard (New)

This tool is new in this design and closes the gap named in issue #49: the
existing flat and tiered contracts define how a proposal is approved and
applied, but not how a reviewer rejects one. It sits beside `apply_update` as
the second and only other tool permitted to resolve a pending proposal.

#### `discard_update(proposal_id, rejection)`

Moves one pending proposal file from the pending directory to a sibling
rejected directory. It never opens, reads, or writes any file under `memory/`
or `state/`.

This design uses `outputs/rejected/` (or `updates/rejected/`, matching whichever
canonical pending directory the instance chose) as a sibling to `pending/` and
`applied/`, rather than the generic `outputs/archive/` or `updates/archive/`
wording in the flat controller template, because it matches the private
server's actual directory naming (`PENDING_DIR`, `APPLIED_DIR`, and now
`REJECTED_DIR`) rather than the template's older generic archive wording.

Inputs:

- `proposal_id`: the pending proposal to discard.
- `rejection`: an object carrying `rejected_by` and `reason`.

The `rejection.reason` field is distinct from the proposal's own `rationale`
field: `rationale` (set at proposal time) explains why the change was
proposed, while `rejection.reason` (set at discard time) explains why it was
discarded; the two answer different questions and are not redundant.

Validation:

- Confirm the proposal is still pending. A proposal already `applied`,
  `rejected`, or `archived` cannot be discarded again.
- Re-resolve the target against the server-owned allowlist to confirm the
  proposal still names an allowlisted target artifact.
- Reject a `rejection` payload missing `rejected_by` or `reason`.

Behavior:

1. Do not open, read, or write any file under `memory/` or `state/`.
2. Move the pending proposal file from the pending directory to the rejected
   directory unchanged, except for the added rejection stamp.
3. If a companion sidecar metadata file conforming to
   `schemas/pending-sidecar.schema.json` exists for the proposal, move it
   alongside the proposal file into the rejected directory. Unlike
   `apply_update`, which deletes the sidecar because the proposal's fate is
   fully captured in the applied record, `discard_update` preserves it: the
   rejection record benefits from keeping the sidecar's structured metadata
   next to the human-readable rejected proposal, for anyone auditing why it
   was discarded.
4. Set `approval_status` to `rejected` and attach the rejection stamp described
   in `schemas/rejected-proposal.schema.json`.
5. Append a minimal audit record.

Outputs:

- Proposal identifier.
- Target artifact identifier and layer (unchanged from the original proposal).
- Rejected timestamp.
- Rejected logical identifier (the proposal's new location in the rejected
  directory).
- Status: `rejected`.
- Explicit statement that Memory and State were not modified.

`discard_update` must fail closed when the proposal is not pending, the target
no longer resolves against the allowlist, or the rejection payload is
incomplete.

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
| `discard_update` (new) | Write | No | Pending/rejected dir only |

## Relationship to Flat Contract Tools

| Flat contract tool | Tiered contract equivalent or note |
| --- | --- |
| `read_index` (mode: summary) | Replaced by `list_mirror_index` and `get_artifact_metadata` |
| `read_index` (mode: full) | Replaced by `read_artifact` |
| `list_pending` | Replaced by `inspect_pending_updates` |
| `propose_update` (single target) | Extended by `propose_update_from_selection` (multi-path bundle) |
| `apply_update` | Unchanged; retained from flat contract |
| `append_session_note` | Unchanged; retained from flat contract |
| (none) | `discard_update` is new; no flat contract equivalent exists prior to issue #49 |

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
