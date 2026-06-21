# Roadmap: v0.2.0

Status: Draft planning note

## Purpose

This note defines the likely shape of `v0.2.0` so future work does not expand
randomly. It is a planning artifact for the next useful public release after
`v0.1.0`, not a rewrite and not an implementation plan for private runtime
features.

## Release Thesis

`v0.2.0` should make the scaffold easier to understand, evaluate, adapt, and
discuss publicly without adding live runtime complexity.

## Must-Have Scope

1. Walkthrough quality
   - Add at least one additional public-safe walkthrough or expand the current
     walkthrough coverage so a new reader can follow the scaffold more easily.
2. Eval coverage
   - Add more synthetic eval cases or refine the rubric where current cases do
     not fully exercise voice, boundary, connector, Memory, State, or
     public-safety behavior.
3. Schema and example clarity
   - Expand schema examples only where they clarify intended usage, validation
     expectations, or common public-safe record shapes.
4. Public communication package
   - Draft README, release, and public announcement material that explains the
     scaffold clearly without implying workplace endorsement.
5. Documentation audit
   - Do a light navigation pass after the sprint work lands so readers can find
     the release note, artifact map, private instance guide, walkthroughs,
     schema examples, evals, and decision records.

## Maybe-Later Scope

- Optional private-instance helper script, limited to scaffold copying or
  checklist generation and with no private data handling.
- Additional connector adapter examples with no live integrations, no
  credentials, no external side effects, and mock-only behavior.
- Additional schema variants if real reader confusion appears.
- Host-specific mapping expansion, while keeping the repo framework-neutral.
- Visual diagrams that clarify the artifact map or release flow.
- Packaging or template export if the scaffold becomes easier to reuse that
  way.

## Explicit Non-Goals

- No live connectors.
- No hosted runtime.
- No SDK implementation.
- No credentials or private connector configs.
- No private Memory.
- No live State.
- No raw traces.
- No employer-specific examples.
- No broad framework endorsement.

## Candidate Issue Links

Landed foundation:

- #2 Add visual artifact map.
- #3 Add private instance starter guide.
- #4 Add public-safe walkthrough example.
- #5 Add issue templates.
- #6 Add pull request template.
- #7 Add connector adapter decision record.
- #8 Add eval cases for bad behavior.
- #9 Add schema examples directory.
- #10 Add framework mapping notes.

Follow-up issues to create after this roadmap:

- Docs navigation audit.
- Second walkthrough example.
- Public communication package for README, release notes, and launch or post
  copy.
- Optional helper script spike.
- Connector adapter example, no live integration.

Do not create these follow-up issues in this PR.

## Public/Private Safety Notes

`v0.2.0` remains public scaffold work. It may improve templates, docs, synthetic
examples, evals, schemas, release notes, and public communication, but it should
not turn the repository into a private runtime.

Private runtime guidance may improve, but private runtime contents do not
belong in this repo. Filled Memory, live State, private references, drafts,
credentials, local environment values, raw traces, and private connector config
must stay outside the public scaffold.

Connector examples, if added later, must remain synthetic, disabled or
mock-only, credential-free, and without external side effects. Connector
material should continue to describe adapter posture, classification,
reconciliation, approval, and guardrail expectations.

Public communication should avoid employer-specific claims, real workplace
details, private examples, and any implication that a workplace, manager, team,
client, or platform endorses this scaffold.

## Validation And Release Checklist

- [ ] `npm run validate`
- [ ] `git diff --check`
- [ ] Public-safety review completed.
- [ ] Issue links reviewed.
- [ ] No live connectors added.
- [ ] No private runtime material added.
- [ ] Changelog updated.
- [ ] Release notes drafted before tagging.
- [ ] README and docs navigation reviewed.

## Open Questions

- Which second walkthrough would best demonstrate the scaffold without adding
  private or employer-specific context?
- Which eval gaps are most important for `v0.2.0`: connector safety, boundary
  protection, Memory and State separation, or public communication quality?
- Should schema examples stay minimal, or should they include more complete
  synthetic records for reader onboarding?
- Is a private-instance helper script useful enough to justify the extra safety
  review, or should `v0.2.0` keep private setup as documentation only?
- What should the public communication package include beyond README updates,
  release notes, and announcement copy?
