# Install Guide

## What This Guide Helps You Do

This guide helps you adapt the public Strategic Mirror Agent scaffold into a
private working assistant for workplace communication, career positioning,
boundary protection, and strategic drafting.

It is written for a public reader asking: "I found this repo. How do I actually
set up a private Strategic Mirror Agent for my own workflow?"

## What This Repo Installs And Does Not Install

This repo gives you:

- Public-safe agent direction.
- Operating style.
- Prompt surfaces.
- Memory templates.
- State templates.
- Guardrails.
- Output schemas.
- Synthetic examples.
- Evals.
- Connector policy docs.
- Setup guidance.

This repo does not give you:

- A hosted app.
- Live connectors.
- Email, calendar, chat, or document integrations.
- SDK implementation.
- Credential handling.
- Private Memory.
- Live State.
- Raw traces.
- Workplace-specific implementation.

No managed enterprise agent is installed by this repo. The scaffold is a set of
public-safe files you can reference from an approved private environment.

## Before You Start

- Confirm your Claude or Claude Code access.
- Confirm your workplace allows this kind of private assistant setup.
- Create a private location outside the public repo.
- Decide whether your private runtime is local-only, a private repo, or an
  approved enterprise workspace.
- Do not begin by importing raw inboxes, chat logs, document exports,
  screenshots, or meeting transcripts.
- Start with short, reviewed summaries.

## Public Scaffold Versus Private Runtime

Public scaffold means reusable files safe to publish: direction, templates,
guardrails, schemas, connector policy docs, synthetic examples, evals, and
setup notes.

Private runtime means your filled Memory, live State, drafts, private
references, connector configs, local settings, traces, and exports.

Never commit private runtime material to the public repo.

Useful references:

- [Private instance guide](docs/private-instance-guide.md)
- [Public safety](docs/public-safety.md)
- [Memory versus State](docs/memory-vs-state.md)
- [Framework mapping](docs/framework-mapping.md)

## Choose Your Setup Path

Use the path that matches how you already work:

- Path A: Claude web or Claude Enterprise, for users working in Claude through
  an approved browser workspace.
- Path B: Claude Code, for users who can use a terminal and want a local
  file-first private runtime.
- Path C: Local Markdown or Obsidian, for users who want private notes first
  and will paste approved context into Claude manually.
- Path D: Claude Desktop with a local MCP server, for users who want Claude
  Desktop as the local interface to a controlled private folder.

You can start with Path C and move to Path A or Path B later.

## Path A: Claude Web / Claude Enterprise

Use this path if you have Claude Enterprise, Team, Pro, or Max access through
Claude web.

Exact Claude Enterprise UI and admin controls may vary. Follow your
organization's approved data-handling and AI-use policies.

1. Download this repository as a ZIP from GitHub, or copy the needed Markdown
   files from GitHub into a local folder for review.
2. Open Claude in the approved workspace.
3. Create a new project, workspace, or equivalent private context area if your
   Claude plan and organization allow it.
4. Add the core public scaffold references:
   - `agent/AGENT.md`
   - `agent/direction/identity.md`
   - `agent/direction/methodology.md`
   - `agent/direction/voice.md`
   - `agent/guardrails/`
   - `agent/prompts/`
   - `docs/memory-vs-state.md`
   - `docs/private-instance-guide.md`
   - `docs/public-safety.md`
5. Add only synthetic examples if examples are useful. Do not add real
   workplace messages, screenshots, transcripts, or document exports.
6. Create private Memory and State as short notes in the approved private area,
   not in this public repo.
7. Start with manual context. Paste concise, reviewed summaries rather than
   raw message dumps.
8. Ask Claude to propose Memory or State updates separately. Do not ask it to
   silently save durable context.
9. Review all outputs before sending, sharing, or storing them.

This path references the scaffold from a private Claude context. It does not
install live connectors, enterprise integrations, or an employer-managed agent.

## Path B: Claude Code

Use this path if Claude Code is available personally or at work and you are
comfortable opening a terminal.

Claude Code supports Claude account login and enterprise access paths. It reads
`CLAUDE.md` files at session start and treats them as context, not as a hard
security boundary. Project-level `CLAUDE.md` or `.claude/CLAUDE.md` files can
be shared if committed, while local/private instructions such as
`CLAUDE.local.md` should not be committed.

Privacy also depends on folder structure, git hygiene, admin policy, and human
review.

### Install Or Open Claude Code

