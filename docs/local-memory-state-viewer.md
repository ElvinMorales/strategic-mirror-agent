# Local Memory/State Viewer Specification

## Purpose

This specification defines a public-safe pattern for a local HTML viewer over
private Strategic Mirror Agent artifacts. The viewer helps a user inspect what
the private agent currently knows, what is active, which updates await review,
what recent sessions recorded, and which hygiene issues need attention.

The governing relationship is:

```text
Markdown source of truth → controlled MCP update flow → read-only local viewer
```

The private Markdown and governed artifact files remain the source of truth.
The viewer is an observability and review surface derived from those files. It
must not become a second data store or an alternate write path.

This public scaffold documents the pattern only. It does not include a runtime
viewer, private viewer output, or access to any private instance.

## Scope And Boundaries

The MVP viewer is:

- Read-only.
- Local/private-runtime oriented.
- An observability and review surface.
- Derived from approved private artifacts.
- Regenerable from the source files.

The viewer is not:

- The canonical data store.
- An MCP server.
- A live connector.
- A direct Memory or State editor.
- A hosted application.
- An authorization or approval system.
- A replacement for the governed update workflow.

The viewer may display approval status, but it must not interpret display as
approval. It may show a proposed change, but it must not apply that change.

## Source-Of-Truth Artifacts

A private implementation may read from an explicitly approved subset of these
logical directories:

```text
memory/
state/
outputs/pending/ or updates/pending/
outputs/applied/ or updates/applied/
logs/ or session-notes/
```

Use one configured convention for pending updates, one for applied updates, and
one for session records. Do not scan multiple possible directories
dynamically. The implementation should map logical artifact identifiers to an
allowlist rather than accept arbitrary paths.

The viewer must not write to any source directory. Generated files should go to
a separate private output directory such as `viewer/`, which should be treated
as derived output and excluded from the public scaffold.

## Relationship To MCP Governance

The existing
[Memory/State MCP controller contract](../agent/templates/mcp-memory-state-controller.md)
defines the controlled private-runtime boundary. The
[Memory/State update proposal schema](../schemas/memory-state-update-proposal.schema.json)
defines inspectable Memory, State, and session-note proposal records.

The viewer must not bypass either boundary. It may read approved summaries or
proposal metadata, but Memory and State changes remain governed by:

```text
propose update → review pending update → apply approved update
```

If a future viewer adds write-oriented controls, those controls must invoke
that governed flow. They must not mutate `memory/` or `state/` from browser
code, form handlers, a local HTTP route, or generated JavaScript.

Direct browser-to-Memory/State mutation is explicitly out of scope and unsafe.
It would bypass proposal-specific review, approval binding, target validation,
content-digest checks, and the Memory-versus-State classification boundary.

## Read-Only MVP Panels

### 1. Memory

The Memory panel shows durable, slowly changing private context summaries.
Depending on the files present, it may include:

- Profile summaries.
- Relationship summaries.
- Principles.
- Durable themes, preferences, goals, strengths, risks, or recurring patterns.
- Last-reviewed or last-updated markers when the source includes them.
- Review cadence, confidence, or privacy sensitivity when present.

The panel should preserve source labels and avoid presenting inferred content
as a stored fact. It should not mix active State items into Memory.

### 2. State

The State panel shows active and temporary execution context. Depending on the
files present, it may include:

- Current work.
- Open decisions.
- Timeline entries.
- Stale-after dates or review triggers.
- Active follow-ups and next actions.
- Status, priority, owner, uncertainty, or deadlines when present.

The panel should make stale or overdue items visible without silently
archiving, extending, or converting them. A durable lesson identified in State
still requires a separate Memory proposal.

### 3. Pending Updates

The Pending Updates panel shows governed proposal metadata needed for review.
It may include:

- Proposal filename or logical identifier.
- Target file or logical target.
- Memory, State, or session-note classification.
- Privacy risk rating.
- Approval status.
- Created, review-by, reviewed, or applied dates when present.
- Operation, rationale summary, stale-after handling, and content digest when
  available.

