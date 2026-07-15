# Memory/State MCP Controller Contract

## Purpose

Use this template to define a local Model Context Protocol (MCP) controller for
a private Strategic Mirror instance.

The controller is a narrow file-access layer. It lets an approved local host,
such as Claude Desktop, read selected private Memory or State artifacts and
manage reviewed update proposals without granting broad filesystem access.

The governing write pattern is:

```text
propose update → review pending update → apply approved update
```

Memory and State remain governed artifacts. A model or connector may propose a
change, but it must not silently rewrite either layer.

For instances that need a metadata-first, tiered read strategy to reduce token
cost, see
[docs/mcp-tiered-tool-design.md](../../docs/mcp-tiered-tool-design.md).

## Intended Private-Runtime Use

This contract is for a private, local runtime that has:

- One explicitly approved private Strategic Mirror root folder.
- Separate `memory/` and `state/` directories.
- A pending-proposal directory outside Memory and State.
- A human reviewer who approves or rejects each proposed update.
- Local audit records appropriate for the private environment.

Copy and adapt this contract only inside an approved private environment. Do
not add filled Memory, live State, private configuration, credentials, machine
paths, or runtime logs to the public scaffold.

## Non-Goals

This contract does not define or authorize:

- A runtime MCP server implementation.
- A hosted or remote HTTP MCP service.
- Broad file browsing or whole-drive scans.
- Shell or process execution.
- Network access.
- Delete operations.
- Credential, token, key, or secret handling.
- Email, calendar, chat, browser, or document-system connectors.
- Writes outside the approved private agent root.
- Automatic Memory or State updates.
- Public storage of private runtime data.

## Governing Principles

1. Start with the smallest useful read and write surface.
2. Resolve every path against one approved private root.
3. Deny path traversal, symbolic-link escapes, and unapproved absolute paths.
4. Keep Memory and State separate during reads, proposals, review, and apply.
5. Treat tool input as untrusted until it passes path and content validation.
6. Make pending proposals inspectable before approval.
7. Bind approval to one proposal, target, content digest, and review event.
8. Record applied changes without logging unnecessary private content.
9. Fail closed when a path, approval, or artifact classification is unclear.

## Folder Boundaries

Use a private structure equivalent to:

