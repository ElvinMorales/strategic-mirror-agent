# Strategic Mirror Agent v0.2.0 Release Notes

Date: 2026-06-21

## Summary

`v0.2.0` is a docs/scaffold release hardening pass for Strategic Mirror Agent.
It makes the public repo easier to inspect, adapt, validate, and communicate
without turning the scaffold into a production product, hosted app, or live
connector implementation.

The release keeps the same public/private boundary as `v0.1.0`: the public repo
contains reusable scaffold material, while real workplace context belongs only
in a separate private runtime.

## What Changed Since v0.1.0

- Added a visual artifact map for the 14-bucket taxonomy alignment.
- Expanded the private instance guide with setup, copy, Git safety, local-only
  connector guidance, and first-run checklists.
- Added a public-safe walkthrough example for a workplace boundary-setting
  message.
- Added GitHub issue and pull request templates for artifact, docs, eval,
  validation, and public-safety reviews.
- Added negative eval cases for voice, Memory/State, connector, boundary,
  public-safety, and psychoanalysis failure modes.
- Accepted the connector adapter ADR.
- Added valid schema examples for Memory, State, connector registry, and
  response outputs.
- Added framework mapping notes for common host adaptation patterns.
- Added the `v0.2.0` roadmap.
- Completed a docs navigation audit.
- Added the install guide for Claude web, Claude Code, and local Markdown
  workflows.
- Added the public communication package.
- Added the release prep checklist.

## Public-Safety Boundaries

This release contains public-safe scaffold material only. It must not include:

- Real employer names.
- Real manager, peer, sponsor, team, client, or workplace details.
- Real workplace messages.
- Private Memory.
- Live runtime State.
- Raw traces.
- Connector credentials.
- Local environment values.
- Private connector configs.
- Regulated data.
- Confidential documents.
- Internal screenshots.

The release also does not imply production readiness, hosted app availability,
live connector availability, employer endorsement, or workplace deployment.

## What Is Intentionally Not Included

- No hosted app.
- No production runtime.
- No live connectors or integrations.
- No email, calendar, chat, or document integration.
- No SDK implementation.
- No credential handling.
- No private Memory.
- No live State.
- No raw traces.
- No real workplace examples.
- No external publication, GitHub Release, or release tag from this PR.

## Validation Checklist

Before tagging or publishing externally, confirm:

- `package.json` reports `0.2.0`.
- `npm run validate` passes.
- `git diff --check` passes.
- The changelog has a clear `0.2.0` section.
- Docs navigation links to these release notes.
- Public-safety review finds no private or workplace-specific material.
- GitHub Release creation, tagging, repository settings, and external posting
  remain manual follow-up steps after merge.

## Recommended Next Steps After Release

- Manually create the `v0.2.0` tag and GitHub Release only after final review.
- Re-run the public-safety checklist before any external announcement.
- Use the public communication package as draft material, not automatic
  publication approval.
- Keep future connector work adapter-layer only, synthetic or private, and free
  of credentials or external side effects.
- Continue improving eval coverage and walkthrough clarity without adding real
  workplace content.