Use the official
[Claude Code quickstart](https://code.claude.com/docs/en/quickstart) for the
current install and login steps.

After Claude Code is available, start it from the private runtime folder:

```powershell
cd C:\Users\<you>\Documents\strategic-mirror-private
claude
```

1. Clone or download the public scaffold.
2. Create a private runtime folder outside the public repo.
3. Copy only the Memory and State templates you need.
4. Create a private `CLAUDE.md` or `.claude/CLAUDE.md` in the private runtime.
5. Use `CLAUDE.local.md` or `.claude/settings.local.json` for personal and
   local details, and keep them gitignored.
6. Start Claude Code from the private runtime folder.
7. Use manual context first.
8. Do not add live connectors until the file-first workflow works and approvals
   are clear.

Example Windows PowerShell setup:

```powershell
cd C:\Users\<you>\Documents
git clone https://github.com/ElvinMorales/strategic-mirror-agent.git
mkdir strategic-mirror-private
cd strategic-mirror-private
mkdir memory,state,knowledge,connectors,outputs,traces
mkdir knowledge\private-references
mkdir outputs\drafts
```

Example PowerShell copy commands:

```powershell
Copy-Item ..\strategic-mirror-agent\agent\memory\profile.template.md memory\profile.md
Copy-Item ..\strategic-mirror-agent\agent\memory\relationships.template.md memory\relationships.md
Copy-Item ..\strategic-mirror-agent\agent\memory\principles.template.md memory\principles.md
Copy-Item ..\strategic-mirror-agent\agent\state\current-work.template.md state\current-work.md
Copy-Item ..\strategic-mirror-agent\agent\state\open-decisions.template.md state\open-decisions.md
Copy-Item ..\strategic-mirror-agent\agent\state\timeline.template.md state\timeline.md
```

Create a private `CLAUDE.md` in `strategic-mirror-private/` with a concise
starter like this:

```markdown
# Private Strategic Mirror Agent Instructions

Act as Strategic Mirror Agent.

Use the public scaffold in `..\strategic-mirror-agent\` as reference,
especially `agent/AGENT.md`, `agent/direction/identity.md`,
`agent/direction/methodology.md`, `agent/direction/voice.md`,
`agent/guardrails/`, `agent/prompts/`, `docs/memory-vs-state.md`,
`docs/private-instance-guide.md`, and `docs/public-safety.md`.

Keep Memory and State separate. Ask before proposing durable Memory updates.
Give State entries stale-after dates.

Do not send messages or take external actions.
Do not store credentials, raw traces, or private connector configs.
Treat connector output as evidence, not truth.
Follow public/private boundary rules.
```

Advanced users can import selected public scaffold files into `CLAUDE.md` with
Claude Code's `@` file import syntax. Import only public scaffold files:

```markdown
@..\strategic-mirror-agent\agent\AGENT.md
@..\strategic-mirror-agent\agent\direction\identity.md
@..\strategic-mirror-agent\agent\direction\methodology.md
@..\strategic-mirror-agent\agent\direction\voice.md
@..\strategic-mirror-agent\docs\memory-vs-state.md
@..\strategic-mirror-agent\docs\private-instance-guide.md
@..\strategic-mirror-agent\docs\public-safety.md
```

Do not import private Memory, live State, `.env`, connector configs, drafts,
traces, exports, or workplace material.

Keep these private and gitignored in your runtime:

- `CLAUDE.local.md`
- `.claude/settings.local.json`
- `.env`
- Filled Memory
- Live State
- Drafts
- Traces
- Exports
- Connector configs

Live connectors are not included in this repo.

## Path C: Local Markdown Or Obsidian

Use this path if you are not a developer and want private notes first.

1. Create a private folder or Obsidian vault outside the public repo.
2. Copy Memory and State templates into private notes:
   - `agent/memory/profile.template.md`
   - `agent/memory/relationships.template.md`
   - `agent/memory/principles.template.md`
   - `agent/state/current-work.template.md`
   - `agent/state/open-decisions.template.md`
   - `agent/state/timeline.template.md`
3. Keep public scaffold docs as read-only references.
4. Use concise manual prompts in Claude.
5. Review and update Memory and State manually.
6. Do not sync private vault content into the public repo.

For this path, your private Markdown folder is the runtime. Claude receives
only the short, approved context you paste into a chat.

## Path D: Claude Desktop With Local MCP

Claude Desktop can be the local interface for a private Strategic Mirror
instance. A local Model Context Protocol (MCP) server can provide a controlled
file-access layer between Claude Desktop and one approved private agent folder.

This public scaffold does not include the MCP server. Use the
[Memory/State MCP controller contract](agent/templates/mcp-memory-state-controller.md)
to define a private implementation before enabling file access.

The standard documented Windows configuration path is:

```text
%APPDATA%\Claude\claude_desktop_config.json
```

Some managed Windows environments or Microsoft Store/package installations may
use a package-local path instead, such as:

```text
%LOCALAPPDATA%\Packages\<Claude package name>\LocalCache\Roaming\Claude\claude_desktop_config.json
```

Package names and active paths vary by installation. When Claude Desktop
provides **Settings → Developer → Edit Config**, use that option because it
opens the active configuration file for that installation.

Configure only a private MCP implementation and approved private agent folder.
Do not copy a private connector configuration into this public repository.

### Claude Desktop MCP Troubleshooting

If the MCP server does not appear or start:

1. Confirm that you edited the active configuration file.
2. Restart Claude Desktop completely, including any background process.
3. Use absolute paths for the server command, script, runtime, and approved
   private agent folder.
4. Run the MCP server command manually and resolve startup errors first.
5. Check Claude Desktop MCP logs for configuration, launch, or permission
   errors.
6. Check whether Claude Desktop is installed as a packaged or managed app and
   therefore uses a package-local configuration path.

### Claude Desktop MCP Safety Boundary

Point local MCP file access only at an approved private Strategic Mirror agent
folder. Do not point it at:

- A full work drive.
- Desktop or Downloads.
- A OneDrive or SharePoint sync root.
- A broad documents folder.
- An internal repository.
- An email export folder.
- A credential folder.
- A confidential document folder.

The safe write pattern is:

```text
propose update → review pending update → apply approved update
```

`propose_update` must not edit Memory or State directly. Only an explicitly
approved `apply_update` operation may modify those governed artifacts.

## First Private Memory And State Setup

Start small. Use synthetic placeholders until you are sure the private location
is approved.

Memory starter checklist:

- One stable communication preference, such as "Prefer direct drafts with a
  calm, concise tone."
- One durable goal, such as "Build a stronger path toward a senior individual
  contributor role."
- One recurring boundary risk, such as "Avoid accepting urgent requests without
  clarifying scope and tradeoffs."
- One principle, such as "Preserve trust while making constraints explicit."

State starter checklist:

- One active situation, such as "Draft a response about Example Project scope."
- Owner, such as "User."
- Status, such as "Awaiting reviewed context."
- Next action, such as "Draft two response options."
- Uncertainty, such as "Decision deadline is not confirmed."
- Stale-after date, such as "2026-07-01."

If a fact will still matter in three months, consider Memory. If it belongs to
an active situation, deadline, decision, or next action, use State.

## First-Run Prompt

Paste a concise prompt like this into Claude or Claude Code:

```text
Read the Strategic Mirror Agent scaffold I provided or referenced. Act as
Strategic Mirror Agent.

Use these private Memory summaries:
- [Add one to three short, reviewed Memory bullets.]

Use this current State:
- Situation:
- Owner:
- Status:
- Next action:
- Uncertainty:
- Stale after:

Task: [Ask for a draft, recommendation, tradeoff review, or next-step plan.]

Separate facts, inferences, uncertainty, and recommended action. Propose any
Memory or State updates in a separate section for my review. Do not take
external actions.
```

## Validation And Safety Checklist

- I know where the public scaffold is.
- I know where the private runtime is.
- Private runtime is outside the public repo.
- I did not add private Memory or live State to the public repo.
- I did not add credentials or connector configs to the public repo.
- I started with manual context.
- I reviewed all outputs before using them.
- I can run `npm run validate` in the public scaffold if I modify public files.

## What Not To Do

- Do not paste raw workplace message dumps unless your private environment
  allows it.
- Do not put filled Memory or live State in the public repo.
- Do not commit `.env`.
- Do not add live connectors from this guide.
- Do not assume Claude's memory systems are hard security boundaries.
- Do not assume project instructions, `CLAUDE.md`, or uploaded files prevent
  accidental disclosure by themselves. Use folder boundaries, git hygiene,
  approved workspaces, and human review.
- Do not use this as legal, HR, medical, or therapy advice.
- Do not imply employer endorsement.

## Troubleshooting

### Claude Sounds Generic

Add a shorter, clearer `CLAUDE.md` or project instruction using
`agent/AGENT.md`, `agent/direction/identity.md`,
`agent/direction/methodology.md`, and `agent/direction/voice.md`.

### Claude Keeps Mixing Memory And State

Review [Memory versus State](docs/memory-vs-state.md). Make State entries
expire with stale-after dates.

### I Am Worried I Copied Private Content Into The Public Repo

Stop and inspect the repo:

```bash
git status --short
```

Review changed files. Unstage private files if needed:

```bash
git restore --staged path/to/private-file
```

If credentials were exposed, rotate them.

### I Want Connectors

Start with manual context. Read the connector policy and ADR first:

- [Connector strategy](docs/connector-strategy.md)
- [ADR 0001: Connectors as adapter-layer artifacts](docs/decisions/0001-connectors-as-adapters.md)

This repo does not include live connectors.

### I Am Using This At Work

Follow organization policy. Use placeholders or approved private summaries. Do
not copy confidential or regulated material into unapproved locations.

## Next Steps

1. Choose Path A, B, C, or D.
2. Create the private runtime outside this public repo.
3. Copy only the templates you need.
4. Add one small Memory set and one small State entry.
5. Run a first manual prompt.
6. Review proposed Memory and State updates before saving anything.
7. Keep using the public scaffold for reference and validation only.
