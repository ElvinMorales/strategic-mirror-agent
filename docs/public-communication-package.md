# Public Communication Package

## Purpose

This file collects draft copy for communicating the Strategic Mirror Agent repo
publicly. It is not a release action, launch checklist, external publication,
or approval to post anything outside the repository.

Use it as source material after reviewing the current repo state, public safety
rules, install guide, and release plan. Publication decisions should happen
separately from this documentation change.

## Positioning Summary

One-line description:

Strategic Mirror Agent is a public-safe, file-first scaffold for a personal
workplace communication and career-coaching agent.

Slightly longer description:

Strategic Mirror Agent demonstrates how personal agent behavior can be
organized through addressable, versioned, inspectable artifacts: identity,
operating style, prompts, Memory templates, State templates, guardrails,
connector policy, schemas, examples, evals, and install docs.

Plain-language explanation:

This repo is a set of files that show how a personal workplace communication
agent could be structured before it becomes an app or integration. The useful
part is not a live service. It is the visible structure: what the agent should
do, how it should sound, what it should remember, what should stay temporary,
what it should refuse to store publicly, and how future connectors should be
kept at the edge.

It is intentionally not a hosted app, live connector implementation, SDK, or
production workplace system.

## Audience

This is for:

- People building personal agents responsibly.
- AI builders interested in inspectable agent artifacts.
- Prompt engineers moving toward agent systems.
- AgentOps and AI operations people thinking about governance, Memory, State,
  and evals.
- Technical writers and systems builders who care about reusable docs and
  workflows.

This is not for:

- Someone looking for a hosted app.
- Someone looking for live integrations.
- Someone looking for a production workplace system.
- Someone looking to upload confidential workplace data into a public repo.

## What Is Included

The public scaffold includes:

- Public scaffold files for agent direction, prompts, guardrails, workflows,
  connector policy, templates, schemas, examples, and evals.
- An [install guide](../INSTALL.md) for adapting the scaffold into Claude web,
  Claude Code, or local Markdown workflows.
- [Private instance guidance](private-instance-guide.md) for keeping real
  context outside the public repo.
- A [Memory and State separation guide](memory-vs-state.md) that distinguishes
  durable context from live execution context.
- A [connector adapter policy](decisions/0001-connectors-as-adapters.md) that
  keeps connectors at the implementation edge.
- [Schemas](../schemas/) and
  [valid schema examples](../examples/schema-instances/) for public-safe
  records.
- [Synthetic walkthroughs](../examples/walkthroughs/) that demonstrate intended
  behavior without real workplace material.
- [Evals](../evals/) and a [rubric](../evals/rubric.md) for manual review of
  strategic reasoning, voice, Memory and State separation, confidentiality,
  connector safety, and boundary protection.
- A [roadmap](roadmap-v0.2.0.md), [release notes](release-notes-v0.1.0.md),
  and [changelog](../CHANGELOG.md) for public scaffold iteration.

## What Is Not Included

The public repo intentionally does not include:

- No hosted app.
- No live connectors.
- No email, calendar, chat, or document integrations.
- No SDK implementation.
- No credential handling.
- No private Memory.
- No live State.
- No raw traces.
- No workplace-specific implementation.
- No employer endorsement.

It also should not contain real workplace messages, private notes, internal
screenshots, regulated data, confidential documents, connector credentials,
local environment values, or private connector configs.

## Suggested GitHub Release Note Draft

Title:

Strategic Mirror Agent public scaffold v0.1.0

Draft:

This release publishes the initial public scaffold for Strategic Mirror Agent,
a file-first personal workplace communication and career-coaching agent.

The repo is not a hosted app or production workplace system. It is a
public-safe scaffold that organizes agent behavior into inspectable files:
identity, operating style, prompts, Memory templates, State templates,
guardrails, connector policy, schemas, synthetic examples, evals, and install
docs.

Start here:

- Read [README.md](../README.md) for the repo overview.
- Read [INSTALL.md](../INSTALL.md) for private setup paths using Claude web,
  Claude Code, or local Markdown.
- Review [Public safety](public-safety.md) and
  [Private instance guide](private-instance-guide.md) before adding any real
  context.

What is included:

- Public-safe scaffold files and documentation.
- Memory and State templates with separation guidance.
- Connector policy and adapter-layer decision record.
- JSON schemas and valid schema examples.
- Synthetic walkthroughs and sample requests.
- Eval cases, rubric, and local validation scripts.
- Release notes, roadmap, and changelog.

What is intentionally not included:

- No hosted app.
- No live connectors or integrations.
- No SDK implementation.
- No credential handling.
- No private Memory, live State, raw traces, or workplace-specific content.
- No claim of production readiness.

All examples are synthetic and public-safe. Real workplace context belongs only
in a separate private instance, under the user's own storage, approval, and
privacy boundaries.

## LinkedIn Post Draft

I have been working on Strategic Mirror Agent, a public-safe scaffold for a
personal workplace communication and career-coaching agent.

This is a scaffold, not a product.