```text
<approved-private-root>/
|-- memory/
|-- state/
|-- outputs/
|   |-- pending/
|   `-- archive/
|-- updates/
|   |-- pending/
|   `-- archive/
|-- session-notes/
`-- audit/
```

An implementation may use either `outputs/pending/` or `updates/pending/`.
Choose one canonical pending directory and one corresponding archive directory.
Do not search both dynamically.

### Allowed Directories

| Directory | Allowed operations |
| --- | --- |
| `memory/` | Read approved files; write only through approved `apply_update`. |
| `state/` | Read approved files; write only through approved `apply_update`. |
| `outputs/pending/` or `updates/pending/` | Create and read update proposals. |
| `outputs/archive/` or `updates/archive/` | Archive applied or rejected proposals. |
| `session-notes/` | Append timestamped session notes. |
| `audit/` | Append minimal controller audit records. |

The controller should use an explicit file allowlist within `memory/` and
`state/`. Directory permission alone is not sufficient.

### Denied Directories And Targets

Access must be denied for:

- Any path outside the approved private root.
- The public Strategic Mirror scaffold repository.
- Full drives or user-profile roots.
- Desktop and Downloads.
- OneDrive or SharePoint sync roots.
- Broad documents folders.
- Internal repositories.
- Email, chat, calendar, or document export folders.
- Credential, secret, key, token, browser-profile, or authentication folders.
- Confidential or regulated document folders.
- Hidden runtime or version-control metadata unless explicitly required for
  controller operation.

An implementation must reject `..` traversal, unexpected absolute paths,
alternate data streams, symbolic links, junctions, or other path mechanisms
that escape the approved root.

## Artifact Boundaries

Memory is durable, slowly changing context. State is temporary execution
context tied to an active situation, deadline, decision, risk, or workflow.

The controller must preserve these boundaries:

- A Memory proposal targets one allowlisted file under `memory/`.
- A State proposal targets one allowlisted file under `state/`.
- A State proposal includes a stale-after date or review trigger.
- A proposal cannot target both layers.
- State cannot be promoted into Memory without a separate Memory proposal.
- `propose_update` never edits Memory or State directly.
- `apply_update` is the only tool allowed to modify Memory or State.
- `apply_update` requires explicit approval for the exact pending proposal.

## Tool Contract

| Tool | Purpose |
| --- | --- |
| `read_index` | Read one approved Memory or State file, or a safe summary of approved files. |
| `propose_update` | Write a proposed replacement or update to the canonical pending directory. |
| `list_pending` | List update proposals waiting for review. |
| `apply_update` | Apply an explicitly approved proposal and archive the pending file. |
| `append_session_note` | Append a timestamped note without touching Memory or State. |

No generic `read_file`, `write_file`, `delete_file`, `list_directory`,
`execute`, or network tool is part of this contract.

## Tool Input And Output Expectations

### `read_index`

Inputs:

- `layer`: `memory` or `state`.
- `artifact_id`: an allowlisted logical identifier, not an arbitrary path.
- `mode`: `full` for one approved file or `summary` for a safe index.

Validation:

- Map `artifact_id` to a server-owned allowlist.
- Resolve and verify the canonical path remains under the approved layer.
- Reject wildcard, recursive, hidden, binary, and oversized reads.

Outputs:

- Logical artifact identifier.
- Layer.
- Content or safe summary.
- Last-modified timestamp.
- Optional content digest.
- A statement that the result is private runtime data.

### `propose_update`

Inputs:

- `layer`: `memory` or `state`.
- `target_artifact_id`: one allowlisted destination.
- `proposal_type`: replacement, append, or structured merge if supported.
- `proposed_content`: complete reviewable content or a bounded patch.
- `reason`: concise explanation of why the update is proposed.
- `source_summary`: reviewed provenance without credentials or raw exports.
- `stale_after` or `review_trigger`: required for State proposals.

Validation:

- Validate the destination against the layer-specific allowlist.
- Validate content size, encoding, and required metadata.
- Reject secrets, executable payloads, path instructions, and mixed-layer
  proposals.
- Generate a unique proposal identifier and content digest.

Outputs:

- Proposal identifier.
- Pending artifact location expressed as a logical identifier.
- Target layer and artifact identifier.
- Content digest.
- Status: `pending_review`.
- Explicit statement that Memory and State were not modified.

`propose_update` must write only to the canonical pending directory. It never
edits Memory or State directly.

### `list_pending`

Inputs:

- Optional `layer` filter.
- Optional bounded result limit.

Outputs:

- Proposal identifier.
- Target layer and artifact identifier.
- Created timestamp.
- Reason summary.
- Content digest.
- Review status.

The output should not duplicate full proposal content unless the reviewer asks
to inspect one specific proposal.

### `apply_update`

Inputs:

- `proposal_id`.
- `approval_id` or equivalent review record.
- Expected content digest.
- Expected target artifact identifier.

Validation:

- Confirm the proposal is still pending.
- Confirm approval is explicit, current, and bound to the proposal, digest,
  target, and layer.
- Re-resolve the target against the server-owned allowlist. For a
  section-update proposal (the `{proposal, section}` wrapper shape), read the
  target from `proposal.target_file`, not from a top-level field.
- Confirm the target has not changed since review, or require re-review.
- Validate the final content again before writing.

Behavior:

1. If the pending proposal is a section-update proposal -- the
   `{proposal, section}` wrapper shape produced by `propose_section_update`
   and defined in `schemas/section-update-proposal.schema.json`, rather than
   the bare shape -- re-resolve `section.anchor` against the *current* full
   content of the target file before writing anything. Do not trust the
   proposal's stored `section.start_line` or `section.end_line`; they are a
   propose-time snapshot for human review only. Apply the same fail-closed
   anchor rules `propose_section_update` used at proposal time (see
   [docs/mcp-tiered-tool-design.md](../../docs/mcp-tiered-tool-design.md)):
   zero matches or multiple matches both abort the apply with no write, even
   if the anchor resolved cleanly at proposal time. On a single match, splice
   `proposal.proposed_content` into exactly that section's span and leave
   every line outside the span byte-for-byte unchanged. For a bare (full-file)
   proposal, this step does not apply; proceed directly to step 2.
2. Write the approved content -- the spliced full file for a section-update
   proposal, or the proposal's full `proposed_content` otherwise -- to the one
   approved Memory or State target.
3. Verify the resulting content digest. For a section-update proposal this is
   still a whole-file digest of the file after splicing, not a digest scoped
   to the section; see the Digest Scope discussion in
   [docs/mcp-tiered-tool-design.md](../../docs/mcp-tiered-tool-design.md).
4. Archive the pending proposal with its disposition and timestamps.
5. If a companion sidecar metadata file conforming to
   `schemas/pending-sidecar.schema.json` exists for the proposal, delete it as
   part of archiving. The proposal's fate is now fully captured in the applied
   archive record, so the sidecar is no longer needed.
6. Append a minimal audit record.

Outputs:

- Proposal identifier.
- Applied target artifact identifier and layer.
- Applied timestamp.
- Resulting content digest.
- Archive logical identifier.
- Status: `applied`.

`apply_update` must fail closed when approval, target, digest, layer, or current
file state does not match the reviewed proposal.

### `append_session_note`

Inputs:

- `session_id`.
- `note`: bounded plain text.
- Optional synthetic or private source label.

Validation:

- Reject path input and executable content.
- Enforce a maximum note size.
- Do not infer a Memory or State write from the note.

Outputs:

- Session-note logical identifier.
- Appended timestamp.
- Status: `appended`.

This tool writes only to `session-notes/`. It cannot modify Memory, State, or a
pending proposal.

## Approval Flow

Use this sequence:

1. A host calls `propose_update`.
2. The controller stores a pending proposal outside Memory and State.
3. A human reviews the target, layer, proposed content, reason, source summary,
   stale-after handling, and content digest.
4. The human explicitly approves or rejects that specific proposal.
5. The host calls `apply_update` with the bound approval evidence.
6. The controller revalidates the proposal and target.
7. The controller applies the update, archives the proposal, and records the
   outcome.

Approval must not be inferred from:

- The original user request.
- A prior approval for another proposal.
- A model statement that the change looks safe.
- The presence of a proposal in the pending directory.
- A broad setting such as "allow all writes."

Rejected, expired, changed, or mismatched proposals must not be applied.

## Audit And Log Expectations

Keep audit data local to the private runtime and retain only what is useful.
Each controller event should record:

- Timestamp.
- Tool name.
- Proposal or session identifier, when applicable.
- Logical target identifier and layer.
- Decision: allowed, denied, approved, rejected, or applied.
- Content digest rather than full private content when possible.
- Approval identifier for applied updates.
- Error category without credentials, secrets, or unnecessary file content.

Logs must not contain credentials, environment values, raw private files,
complete prompts, confidential exports, or broad directory listings.

Audit logs are private runtime artifacts. Do not commit them to the public
scaffold.

## Public And Private Safety Rules

- Keep the implementation, active configuration, filled Memory, live State,
  pending proposals, approvals, session notes, and logs private.
- Use synthetic examples in public documentation and tests.
- Do not include real employer, manager, peer, sponsor, team, client, or person
  names in public artifacts.
- Do not include workplace paths, screenshots, exports, messages, or internal
  repository details.
- Do not process credentials, regulated data, or confidential document stores.
- Do not expose shell, network, delete, recursive scan, or arbitrary path
  capabilities.
- Treat MCP output as evidence requiring classification and review.
- Require a separate approved proposal when moving a durable lesson from State
  into Memory.

## Validation Checklist

- [ ] One approved private root is configured outside the public scaffold.
- [ ] Memory and State use separate directories and file allowlists.
- [ ] Pending and archive directories are outside Memory and State.
- [ ] All paths are canonicalized and checked for root containment.
- [ ] Path traversal, symbolic-link escapes, and arbitrary absolute paths fail.
- [ ] `read_index` reads only allowlisted text artifacts.
- [ ] `propose_update` cannot modify Memory or State.
- [ ] `list_pending` returns bounded review metadata.
- [ ] `apply_update` is the only Memory or State write path.
- [ ] `apply_update` requires proposal-specific explicit approval.
- [ ] State proposals require stale-after or review handling.
- [ ] Applied and rejected proposals receive an archived disposition.
- [ ] `append_session_note` writes only to session notes.
- [ ] Shell, network, delete, credential, and broad-scan capabilities are absent.
- [ ] Audit records avoid unnecessary private content.
- [ ] Public tests and documentation use synthetic data only.

## Synthetic Example Flow

This example uses no real person, workplace, path, or private content.

1. `read_index` reads the approved synthetic State artifact
   `current-work`.
2. The host identifies that the synthetic next action changed.
3. `propose_update` creates proposal `proposal-001` for the State artifact. The
   proposal includes a synthetic stale-after date and reports
   `pending_review`.
4. The reviewer inspects the proposal, confirms that it belongs in State, and
   approves its exact target and digest.
5. `apply_update` verifies the approval, updates only the allowlisted State
   artifact, archives `proposal-001`, and records the applied digest.
6. A possible durable lesson is handled separately. The host creates a new
   Memory proposal, which requires its own review and approval.

At no point does `propose_update` edit Memory or State, and no broad filesystem
access is granted.
