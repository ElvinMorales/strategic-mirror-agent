# Strategic Mirror Agent

A public-safe, file-first scaffold for a personal career and workplace communication coach.

Strategic Mirror Agent helps a private runtime instance draft workplace communication, reason through hard situations, support career positioning, protect boundaries, and preserve continuity over time. The public repository is only the scaffold: direction, templates, schemas, guardrails, connector policy, synthetic examples, and validation.

## Who It Is For

This repo is for a person who wants an agent that can act as a steady workplace communication partner without mixing private memory into public artifacts. It is also useful for builders studying how to separate agent identity, memory, state, connectors, guardrails, outputs, and evaluation.

## Strategic Mirror

A strategic mirror is not a yes-man. It connects tactical requests to the larger trajectory, names tradeoffs, protects boundaries, and says the useful thing even when the useful thing is uncomfortable.

For a draft, the agent should not stop at the message. It should include the positioning move underneath it, what the choice optimizes for, and what risk remains.

## Included Artifacts

- Agent identity, methodology, and voice rules in `agent/direction/`
- Durable memory templates in `agent/memory/`
- Fast-changing state templates in `agent/state/`
- Guardrails in `agent/guardrails/`
- Prompt surfaces and task prompts in `agent/prompts/`
- Workflow and handoff notes in `agent/workflow/`
- Connector policy, registry templates, protocol notes, and host adapter docs in `agent/connectors/`
- Output templates and schemas in `agent/templates/`, `agent/outputs/`, and `schemas/`
- Synthetic examples in `examples/`
- Eval cases and rubric in `evals/`
- Local validation scripts in `scripts/`

## Taxonomy Alignment

The scaffold aligns to the stable 14-bucket agent artifact taxonomy:

1. Identity: `agent/AGENT.md`, `agent/direction/identity.md`
2. Operating style: `agent/direction/methodology.md`, `agent/direction/voice.md`
3. Capability modules: `agent/prompts/tasks/`
4. Tools: connector policy and adapter docs in `agent/connectors/`
5. Knowledge and resources: `agent/knowledge/`
6. Prompts and interfaces: `agent/prompts/`, `agent/interfaces/`
7. Memory: `agent/memory/`
8. State: `agent/state/`
9. Planning and orchestration: `agent/workflow/`
10. Guardrails and governance: `agent/guardrails/`
11. Outputs and schemas: `agent/templates/`, `agent/outputs/`, `schemas/`
12. Evaluation and observability: `evals/`, `observability/`
13. Runtime and deployment: `agent/runtime/`
14. Learning and iteration: `agent/iteration/`, `CHANGELOG.md`

Plans, routers, workflow graphs, delegation, handoffs, resumability, and continuation logic belong under Planning and orchestration. Connectors, MCP, A2A, and host adapters are implementation-edge mappings, not new taxonomy categories.

## Memory vs State

Memory is durable, slowly changing context. It answers: would this still matter in three months if nothing was actively worked on?

State is fast-changing execution context. It answers: is this part of a live situation, decision, deadline, or workflow?

The split is load-bearing. Durable preferences, career goals, recurring traps, and stable relationships belong in Memory. Pending replies, open decisions, deadlines, current risks, and temporary assumptions belong in State.

See `docs/memory-vs-state.md`.

## Connectors

The agent is connector-ready but not connector-dependent. The core experience works from plain files and manually supplied context.

Connectors are adapter-layer only. They may supply approved input to a private runtime instance, but they must not bypass the memory, state, knowledge, workflow, or guardrail layers. Connector output is evidence to classify and reconcile, not truth to absorb blindly.

No live connector is implemented in v0.1.

## Public Safety

Safe to publish:

- Direction files
- Prompt templates
- Memory and state templates
- Connector policy templates
- Protocol mapping notes
- Host adapter documentation
- Synthetic examples
- Schemas and validation scripts
- Eval rubrics and sample eval cases

Must stay private:

- Real workplace messages, screenshots, notes, documents, or meeting summaries
- Real employer, team, manager, sponsor, peer, or client names
- Private memory stores
- Live runtime state
- Raw traces
- Connector credentials
- Local environment files
- Private connector configuration

See `docs/public-safety.md`.

## Private Instance

Create a private runtime instance by copying the templates into a private folder or private repository:

```text
strategic-mirror-private/
├── memory/
│   ├── profile.md
│   ├── relationships.md
│   └── principles.md
├── state/
│   ├── current-work.md
│   ├── open-decisions.md
│   └── timeline.md
├── knowledge/
│   └── private-references/
├── connectors/
│   ├── connectors.local.yaml
│   └── approved-sources.md
├── outputs/
│   └── drafts/
└── .env
```

Keep that private instance out of this public repo.

## Validation

Install dependencies:

```bash
npm install
```

Run all checks:

```bash
npm run validate
```

Individual checks:

```bash
npm run lint:md
npm run validate:json
npm run validate:jsonl
npm run validate:yaml
npm run validate:schemas
npm run check:links
```

The link checker validates local Markdown links only. It does not use the network.

## Manual Evals

Review `evals/cases.jsonl` against `evals/rubric.md`. Each case includes an expected behavior profile rather than a single golden answer, because the agent should reason strategically while preserving voice, confidentiality, and boundary rules.

## Not Included In v0.1

- Live connectors
- Email, calendar, chat, or document integrations
- Credential handling beyond examples and policy
- Private memory or state
- Raw traces
- UI framework
- Hosted service runtime

## License

MIT. See `LICENSE`.
