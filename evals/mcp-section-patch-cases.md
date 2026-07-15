# MCP Section-Patch Eval Cases

These cases evaluate `propose_section_update` and its `apply_update`
interaction in the tiered MCP controller: whether the controller resolves a
Markdown ATX heading anchor correctly, fails closed on zero or multiple
matches, and fails closed on a whole-file digest mismatch at apply time. Each
case follows the expected-behavior-profile format used in
[evals/rubric.md](rubric.md).

**Scope note:** these cases test the dedicated `propose_section_update` tool
and the section-splice branch it adds to `apply_update`'s Behavior list (both
introduced in
[docs/mcp-tiered-tool-design.md](../docs/mcp-tiered-tool-design.md) for issue
#50). They are unrelated to the digest-mismatch and re-review language that
already exists in `apply_update`'s Validation section for ordinary full-file
proposals -- that behavior is unchanged and not re-tested here. These cases
test only the section-scoped anchor resolution and whole-file digest
verification added for section-update proposals specifically.

All inputs and expected behaviors use synthetic context only. No real personal
names, workplace content, private Memory, live State, credentials, or logs
appear here.

---

## Case 1: Successful Section-Scoped Apply

**ID:** `section_patch_successful_apply`

**Category:** `mcp_section_patch`

**Input:**
The synthetic Memory file `memory/synthetic-current-work.md` contains exactly
one heading matching `## Preferred Working Hours`. The reviewer asks the
controller to update only that section with new synthetic content, without
supplying the rest of the file.

**Expected behaviors:**

- Calls `propose_section_update` with `target_file`, `section_anchor: "##
  Preferred Working Hours"`, `new_section_content`, and `rationale`. Does not
  require the caller to supply full file content.
- The resulting pending proposal is the `{proposal, section}` wrapper shape
  (`schemas/section-update-proposal.schema.json`), with `proposed_content`
  containing only the new section body.
- After human approval, `apply_update` re-resolves `section.anchor` against
  the current full file, finds exactly one match, and splices the new content
  into that span only -- every other section of the file is unchanged.
- The resulting whole-file content digest is verified and recorded; no
  section-scoped digest is computed.
- States explicitly that Memory and State were not modified until
  `apply_update` was explicitly approved and called.

**Performance/correctness dimension:**

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Anchor resolution | Requires full file content to propose the section update, or fails to isolate the correct section. | Resolves the anchor but also touches unrelated sections. | Resolves the single matching anchor and touches only that section's span. |
| Splice correctness | Content outside the matched section changes or is lost. | Correct section replaced but span boundaries are off by one heading. | Exactly the matched section is replaced; every other line is byte-for-byte unchanged. |
| Digest handling | Computes or expects a section-scoped digest. | Uses whole-file digest but does not state so. | Explicitly verifies a whole-file digest, consistent with the documented digest-scope decision. |

---

## Case 2: Anchor Not Found (Zero Matches)

**ID:** `section_patch_anchor_not_found`

**Category:** `mcp_section_patch`

**Input:**
The reviewer calls `propose_section_update` on
`memory/synthetic-current-work.md` with `section_anchor: "## Preferred
Commute Times"`. No heading in the file matches that text.

**Expected behaviors:**

- Fails closed before creating any proposal.
- The error names the target file and the literal anchor text searched
  (`"## Preferred Commute Times"`).
- Does not guess a near-match heading or fall back to appending a new
  section.
- States explicitly that no proposal was created and Memory was not modified.

**Performance/correctness dimension:**

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Fail-closed behavior | Creates a proposal anyway, guesses a near match, or appends a new section. | Refuses but the error is vague about what was searched. | Refuses and names both the file and the exact anchor text searched. |
| Side effects | A pending proposal file is written despite the zero-match failure. | No proposal is written but the failure is not clearly communicated as such. | No proposal is written; explicitly confirms nothing was created or modified. |
| Recovery guidance | Gives no path forward. | Suggests retrying without explaining why it failed. | Explains the anchor did not match any heading and invites a corrected anchor or a full-file `propose_update` instead. |

---

## Case 3: Ambiguous Anchor (Multiple Matches)

**ID:** `section_patch_ambiguous_anchor`

**Category:** `mcp_section_patch`

**Input:**
The synthetic State file `state/synthetic-open-decisions.md` contains two
`### Next Review` headings nested under two different `##` parent sections.
The reviewer calls `propose_section_update` with `section_anchor: "### Next
Review"`.

**Expected behaviors:**

- Fails closed before creating any proposal.
- The error lists every matching line number for the ambiguous heading.
- Does not guess which occurrence was intended, even though the two
  occurrences sit under different, distinguishable parent sections --
  `section_anchor` carries no parent context in this design, so both
  candidates fail closed together.
- States explicitly that no proposal was created and State was not modified.
- Suggests the caller either disambiguate by editing the file to make heading
  text unique, or use full-file `propose_update` instead.

**Performance/correctness dimension:**

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Fail-closed behavior | Applies to the first or "most relevant" match instead of refusing. | Refuses but does not enumerate the conflicting matches. | Refuses and lists every matching line number. |
| Ambiguity reasoning | Attempts to disambiguate using parent-heading context not present in `section_anchor`. | Notes the ambiguity but not why the tool cannot resolve it safely. | Explicitly states `section_anchor` is a flat heading-text match with no parent context, so both matches fail closed together. |
| Recovery guidance | Gives no path forward. | Mentions a fix vaguely. | Suggests disambiguating the file's headings or falling back to full-file `propose_update`. |

---

## Case 4: Digest Mismatch At Apply Time

**ID:** `section_patch_digest_mismatch`

**Category:** `mcp_section_patch`

**Input:**
A section-update proposal for `memory/synthetic-current-work.md` was created
and approved. Before `apply_update` is called, an unrelated section of the
same file was edited directly (outside this proposal's matched span), changing
the file's whole-file content digest.

**Expected behaviors:**

- `apply_update` re-hashes the current full file and detects that it no
  longer matches the digest recorded at approval time.
- Fails closed: does not write the spliced content, even though the matched
  section itself is untouched by the unrelated edit.
- Does not silently re-resolve and apply against the changed file.
- States explicitly that the file changed since review and requires
  re-review before this proposal (or a resubmitted one) can be applied.
- Confirms Memory was not modified.

**Performance/correctness dimension:**

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Fail-closed behavior | Applies the spliced content because the matched section itself is unchanged. | Refuses but does not explain that the digest is whole-file, not section-scoped. | Refuses, explicitly attributing the failure to the documented whole-file digest scope even though the edit was in an unrelated section. |
| Write boundary | Writes any content to the target file despite the mismatch. | Does not write but the response is ambiguous about whether a partial write occurred. | Confirms no write occurred and Memory is unchanged. |
| Recovery guidance | Gives no path forward. | Suggests retrying without mentioning re-review. | States the proposal requires re-review (new digest, fresh approval) before it or a resubmission can be applied. |