The panel must keep Memory and State classifications explicit. A proposal that
targets or combines both layers should be flagged as invalid rather than
rendered as a normal proposal.

Showing an approval status does not grant approval. The viewer must not offer
an apply action in the MVP.

### 4. Recent Session Notes

The Recent Session Notes panel shows bounded records from approved session-note
or log artifacts. It may include:

- Session summaries.
- Decisions made.
- Follow-ups.
- Memory candidates.
- State candidates.
- Privacy concerns.
- Session and creation identifiers when present.

Memory and State candidates are observations for separate review. Their
presence in a session note must not be treated as a proposal or approval.

Raw traces, complete prompts, broad logs, credentials, and unreviewed exports
must not be loaded into the viewer.

### 5. Hygiene Warnings

The Hygiene Warnings panel reports operational conditions without modifying
source files. At minimum, the MVP should detect:

- State items past their stale-after dates.
- Pending updates older than a configurable threshold.
- Memory, State, or proposal records with missing review dates when the local
  policy expects them.
- High privacy-risk proposals.
- Empty required files.
- Proposals that try to mix Memory and State.
- Session notes with possible Memory or State candidates but no separate
  proposal.

Warnings should identify the logical source artifact and explain the condition.
They should not rewrite dates, approve proposals, create proposals, promote
State into Memory, or delete stale records.

Thresholds and required-marker rules belong in private local configuration.
The public specification must not include real local paths, private filenames,
or environment values.

## Recommended Architecture

### Level 1: Static Generated Viewer

The safest first implementation is a private local build step:

```text
scripts/build-viewer.mjs
  ↓
viewer/index.html
```

The script reads only configured, allowlisted private artifacts, normalizes
their content, calculates hygiene warnings, escapes rendered values, and writes
a static HTML file.

Pros:

- Simplest implementation.
- No server.
- No live file access from the browser.
- Safest first step.
- Easy to inspect and review.

Cons:

- Refresh requires rerunning the build script.

`viewer/index.html` is private derived output. Do not commit real generated
viewer output to the public scaffold.

### Level 2: Local-Only Viewer Server

A later implementation may use a localhost server to read approved private
files on demand.

Pros:

- Easier refresh.
- Can support filters and search.

Cons:

- Requires more security review.
- Adds more moving parts and a persistent process.
- Creates HTTP, caching, browser, and origin-handling concerns.

The server should bind only to loopback interfaces, expose no write routes,
retain the same artifact allowlist, and remain read-only at first. Localhost is
not by itself an authorization boundary.

### Level 3: MCP-Backed Viewer

A later viewer may rely on the governed MCP controller or a small local bridge
to retrieve approved summaries.

Pros:

- Reuses the controlled access boundary.
- Avoids duplicating path rules.

Cons:

- Requires more engineering.
- Introduces host, protocol, and lifecycle dependencies.
- Should follow stabilization of the controller contract, proposal schema, and
  safety evals.

An MCP-backed viewer remains a viewer, not an MCP server. It should request
approved read results from the controller and should not gain generic file
access.

## Static Build Pipeline

A Level 1 implementation should use a bounded pipeline:

```text
configured logical sources
  → allowlist and containment checks
  → parse approved Markdown or JSON
  → normalize display records
  → calculate warnings
  → escape all displayed values
  → generate private static HTML
```

Recommended requirements:

1. Configure one approved private root outside the public scaffold.
2. Maintain explicit allowlists for Memory, State, proposal, and session-note
   artifacts.
3. Reject path traversal, unexpected absolute paths, symbolic-link escapes,
   binary files, oversized files, and unrecognized file types.
4. Treat all source content as untrusted display input.
5. Escape HTML and attribute values before rendering.
6. Avoid loading remote scripts, styles, fonts, analytics, or network assets.
7. Do not embed credentials, environment values, private connector config, or
   broad directory listings.
