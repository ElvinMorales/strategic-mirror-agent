# Framework Mapping Notes

## Purpose

This guide helps users adapt the Strategic Mirror Agent scaffold to different
host environments without treating any host as the architecture. Start with the
generic artifact classes, then map those artifacts to the host surface you are
using.

The scaffold is public-safe, file-first, and framework-neutral. It is not a
hosted runtime and does not include live connectors, private Memory, live State,
credentials, traces, or host-specific runtime settings.

Use this pattern when adapting the scaffold:

```text
generic artifact class -> repo file or folder -> possible host mapping -> public/private boundary note
```

## What This Guide Is And Is Not

This guide is:

- A translation layer from generic artifact classes to possible host surfaces.
- A framework-neutral reference.
- A public-safe adaptation guide.

This guide is not:

- A setup guide for live integrations.
- An SDK tutorial.
- A connector implementation guide.
- Permission to commit private runtime files.
- Proof that live connectors exist in the repo.

## Framework-Neutral Artifact Map

| Generic artifact class | Repo location | Taxonomy bucket | Host mapping idea | Public/private note |
| --- | --- | --- | --- | --- |
| Agent identity | `agent/AGENT.md`, `agent/direction/identity.md`, `agent/agent.yaml` | 1. Identity | Host instruction, system prompt, agent config, or reference doc | Public-safe identity only. Do not add real workplace details. |
| Operating style | `agent/direction/methodology.md`, `agent/direction/voice.md` | 2. Operating style | Behavior instructions, style rules, review rubric, or coding-agent guidance | Keep generic. Private relationship history and workplace-specific tone rules stay private. |
| Capability/module notes | `agent/prompts/tasks/` | 3. Capability modules | Task prompts, slash-command notes, workflow snippets, or callable task descriptions | Use generic or synthetic examples only. Do not include real workplace messages. |
| Connector policy | `agent/connectors/`, `docs/connector-strategy.md`, `docs/decisions/0001-connectors-as-adapters.md` | 4. Tools | Tool governance, adapter policy, connector registry shape, or host adapter notes | Public repo may document policy and examples, but not live connectors, credentials, or private configs. |
| Knowledge and resources | `agent/knowledge/` | 5. Knowledge and resources | Reference files, approved knowledge pages, or private reference stores | Public references must be generic or synthetic. Private references stay in a private runtime. |
| Prompt surfaces | `agent/prompts/`, `agent/interfaces/` | 6. Prompts and interfaces | Project instructions, command prompts, task forms, or chat entry points | Prompts may define workflow, but must not embed private user context. |
| Memory template | `agent/memory/`, `schemas/memory-entry.schema.json` | 7. Memory | Durable private context store, user-approved remembered context, or private notes | Templates are public. Filled Memory belongs only in a private runtime. |
| State template | `agent/state/`, `schemas/state-entry.schema.json` | 8. State | Active working notes, session state, task handoff, or live situation tracker | Templates are public. Live State belongs only in a private runtime. |
| Planning and orchestration | `agent/workflow/`, `docs/architecture.md` | 9. Planning and orchestration | Session loop, handoff pattern, issue workflow, or host routing notes | Generic workflow can be public. Live plans tied to private work stay private. |
| Guardrails | `agent/guardrails/`, `docs/public-safety.md` | 10. Guardrails and governance | Safety policy, review checklist, approval rules, or host-specific constraints | Public guardrails should protect confidentiality, claims, approvals, and connector boundaries. |
| Output schemas | `agent/templates/`, `agent/outputs/`, `schemas/` | 11. Outputs and schemas | Structured outputs, response contracts, draft templates, or validation targets | Schemas and synthetic examples are public. Real drafts and outputs stay private. |
| Evals | `evals/`, `examples/schema-instances/` | 12. Evaluation and observability | Test cases, rubrics, synthetic fixtures, or host evaluation suites | Use synthetic evals only. Do not commit raw traces or logs from private use. |
| Runtime notes | `agent/runtime/`, `docs/private-instance-guide.md` | 13. Runtime and deployment | Private host setup, local folder layout, deployment notes, or host-specific config | Runtime settings, credentials, and local environment values stay outside the public repo. |
| Iteration/release notes | `agent/iteration/`, `CHANGELOG.md`, `docs/release-notes-v0.1.0.md` | 14. Learning and iteration | Change log, release notes, maintenance checklist, or improvement backlog | Public iteration notes describe scaffold changes, not private outcomes or workplace developments. |

The same artifact classes can be adapted into multiple host environments. No
host is the source of truth for the scaffold.

## Host Mapping Notes

### ChatGPT Projects

Possible mapping:

- Project instructions can carry identity, operating style, guardrails, and
  prompt/interface rules.
- Uploaded files can provide public scaffold docs, templates, schemas, and
  synthetic examples.
- Project memory or remembered context may be used only when private,
  user-approved, and appropriate for the host settings.
- Live State and private connector credentials should not be placed in public
  scaffold files.

ChatGPT Project adaptation should keep public scaffold files separate from
private project context. Public repo files can describe reusable behavior and
templates. Private project context, if used, belongs in the private host
boundary and should be reviewed before it is retained.

### Claude Code

Possible mapping:

- Repository files and instructions can act as the coding-agent workspace.
- Issue and pull request templates can guide contribution workflow.
- Docs and schemas can become implementation targets for documentation,
  examples, validation, or tests.
- Private work briefs should stay separate from the public scaffold.

Claude Code usage may be private or internal. When work-related context is
needed, use placeholders or short private summaries and avoid copying real
workplace details into public repo files.

### Codex Local Workflows

Possible mapping:

- Local branch workflow can keep public scaffold changes isolated and reviewable.
- Codex `/goal` packets can describe issue scope, acceptance criteria, public
  safety rules, and validation commands.
- Validation commands can enforce JSON, YAML, schema, link, and Markdown checks.
- Commit and pull request discipline can keep changes scoped to public-safe
  artifacts.
- Public-safety acceptance criteria can be checked before staging or publishing.

Codex local workflows work well for public repo changes because they operate on
files and validation. Private Memory, live State, credentials, and connector
configs should remain outside the public workspace unless the workspace itself
is a private runtime.

### OpenAI Agents SDK

Possible mapping:

- Instructions can map to agent identity and behavior configuration.
- Tools and connectors can map to tool definitions or adapters in a private
  runtime.
- Schemas can map to structured output contracts.
- Eval cases can map to testing and evaluation surfaces.
- Runtime and deployment details can map to host-specific code and settings
  outside the public scaffold.

This repo does not include OpenAI Agents SDK implementation code. Treat any SDK
adaptation as a separate private or public-safe implementation layer, depending
on whether it contains credentials, live connector behavior, private Memory,
live State, or real workplace context.

### MCP-Style Connectors

Possible mapping:

- Connector policy can map to adapter governance.
- Protocol mapping can map to connector interface notes.
- Connector registry examples can suggest a possible adapter registry shape.
- Guardrails can map to permission, approval, retention, and side-effect
  boundaries.

No live MCP server or client is included in this public scaffold. MCP-style
connector output is evidence, not truth. Connector configs and credentials
belong only in private runtimes.

### Obsidian/Local Markdown Workflows

Possible mapping:

- Memory templates can map to private durable notes.
- State templates can map to active working notes.
- Docs can map to reference vault pages.
- Outputs can map to draft notes.
- Release notes and the changelog can map to an iteration log.

Local Markdown is a useful private runtime pattern because it is inspectable and
file-first. Private vault content must not be copied back into the public repo.

## Public/Private Runtime Boundary

Public scaffold may include:

- Templates.
- Schemas.
- Synthetic examples.
- Policies.
- Docs.
- Evals.
- Validation scripts.

Private runtime may include:

- Real Memory.
- Live State.
- Credentials.
- Private connector configs.
- Raw traces.
- Personal notes.
- Real workplace messages.
- Drafts based on private context.

Public repo must not include:

- Real employer names.
- Real manager, peer, sponsor, team, client, or workplace details.
- Private memory.
- Live runtime state.
- Raw traces.
- Connector credentials.
- Local environment values.
- Private connector configs.
- Regulated data.
- Confidential documents.
- Internal screenshots.

## Memory And State Mapping Notes

Memory maps to durable private context, not active task details. It is for
slowly changing material such as stable preferences, durable goals, recurring
patterns, and reviewed principles.

State maps to current active situation context. It should include stale-after
dates or review triggers because it can expire quickly.

Some hosts blur Memory and State through project context, chat history,
remembered facts, local notes, or session files. Preserve the boundary
intentionally. Do not silently promote active State into durable Memory, and do
not treat durable Memory as live status.

Public examples should use synthetic Memory and synthetic State only.

## Connector Mapping Notes

Connectors are adapter-layer artifacts. They can supply approved evidence to a
private runtime, but they are not the source of identity, voice, durable Memory,
live State, or governance.

Live connectors are excluded from this public repo. Connector output is
evidence, not truth. Connector-fed context must be classified before it affects
Memory, State, Knowledge, workflow, or outputs.

External side effects require explicit approval. Examples include sending a
message, creating a ticket, updating a calendar, writing to a shared document,
or changing an external system.

## Recommended Adaptation Order

1. Start with identity, operating style, and guardrails.
2. Add prompt/interface surfaces.
3. Add output schemas.
4. Add synthetic examples.
5. Add evals.
6. Add private Memory and State outside the public repo.
7. Add connector policy before adding any connector.
8. Add host-specific runtime only after public/private boundaries are clear.

## Validation Checklist

- The adaptation starts from generic artifact classes, not a host-specific
  framework.
- Public scaffold files contain only templates, schemas, synthetic examples,
  policies, docs, evals, and validation scripts.
- Private Memory, live State, credentials, connector configs, raw traces,
  personal notes, real workplace messages, and private drafts stay outside the
  public repo.
- Memory and State remain separate.
- Connectors remain adapter-layer artifacts.
- Connector output is treated as evidence to classify and reconcile.
- External side effects require explicit approval.
- Host-specific runtime settings are stored only in the private runtime.
- Examples are synthetic and public-safe.
- Validation passes before publishing.

## Non-Goals

- No live connectors.
- No SDK implementation.
- No hosted runtime.
- No private Memory or live State.
- No credential handling.
- No workplace-specific adaptation.
- No framework endorsement.
