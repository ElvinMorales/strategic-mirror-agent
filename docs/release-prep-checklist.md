# Release Prep Checklist

## Purpose

This checklist prepares the Strategic Mirror Agent repo for public release and
announcement. It helps decide whether to tag and release now, what release
posture to use, what final GitHub Release and social copy to use, and what
public-safety checks must pass before anything external is published.

This file is preparation material only. It is not a release action, does not
create a GitHub Release, does not tag a version, and does not publish anything
outside the repository.

## Release Posture Recommendation

Recommend a docs/scaffold release, likely `v0.2.0`, if local validation passes
and the public-safety review remains clean.

`v0.1.0` covered the initial public scaffold: direction, templates, schemas,
guardrails, connector policy, synthetic examples, evals, and validation. The
post-`v0.1.0` work added the install/readiness layer, stronger navigation,
private instance guidance, framework mapping, schema examples, negative eval
coverage, public communication material, and release preparation.

The exact version should still be confirmed manually before tagging. This
release hardening pass updates `package.json` to `0.2.0`, but release tagging
and GitHub Release creation remain manual after merge.

```markdown
Recommended posture: docs/scaffold release
Recommended tag: v0.2.0, pending final validation
External publication: after release tag and final safety review
```

## What Changed Since v0.1.0

- Added release notes for the initial public scaffold.
- Added a visual artifact map for the 14-bucket taxonomy alignment.
- Expanded the private instance guide with setup, copy, Git, and safety steps.
- Added a public-safe walkthrough for a workplace boundary-setting message.
- Added GitHub issue and pull request templates for review discipline.
- Added negative eval cases for voice, Memory/State, connector, boundary,
  public-safety, and psychoanalysis failure modes.
- Accepted the connector adapter ADR.
- Added valid schema examples for Memory, State, connector registry, and
  response outputs.
- Added framework mapping notes for adapting the scaffold across host
  environments.
- Added the `v0.2.0` roadmap note.
- Completed a docs navigation audit through the docs index.
- Added an install guide for Claude web, Claude Code, and local Markdown
  workflows.
- Added a public communication package with release, social, field-note, and
  repo positioning drafts.

## Public-Safety Review

- [ ] No employer-specific content.
- [ ] No real workplace messages.
- [ ] No real manager, peer, sponsor, team, client, or workplace details.
- [ ] No private Memory.
- [ ] No live State.
- [ ] No raw traces.
- [ ] No credentials.
- [ ] No local environment values.
- [ ] No private connector configs.
- [ ] No regulated or confidential data.
- [ ] No internal screenshots.
- [ ] No production-readiness overclaiming.
- [ ] No implication of employer endorsement.

## Link And Readiness Review

- [ ] `README.md`
- [ ] `INSTALL.md`
- [ ] `docs/README.md`
- [ ] `docs/public-communication-package.md`
- [ ] `docs/release-notes-v0.1.0.md`
- [ ] `docs/roadmap-v0.2.0.md`
- [ ] `docs/public-safety.md`
- [ ] `docs/private-instance-guide.md`
- [ ] `docs/memory-vs-state.md`
- [ ] `docs/framework-mapping.md`
- [ ] `docs/decisions/0001-connectors-as-adapters.md`
- [ ] `examples/README.md`
- [ ] `evals/rubric.md`
- [ ] `CHANGELOG.md`

## Final GitHub Release Draft

Title:

Strategic Mirror Agent public scaffold v0.2.0

Draft:

This release shares the current public scaffold for Strategic Mirror Agent, a
file-first personal workplace communication and career-coaching agent.

The repo exists to make personal agent behavior easier to inspect, adapt, and
govern before adding private context or live integrations. It organizes the
agent into addressable files for identity, operating style, prompts, Memory
templates, State templates, guardrails, connector policy, schemas, synthetic
examples, evals, install guidance, and release notes.

Since the initial `v0.1.0` public scaffold, this version adds the practical
readiness layer: an install guide, expanded private instance guidance, schema
examples, negative eval cases, connector adapter ADR, framework mapping,
roadmap, docs navigation audit, and public communication package.

Start with:

- [README.md](https://github.com/ElvinMorales/strategic-mirror-agent/blob/main/README.md) for the repo overview.
- [INSTALL.md](https://github.com/ElvinMorales/strategic-mirror-agent/blob/main/INSTALL.md) for adapting the scaffold into Claude web,
  Claude Code, or local Markdown workflows.
- [Public safety](https://github.com/ElvinMorales/strategic-mirror-agent/blob/main/docs/public-safety.md) and
  [Private instance guide](https://github.com/ElvinMorales/strategic-mirror-agent/blob/main/docs/private-instance-guide.md) before adding any real
  context.

What is intentionally not included:

- No hosted app.
- No live connectors or integrations.
- No SDK implementation.
- No credential handling.
- No private Memory.
- No live State.
- No raw traces.
- No workplace-specific implementation.
- No production-readiness claim.

All examples are synthetic and public-safe. Real workplace context belongs only
in a separate private instance, under the user's own storage, approval, and
privacy boundaries.

## Final LinkedIn Draft

I have been working on Strategic Mirror Agent, a public-safe scaffold for a
personal workplace communication and career-coaching agent.

This is not a product launch. There is no hosted app, no live connector, no
inbox integration, and no production claim tucked into the footnotes. The
useful part is the structure.

The thesis is simple:

Agents need more than prompts. They need addressable, versioned, inspectable
artifacts.

Strategic Mirror Agent makes that idea concrete in a small public repo. It
breaks agent behavior into files for identity, operating style, task prompts,
Memory templates, State templates, guardrails, connector policy, schemas,
synthetic examples, evals, and install docs.

That sounds a little dry, which is not a bug.

A giant prompt can work for a while, but it gets hard to review. It also gets
fuzzy about what belongs in durable Memory, what belongs in temporary State,
what should be treated as connector evidence, and what should never leave a
private environment.

This scaffold is meant to keep those boundaries visible before anyone wires an
agent into real tools or gives it real context.

The public repo includes docs, templates, schemas, examples, evals, an install
guide, private instance guidance, and connector policy. It intentionally does
not include private Memory, live State, raw traces, credentials, workplace
examples, live integrations, or a production-readiness claim.

It may be useful if you are thinking about personal agents, AgentOps,
governable prompt systems, Memory and State separation, or how to make AI
behavior less mysterious before it becomes infrastructure.

## Final Short Social Draft

Strategic Mirror Agent is a public-safe, file-first scaffold for a personal
workplace communication and career-coaching agent.

It is not a hosted app or production product. The useful part is the structure:
identity, operating style, prompts, Memory, State, guardrails, connector
policy, schemas, examples, evals, and install docs.

The thesis: agents need more than prompts. They need addressable, versioned,
inspectable artifacts.

## Substack / Field-Note Decision

Recommendation: defer.

Publish the GitHub Release and LinkedIn post first if the release goes forward.
Then decide whether the release copy reveals a clear article angle, such as
"Agents need more than prompts" or "The boring parts of agents are the useful
parts." Deferring keeps the first external move focused on the repo itself and
avoids turning a scaffold release into a broader essay before the public
release posture is settled.

## GitHub About And Topics Checklist

Final GitHub About description:

```text
A file-first scaffold for a personal workplace communication agent, with separated Memory, State, guardrails, connector policy, schemas, evals, examples, and install docs.
```

Suggested topics:

- agents
- agent-ops
- ai-agents
- agent-governance
- prompt-engineering
- personal-ai
- memory
- state-management
- evals
- llm-evals
- markdown
- file-first
- workplace-communication
- career-coaching
- public-safety

These are manual repository setting updates unless done separately.

## Manual Publication Checklist

1. Run local validation.
2. Review public-safety checklist.
3. Confirm clean repo state.
4. Confirm release tag/version.
5. Create GitHub Release if chosen.
6. Update GitHub About/topics manually if chosen.
7. Publish LinkedIn post if chosen.
8. Save Substack/field-note outline for later if deferred.
9. Record publication date or release link in a future changelog or release
   note if needed.

## Go / No-Go Decision

- [ ] Go: release/tag now.
- [ ] Go: publish LinkedIn after release.
- [ ] Hold: fix repo links first.
- [ ] Hold: revise public copy first.
- [ ] Hold: defer public posting.