There is no hosted app, no live connector, no inbox integration, and no
production claim hiding in the fine print. The interesting part is the file
structure and the boundaries.

The repo treats an agent as more than a prompt. It breaks behavior into
addressable artifacts:

- identity
- operating style
- task prompts
- Memory templates
- State templates
- guardrails
- connector policy
- schemas
- synthetic examples
- evals
- install docs

That sounds boring, which is partly the point.

If agents are going to become useful in personal and professional workflows,
their behavior needs to be easier to inspect, adapt, and govern. A giant prompt
blob can work for a while, but it gets hard to review. It also gets fuzzy about
what belongs in durable Memory, what belongs in temporary State, what should be
ignored, and what should never leave a private environment.

Strategic Mirror Agent is my attempt to make those boundaries concrete in a
small public repo.

The public scaffold includes docs, templates, schemas, examples, evals, and a
connector policy. It intentionally does not include private Memory, live State,
raw traces, credentials, workplace examples, or live integrations.

The current version is useful if you are thinking about personal agents,
agent operations, prompt systems that are turning into agent systems, or just
how to make AI behavior less mysterious before anyone starts wiring it into
real tools.

The practical thesis:

Agents need more than prompts. They need addressable, versioned, inspectable
artifacts.

## Short Social Post Variant

I have been working on Strategic Mirror Agent, a public-safe, file-first
scaffold for a personal workplace communication and career-coaching agent.

It is not a product or hosted app. The useful part is the structure: identity,
operating style, prompts, Memory, State, guardrails, connector policy, schemas,
examples, evals, and install docs.

The thesis is simple: agents need more than prompts. They need addressable,
versioned, inspectable artifacts.

## Substack Or Field-Note Outline

Title options:

- Agents Need More Than Prompts
- A File-First Scaffold For A Personal Agent
- The Boring Parts Of Agents Are The Useful Parts

Thesis:

A useful personal agent is not just a clever prompt. It needs inspectable
artifacts for identity, operating style, Memory, State, guardrails, tools,
schemas, examples, evals, and iteration. File-first scaffolds make those
boundaries easier to review before anyone adds live integrations.

Section outline:

1. The prompt is not the system
   - Prompts are important, but they are not enough to govern durable behavior.
   - Agent behavior needs parts that can be named, reviewed, and changed.
2. Why file-first matters
   - Files are boring, inspectable, diffable, and easy to copy into private
     runtimes.
   - The public repo can show structure without holding private context.
3. Memory is not State
   - Memory should be durable and reviewed.
   - State should be live, temporary, and stale-after aware.
   - Mixing them creates bad behavior and bad privacy habits.
4. Connectors are adapters, not identity
   - Live integrations can be useful later, but they should not define the
     agent's role, voice, or authority.
   - Connector output should be treated as evidence, not truth.
5. Public-safe examples and evals
   - Synthetic examples make behavior reviewable without leaking real context.
   - Evals should test boundaries, not only task completion.
6. What Strategic Mirror Agent is and is not
   - It is a scaffold for a personal workplace communication agent.
   - It is not a hosted app, live connector, SDK, or production workplace
     system.

What to avoid:

- Do not imply this is production software.
- Do not imply employer endorsement.
- Do not include real workplace examples.
- Do not frame this as a universal agent architecture.
- Do not overstate connector readiness.
- Do not turn the post into a launch announcement if no release is being
  published yet.

Likely closing note:

The useful work may be less glamorous than the demos: naming the artifacts,
separating Memory from State, keeping connectors at the edge, and making agent
behavior boring enough to inspect.

## Repo Description About Copy

GitHub About description:

A file-first scaffold for a personal workplace communication agent, with
separated Memory, State, guardrails, connector policy, schemas, evals,
examples, and install docs.

Slightly longer portfolio blurb:

Strategic Mirror Agent is a public-safe scaffold for a personal workplace
communication and career-coaching agent. It demonstrates how agent behavior can
be organized through versioned files for identity, operating style, prompts,
Memory, State, guardrails, connector policy, schemas, examples, evals, and
private setup guidance. It is intentionally not a hosted app, live connector
implementation, SDK, or production workplace system.

Suggested topics:

See the next section for GitHub topic suggestions.

## Suggested GitHub Topics

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

## Public Safety Review Checklist

- [ ] No employer-specific content.
- [ ] No private Memory.
- [ ] No live State.
- [ ] No raw traces.
- [ ] No credentials.
- [ ] No private connector configs.
- [ ] No workplace examples.
- [ ] No regulated or confidential data.
- [ ] No screenshots.
- [ ] No overclaiming production readiness.
- [ ] No implication of employer endorsement.

## Notes Before Publishing

Publish externally only after reviewing:

- Repo links.
- Install guide.
- Public safety.
- Absence of employer references.
- Claims that could exceed what the repo actually contains.
- Whether to tag a release first.

This file is draft communication material. It should be reviewed against the
current repository state before any release note, social post, field note, or
repo description is used outside the repo.