8. Keep generated output outside source-of-truth directories.
9. Fail closed on unclear classification or malformed proposal metadata.
10. Report parse failures as warnings without modifying the source artifact.

The static viewer may include small local CSS and JavaScript for presentation,
filters, or sorting. It should not contain code that writes source files,
contacts a hosted service, or opens unrestricted local paths.

## Normalized Display Model

An implementation may normalize heterogeneous Markdown and JSON into an
in-memory display model. This example is synthetic and intentionally small:

```json
{
  "memory": {
    "last_reviewed": "2026-07-01",
    "items": [
      {
        "id": "communication-preferences",
        "summary": "Prefers recommendation first, explanation second."
      }
    ]
  },
  "state": {
    "items": [
      {
        "id": "synthetic-outline",
        "status": "active",
        "stale_after": "2026-07-15"
      }
    ]
  },
  "pending_updates": [
    {
      "proposal_id": "proposal-state-001",
      "target_layer": "state",
      "approval_status": "pending_review",
      "privacy_risk": "low"
    }
  ]
}
```

This model is derived display data, not a new persistence format. A private
implementation should rebuild it from the source artifacts and avoid treating
cached or embedded copies as canonical.

## Memory And State Boundary Rules

The viewer must preserve the classification rules in
[Memory versus State](memory-vs-state.md):

- Memory is durable, slowly changing context.
- State is temporary context tied to active work, decisions, deadlines, risks,
  or workflows.
- State requires stale-after or review handling.
- A proposal targets one layer.
- A durable lesson from State requires a separate Memory proposal.
- Session-note candidates do not become Memory or State automatically.

The viewer may flag likely classification problems, but it should not
automatically reclassify or move content.

## Public Safety

Public documentation, tests, and examples for the viewer must be synthetic.
Do not publish:

- Real private Memory.
- Live State.
- Real workplace examples.
- Real employer, manager, peer, sponsor, team, client, or person names.
- Internal screenshots.
- Regulated data.
- Confidential documents.
- Raw traces.
- Credentials.
- Local environment values.
- Private connector configuration.
- Real private viewer output.
- Real local paths from a private machine.

Private generated output may itself contain sensitive summaries. Store it
inside the same approved private boundary as the source artifacts, avoid
automatic cloud sync unless explicitly approved, and apply an appropriate
retention policy.

## Taxonomy Alignment

The viewer is not Memory or State itself. It is an interface and observability
layer over governed agent artifacts.

The relevant artifact buckets are:

- Knowledge and resources: approved parsing and display references.
- Memory: durable source artifacts being observed.
- State: active source artifacts being observed.
- Guardrails and governance: read-only behavior, allowlists, and approval
  boundaries.
- Evaluation and observability: panels and hygiene warnings.
- Runtime and deployment: local generation or local-only serving.
- Learning and iteration: review findings that may lead to separate proposals.

## Non-Goals

This specification does not:

- Build a production dashboard.
- Add hosted app behavior.
- Add live connectors.
- Add browser-based direct Memory or State editing.
- Add write actions.
- Add a runtime MCP server.
- Add private viewer output.
- Read actual private Memory or State.
- Create screenshots.
- Define a full UI implementation.

## Acceptance Checklist For A Private MVP

- [ ] Markdown and governed artifacts remain the source of truth.
- [ ] The viewer is read-only.
- [ ] Memory, State, proposals, and session notes use explicit allowlists.
- [ ] Memory and State remain separate in parsing, display, and warnings.
- [ ] Pending proposals remain outside Memory and State.
- [ ] No browser or server route writes to source artifacts.
- [ ] Future writes are explicitly reserved for the governed proposal flow.
- [ ] Hygiene warnings do not mutate or approve anything.
- [ ] Rendered content is escaped and no remote assets are required.
- [ ] Generated output stays private and outside the public scaffold.
- [ ] Public examples and tests use synthetic data only.
