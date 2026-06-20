# Release Notes: v0.1.0

`v0.1.0` is the initial public scaffold release for Strategic Mirror Agent, a file-first personal career and workplace communication coach. This release publishes the reusable structure, policy, templates, schemas, examples, and validation checks needed to build a private runtime instance without placing private workplace context in the public repository.

## Why This Repo Exists

The repo exists to separate public agent design from private agent operation. It documents how the agent should reason, protect boundaries, classify context, handle connector input, and validate outputs while keeping real workplace material outside the public scaffold.

The public repository is intended for:

- Reviewing the agent's identity, methodology, voice, and safety posture.
- Reusing templates for Memory, State, prompts, outputs, and connector policy.
- Testing the scaffold with synthetic examples and local validation scripts.
- Creating a separate private instance that contains real context and approved local configuration.

## What Shipped

`v0.1.0` includes the public-safe scaffold:

- Agent identity, methodology, and voice rules.
- Prompt surfaces and task prompts for workplace communication and career reasoning.
- Memory and State templates, with guidance for keeping durable context separate from live execution context.
- Guardrails for confidentiality, wellbeing, connector safety, approval boundaries, and claims.
- Connector policy, registry templates, protocol notes, and host adapter documentation.
- Output templates, JSON schemas, and schema examples.
- Synthetic examples that do not contain private workplace material.
- Eval cases, a rubric, and validation scripts for local checks.
- Documentation for architecture, connector strategy, Memory versus State, public safety, and private instance setup.

## Artifact Layers

The scaffold includes these agent artifact layers:

- Identity: agent identity and purpose.
- Operating style: methodology and voice rules.
- Capability modules: task-oriented prompt files.
- Tools: connector policy and adapter documentation.
- Knowledge and resources: reusable non-private reference structure.
- Prompts and interfaces: user and host invocation surfaces.
- Memory: durable context templates only.
- State: fast-changing execution context templates only.
- Planning and orchestration: workflow, handoff, session, and continuation notes.
- Guardrails and governance: confidentiality, approval, and safety rules.
- Outputs and schemas: response templates, schemas, and examples.
- Evaluation and observability: eval cases, rubric, and observability scaffolding.
- Runtime and deployment: runtime notes and public-safe deployment placeholders.
- Learning and iteration: changelog and iteration notes.

## Taxonomy Alignment

The release aligns to the stable 14-bucket agent artifact taxonomy used by the repo:

1. Identity
2. Operating style
3. Capability modules
4. Tools
5. Knowledge and resources
6. Prompts and interfaces
7. Memory
8. State
9. Planning and orchestration
10. Guardrails and governance
11. Outputs and schemas
12. Evaluation and observability
13. Runtime and deployment
14. Learning and iteration

Planning and orchestration remain one top-level bucket. Plans, routers, workflow graphs, delegation, handoffs, resumability, and continuation logic belong there. Connectors, MCP, A2A, and host adapters are implementation-edge mappings under the tool and runtime boundary, not new taxonomy categories.

## Public And Private Boundary

This public release contains scaffold material only. It may include templates, generic policies, synthetic examples, schemas, and validation scripts.

The public repo must not contain:

- Real workplace messages, screenshots, documents, meeting notes, or raw communications.
- Real employer, manager, peer, sponsor, team, client, or workplace details.
- Private Memory stores.
- Live State files from an active situation.
- Runtime traces or observability data from private use.
- Connector credentials, environment values, local secrets, or private connector configs.

Private Memory and State do not belong in the public repo. A private runtime instance should copy the templates into a private folder or private repository, then fill them with only the minimum useful context for that private environment.

## Connector Posture

Live connectors are intentionally not included in `v0.1.0`.

The release is connector-ready but not connector-dependent. Connector files describe policies, registry shapes, protocol mapping notes, and host adapter expectations. They do not implement email, calendar, chat, document, or workplace system integrations.

Any future connector work should remain adapter-layer only. Connector input must be classified and reconciled through Memory, State, Knowledge, workflow, and guardrails before it influences behavior. External side effects require explicit human approval at the moment of action.

## Validation

Expected validation for this release:

```bash
npm run validate
git diff --check
```

The validation suite checks Markdown style, JSON, JSONL, YAML, schema examples, and local Markdown links. Manual evaluation should use `evals/rubric.md` against the synthetic cases, with attention to strategic reasoning, voice compliance, Memory and State separation, confidentiality, connector safety, boundary protection, and useful next steps.

## Good Next Steps

Useful follow-up work should stay within the public scaffold boundary unless it is done in a separate private instance:

- Add more synthetic eval cases that exercise boundary protection, connector classification, and strategic reasoning.
- Expand documentation around private instance setup without adding private content.
- Add more schema examples for expected outputs.
- Improve local validation for scaffold consistency.
- Draft connector adapter examples that remain offline, generic, and credential-free.
- Document release and maintenance practices for future scaffold versions.

Feature work that adds live connectors, private Memory, live State, runtime traces, or real workplace content should happen only in a private or internal instance with the right approval and storage boundary.
