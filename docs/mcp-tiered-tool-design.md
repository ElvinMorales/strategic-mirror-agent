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

A pending proposal file may be either the bare shape defined by
`memory-state-update-proposal.schema.json` or the `{proposal, section}`
wrapper shape produced by `propose_section_update` and defined by
`schemas/section-update-proposal.schema.json`. The implementation must detect
which shape a given pending file is (the presence of a top-level `section`
key) before extracting metadata fields: `target_layer`, `target_artifact_id`,
and `content_digest` live at the top level for a bare proposal but under
`proposal.target_layer`, `proposal.target_artifact_id`, and the equivalent
digest field for a wrapped one.

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

As with `inspect_pending_updates`, every check that reads a pending proposal's
`target_layer` or other proposal fields must branch on whether the pending
file is the bare shape or the `{proposal, section}` wrapper shape and read
`proposal.target_layer` for the wrapped case. A check that assumes the bare
shape unconditionally will silently skip every section-update proposal in
scans for mixed-layer violations or missing review dates.

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

`propose_update_from_selection`'s `proposals` array accepts only the bare
proposal shape defined by `memory-state-update-proposal.schema.json`. It does
not accept the `{proposal, section}` wrapper shape produced by
`propose_section_update` below; a section-update proposal cannot currently be
placed in a bundle. Adding mixed-shape bundle support is deferred to a
follow-up issue.

#### `propose_section_update(target_file, section_anchor, new_section_content, rationale)` (New)

This tool is new in this design and closes the gap named in issue #50: large
governed files with many independent sections require transmitting the full
file content through `propose_update` even when only one section changed,
which causes excessive token usage and timeouts on files that have grown to
thousands of words across many sections.

`propose_section_update` produces a proposal that replaces exactly one named
Markdown ATX-heading section of a target file, without requiring the caller to
supply the full file content. It sits in Tier 3 alongside
`propose_update_from_selection`: both require opening the full target file to
validate safely (see Anchor Matching Rules below), and both write only to the
pending directory, never to Memory or State.

Inputs:

- `target_file`: same allowlist constraint as `propose_update`'s
  `target_artifact_id` -- an allowlisted destination under `memory/` or
  `state/`.
- `section_anchor`: the exact Markdown ATX heading line (hashes, one space,
  heading text) identifying the section to replace.
- `new_section_content`: the complete replacement body for that section only,
  not the full file. Maps to the underlying proposal's `proposed_content`
  field.
- `rationale`: concise explanation of why the section is being replaced.
- All other fields required by `memory-state-update-proposal.schema.json` for
  the target layer (`source_context_summary`, `privacy_risk`, `durability`,
  `review_by`, plus the Memory- or State-specific required fields such as
  `memory_category`/`reason_this_is_durable`/`replacement_or_append` or
  `state_category`/`stale_after`/`review_trigger`/`status`/`priority`). These
  do not disappear because the proposal is section-scoped; the issue's
  4-argument signature is illustrative, not the complete input set.

Validation:

- `target_file` must pass the layer-specific allowlist check, identical to
  `propose_update`.
- The full current content of `target_file` is read to resolve
  `section_anchor` under the Anchor Matching Rules below. Zero matches or
  multiple matches both fail closed; no proposal is created in either case.
- `operation` on the underlying proposal is constrained to `replace`. Unlike
  an ordinary full-file `propose_update` proposal, `replace` here means
  "replace the one matched section," not "replace the whole file" -- this
  distinction is carried structurally by the presence of the `section`
  wrapper key (see `schemas/section-update-proposal.schema.json`), not by any
  new value of `operation` itself.
- Content size, encoding, and required metadata are validated exactly as in
  `propose_update`.
- Secrets, executable payloads, and path-traversal instructions are rejected,
  exactly as in `propose_update`.

Outputs:

- Proposal identifier, target layer, target artifact ID, status
  `pending_review` -- identical shape to `propose_update`'s outputs.
- The resolved `section_anchor`, and the matched heading's start and end line
  numbers as a propose-time snapshot for human review only. These line
  numbers are never treated as authoritative: `apply_update` always
  re-resolves the anchor fresh against the current file at apply time (see
  Digest Scope below), so a stale snapshot cannot cause an incorrect splice.
- Explicit statement that Memory and State were not modified.

##### Anchor Matching Rules

`section_anchor` must match a Markdown ATX heading (`#` through `######`) in
`target_file` by exact, case-sensitive text comparison against the heading
line with its leading hashes, one required space, and any trailing closing
hashes or whitespace stripped -- standard ATX trimming, no markdown-inline
rendering. Setext-style headings (underlined with `===` or `---`) are out of
scope.

