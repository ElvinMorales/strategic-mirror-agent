# Private Instance Guide

## Purpose

This guide explains how to create a private runtime instance from the public
Strategic Mirror Agent scaffold.

The public repo is the reusable scaffold: direction, templates, policies,
schemas, synthetic examples, guardrails, connector policy docs, validation, and
public-safe examples. The private runtime instance is where real user context
may live, under the user's own storage, approval, and privacy boundaries.

This is a documentation pattern only. It does not add live connectors,
credential handling, private data copying, runtime features, or workplace
examples.

## Public Scaffold Vs Private Runtime Instance

Use the public scaffold for reusable agent design:

- Agent identity, methodology, and voice rules.
- Prompt templates and task instructions.
- Memory and State templates.
- Connector policy and registry templates.
- Guardrails, schemas, validation, and synthetic examples.

Use a private runtime instance for real personal context:

- Filled Memory files.
- Live State files for active situations.
- Private references and local notes.
- Local connector allowlists and local-only connector config.
- Draft outputs, if they contain private context.
- Runtime traces, only if you choose to keep them privately.

Do not turn the public scaffold into an operating folder. If a file contains
private context, live work status, credentials, raw exports, or real workplace
material, it belongs outside this repo.

## Before You Copy Anything

Choose a private storage boundary before adding real context:

1. Decide whether the private instance will be a local folder, an encrypted
   folder, or a private repository.
2. Confirm that the private location is not nested inside the public scaffold.
3. Confirm that backups, sync tools, and repository remotes match your privacy
   expectations.
4. Create a local `.gitignore` before adding filled Memory or State.
5. Start with manual context. Do not configure connectors until the file-first
   workflow is useful.

Safety checklist before adding real Memory or State:

- The private folder is outside the public repo.
- The private folder is either not a Git repo or is a private repo.
- `.env`, local connector config, Memory, State, drafts, traces, exports, and
  screenshots are ignored or intentionally private.
- You have reviewed the public safety rules in `docs/public-safety.md`.
- You understand the Memory and State split in `docs/memory-vs-state.md`.
- You will store summaries, decisions, and approved context rather than raw
  message dumps.
- You will not add regulated data, confidential documents, credentials, or
  private workplace screenshots.
- You will review every proposed Memory or State entry before saving it.

## Recommended Private Folder Structure

This structure is an example for a private instance only. Do not commit it to
the public scaffold.

```text
strategic-mirror-private/
|-- README.md
|-- memory/
|   |-- profile.md
|   |-- relationships.md
|   `-- principles.md
|-- state/
|   |-- current-work.md
|   |-- open-decisions.md
|   `-- timeline.md
|-- knowledge/
|   `-- private-references/
|-- connectors/
|   |-- approved-sources.md
|   `-- connectors.local.yaml
|-- outputs/
|   `-- drafts/
|-- traces/
|   `-- .gitkeep
`-- .env
```

Recommended ownership:

- `memory/` stores durable, slowly changing context.
- `state/` stores fast-changing execution context for active situations.
- `knowledge/private-references/` stores reusable private references that are
  not personal Memory and not live State.
- `connectors/` stores local allowlists and private connector config, if any.
- `outputs/drafts/` stores drafts that may contain private context.
- `traces/` stores private runtime traces only when you explicitly need them.
- `.env` stores local environment values only in the private instance.

## Copy Steps

Create the private folder first, outside the public scaffold:

```bash
mkdir strategic-mirror-private
cd strategic-mirror-private
mkdir memory state knowledge connectors outputs traces
mkdir knowledge/private-references outputs/drafts
```

Copy only templates and public-safe reference files that you need:

```bash
cp ../strategic-mirror-agent/agent/memory/profile.template.md memory/profile.md
cp ../strategic-mirror-agent/agent/memory/relationships.template.md memory/relationships.md
cp ../strategic-mirror-agent/agent/memory/principles.template.md memory/principles.md
cp ../strategic-mirror-agent/agent/state/current-work.template.md state/current-work.md
cp ../strategic-mirror-agent/agent/state/open-decisions.template.md state/open-decisions.md
cp ../strategic-mirror-agent/agent/state/timeline.template.md state/timeline.md
cp ../strategic-mirror-agent/agent/connectors/connector-registry.template.yaml connectors/connectors.local.yaml
```

If you prefer a private repository, initialize it only after adding a
private-instance `.gitignore`:

```bash
git init
git status --short
```

Before the first commit in a private repo, inspect `git status --short` and
confirm that no filled Memory, live State, `.env`, local connector config,
drafts, traces, exports, screenshots, or raw logs are staged.

## What To Fill In First

Start small. The first private session should work from a few reviewed facts,
not a large archive.

Fill in this order:

1. `memory/profile.md`: one or two stable communication preferences, working
   style notes, or durable goals.
2. `memory/principles.md`: one or two durable decision principles that should
   influence drafts and tradeoff analysis.
3. `state/current-work.md`: one active situation with owner, status, next
   action, uncertainty, and stale-after date.
4. `state/open-decisions.md`: one current decision only if the session needs it.
5. `knowledge/private-references/`: short summaries of reusable references,
   only if they are approved for private retention.
6. `connectors/approved-sources.md`: a manual allowlist of sources you may
   consult later. This is not a connector implementation.

Do not begin by importing chat logs, inbox exports, calendar exports, document
dumps, screenshots, or raw traces.

## Memory Setup

Memory is durable, slowly changing context. Add something to Memory only if it
would still be useful in three months after the live situation ends.

Good Memory candidates:

- Stable communication preferences.
- Durable career goals.
- Recurring strengths, risks, or traps.
- Long-running collaboration patterns.
- Principles that should shape repeated decisions.

Memory review standard:

- Use the shortest useful summary.
- Include source, confidence, date added, review cadence, privacy sensitivity,
  and public-use permission.
- Avoid raw quotes from real workplace messages.
- Avoid one-off emotional spikes or temporary status.
- Do not store full message threads, private logs, regulated data, or
  confidential documents.
- Treat relationship entries as sensitive. Use real names only inside the
  private instance and only when necessary.

If the context is useful only for a live deadline, decision, or workflow, put it
in State instead.

## State Setup

State is fast-changing execution context. Add something to State only if it is
tied to an active situation, deadline, decision, workflow, risk, or next action.

Good State candidates:

- Active work items.
- Pending replies.
- Open decisions.
- Near-term deadlines.
- Recent developments.
- Current risks, uncertainty, and assumptions.
- Next actions.

State review standard:

- Every State entry should have a stale-after date or review trigger.
- Keep State factual and brief.
- Link to related Memory by label or short reference, not by copying large
  private blocks.
- Record uncertainty explicitly instead of treating assumptions as facts.
- Remove, archive, or convert State when the situation ends.

When a live pattern becomes durable, propose a separate Memory update and
review it before saving. Do not silently promote State into Memory.

## Knowledge And Private References

Knowledge stores reusable reference material that is neither personal Memory nor
live State.

Use `knowledge/private-references/` for private summaries such as:

- Reusable frameworks you are allowed to store privately.
- Sanitized notes that support repeated communication work.
- Personal reference summaries that are not tied to one live situation.

Do not store proprietary documents, confidential internal screenshots, raw
message exports, regulated data, or materials you are not allowed to retain.
When in doubt, write a short private summary instead of copying the source.

Classification test:

- If it is a durable personal preference, goal, relationship pattern, or
  recurring lesson, consider Memory.
- If it is tied to a live deadline, decision, risk, or workflow, use State.
- If it is reusable reference material but not personal context, use Knowledge.
- If it is raw, confidential, regulated, or unnecessary to retain, store it
  nowhere.

## Connector Setup, Local Only

Start with Tier 0 manual input. The core agent works from plain files and
manually supplied context.

Connector guidance for a private runtime:

- Keep connector configs only in the private instance.
- Use local-only filenames such as `connectors/connectors.local.yaml`.
- Keep credentials in `.env` or the host secret store, never in Markdown or
  connector YAML.
- Use explicit source allowlists in `connectors/approved-sources.md`.
- Prefer read-only sources before any draft creation or external action.
- Treat connector-fed content as evidence to classify and reconcile, not truth
  to absorb.
- Require human approval before connector-fed context changes Memory or State.
- Require explicit human approval at the moment of any external side effect.

Claude Desktop may be used as the local interface for a private instance, with
a local MCP server acting as a controlled file-access layer. Keep that server
inside the same private runtime boundary. It should expose only narrow,
allowlisted operations against the approved private agent folder.

Use this governance sequence for Memory and State:

```text
propose update → review pending update → apply approved update
```

The proposal step writes a reviewable pending artifact, not Memory or State.
The apply step is the only operation allowed to modify Memory or State, and it
requires explicit approval for the specific proposal and destination.

Broad file access is not part of this pattern. Do not point a local MCP server
at a full work drive, Desktop, Downloads, a OneDrive or SharePoint sync root, a
broad documents folder, an internal repository, an email export folder, a
credential folder, or a confidential document folder.

The public-safe
[Memory/State MCP controller contract](../agent/templates/mcp-memory-state-controller.md)
defines recommended tools, folder boundaries, approval flow, audit
expectations, and validation checks. It is a contract template, not runtime
server code.

Do not add live connector implementation, credentials, private connector config,
or real workplace system details to the public scaffold.

## What Not To Store

Do not store these in the public scaffold or in any shared location:

- Real workplace messages.
- Real employer, manager, peer, sponsor, team, client, or workplace details.
- Private Memory stores.
- Live State files from active situations.
- Raw traces or observability data from private use.
- Connector credentials.
- Environment values.
- Local secrets.
- Private connector configs.
- Raw email, calendar, chat, or document exports.
- Chat logs, screenshots, or real message drafts.
- Regulated data or confidential material.
- Internal screenshots or proprietary documents.

Even in a private instance, avoid storing raw material unless there is a clear
reason, approval, and retention boundary. Prefer concise reviewed summaries.

## Keeping Private Files Out Of Git

If the private instance is not a Git repo, Git cannot commit it. This is the
simplest setup.

If the private instance is a private Git repo:

1. Add a `.gitignore` before adding private files.
2. Run `git status --short` before every commit.
3. Stage intentionally, not with broad patterns.
4. Keep `.env`, local connector configs, Memory, State, drafts, traces, exports,
   screenshots, and logs ignored unless you have a specific private-retention
   reason.
5. Never push a private runtime remote to the public scaffold repository.

If you accidentally stage private content, unstage it before committing:

```bash
git restore --staged path/to/private-file
```

If private content was committed or pushed, treat it as an incident. Remove the
content, rotate any affected credentials, and consider rewriting history
according to your own repository and storage policy.

## Example Local-Only `.gitignore`

This example is for a private runtime instance. It is not a requirement for the
public scaffold.

```gitignore
.env
.env.*
connectors.local.yaml
connectors/*.local.yaml
memory/*.md
state/*.md
knowledge/private-references/**
outputs/drafts/**
traces/**
exports/**
screenshots/**
*.log
```

Adjust the ignore rules if you intentionally version sanitized private summaries
inside a private repo. Do not use these rules as permission to store private
material in the public scaffold.

## First-Run Checklist

Before the first private session:

- Confirm the private folder is outside the public scaffold.
- Confirm `.env` exists only in the private instance, if needed.
- Confirm local connector config is ignored or absent.
- Add only the minimum useful Memory and State.
- Give every State entry a stale-after date or review trigger.
- Review Memory entries for source, confidence, privacy sensitivity, and
  public-use permission.
- Confirm no raw exports, logs, screenshots, chat transcripts, or real message
  dumps are present.
- Start from manual context, not a connector.
- Ask the agent to propose Memory or State updates instead of writing them
  automatically.
- Review the output for confidentiality, tone, claims, and boundary risks before
  using it.

For the first prompt, provide a short manual summary of the situation, the
desired output, known constraints, and any uncertainty. Do not paste a full
thread unless there is a clear private-retention reason and the content is
allowed in your private environment.

## Ongoing Maintenance Checklist

Use this checklist regularly:

- Review State entries and remove stale items.
- Update stale-after dates when an active situation remains open.
- Promote only durable, reviewed lessons from State into Memory.
- Archive or delete drafts that are no longer needed.
- Review connector allowlists before adding new sources.
- Keep credentials in `.env` or a secret store, not in docs.
- Run `git status --short` before commits in any private repo.
- Keep the public scaffold free of private operation files.

## When To Create A Fresh Focused Chat Or Handoff

Create a fresh focused chat or handoff when:

- The active situation changes materially.
- A decision has been made and the old State is stale.
- The session context has become crowded with outdated assumptions.
- You need a clean review of a draft, decision, or boundary.
- You are moving from exploration to execution.

A good handoff includes:

- The current goal.
- The minimum relevant Memory references.
- The current State entries with stale-after dates.
- Open decisions, risks, and uncertainty.
- Any connector-fed context, clearly labeled and approved for use.
- What should not be retained after the session.

## Public Repo Contribution Reminder

Before contributing back to the public scaffold, check every changed file for:

- Real workplace messages or details.
- Private Memory or live State.
- Raw traces, logs, exports, screenshots, or drafts.
- Credentials, environment values, local secrets, or private connector config.
- Regulated data, confidential material, or internal documents.

Public contributions should contain scaffold improvements only: templates,
policies, schemas, synthetic examples, validation, and public-safe docs.