Lines inside a fenced code block (opened and not yet closed by a line
starting with ` ``` ` or `~~~`) are never treated as headings, including any
line that looks like an ATX heading. If a fence opens and is never closed
before end of file, every remaining line is treated as fence-interior and no
further headings are recognized in the rest of the file -- this is the
fail-safe direction: the worst case is under-detecting a heading, which
surfaces as a zero-match failure the caller can trace back to the malformed
fence, rather than over-detecting and silently resolving to the wrong span.

A section's span runs from the matched heading's line (inclusive) through the
line immediately before the next heading of equal or shallower level, or end
of file if there is no such heading. Headings nested more deeply than the
matched heading are included inside the span.

Both `propose_section_update` and `apply_update` fail closed on:

- **Zero matches**: reject with an error naming the file and the literal
  anchor text searched. No proposal is created; no update is applied.
- **Multiple matches**: reject with an error listing every matching line
  number. The tool never guesses which match was intended, even when the
  duplicates sit under different parent headings (for example, two `### Bar`
  subsections under different `## Foo` and `## Baz` sections both match
  `section_anchor: "### Bar"` and both fail closed together) -- `section_anchor`
  in this design is a single heading-text string, not a hierarchical
  breadcrumb, so it carries no parent context that would make disambiguation
  safe. A future breadcrumb-style anchor (for example `"Foo > Bar"`) is a
  possible v2 extension, not part of this design.

##### Digest Scope

This design uses whole-file digest scope for section-update proposals, not a
digest computed over only the matched section. `propose_section_update`
computes the digest of the full current `target_file` exactly as
`propose_update` already does, and `apply_update` re-hashes the full current
file and compares, exactly as it does today for every existing proposal type.
No new digest field, hashing spec, or canonicalization rule is introduced.

This is a deliberate v1 tradeoff, not an oversight: whole-file scope means a
section-update proposal goes stale and blocks at apply time -- forcing
re-review -- if any other part of the file changes between propose and apply,
even in a section the proposal never touched. Two reviewers independently
proposing edits to two different sections of the same file will serialize at
apply time under this scheme. Section-scoped digests, which would avoid this
false-positive staleness at the cost of new digest-scoping and
canonicalization logic, are deferred as a future alternative if whole-file
blocking proves problematic in practice.

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
   directory unchanged, except for the added rejection stamp. If the pending
   file is the `{proposal, section}` wrapper shape produced by
   `propose_section_update` (`schemas/section-update-proposal.schema.json`),
   the `section` key is carried over unchanged as a sibling of `proposal` and
   `rejection` in the resulting record -- `discard_update` never nests
   `section` inside `proposal`, and never flattens a wrapped proposal into the
   bare shape.
3. If a companion sidecar metadata file conforming to
   `schemas/pending-sidecar.schema.json` exists for the proposal, move it
   alongside the proposal file into the rejected directory. Unlike
   `apply_update`, which deletes the sidecar because the proposal's fate is
   fully captured in the applied record, `discard_update` preserves it: the
   rejection record benefits from keeping the sidecar's structured metadata
   next to the human-readable rejected proposal, for anyone auditing why it
   was discarded.
4. Set `approval_status` to `rejected` and attach the rejection stamp described
   in `schemas/rejected-proposal.schema.json`. For a wrapped proposal, set
   `approval_status` at `proposal.approval_status`, matching where the
   wrapper's own `proposal` sub-object lives.
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
| `propose_section_update` (new) | 3 | Yes (full content) | Pending dir only |
| `apply_update` (from flat contract) | Write | Yes | Memory or State |
| `append_session_note` (from flat contract) | Write | No | Session notes only |
| `discard_update` (new) | Write | No | Pending/rejected dir only |

## Relationship to Flat Contract Tools

| Flat contract tool | Tiered contract equivalent or note |
| --- | --- |
| `read_index` (mode: summary) | Replaced by `list_mirror_index` and `get_artifact_metadata` |
| `read_index` (mode: full) | Replaced by `read_artifact` |
| `list_pending` | Replaced by `inspect_pending_updates` |
| `propose_update` (single target, full-file) | Extended by `propose_update_from_selection` (multi-path bundle) and by `propose_section_update` (single-section patch, issue #50) |
| `apply_update` | Unchanged in signature; gains a conditional section-splice branch in its Behavior list when the applied proposal is a section-update proposal (issue #50) |
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
