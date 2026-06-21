# ADR 0001: Connectors As Adapter-Layer Artifacts

## Status

Accepted.

## Date

2026-06-21

## Context

Strategic Mirror Agent is a public-safe, file-first scaffold for a personal
career and workplace communication coach. Its public repository contains
direction, prompts, templates, schemas, policies, synthetic examples,
evaluation material, and validation scripts. It does not contain private
Memory, live State, raw traces, connector credentials, local runtime values, or
real workplace content.

The architecture separates core identity and operating style from task
surfaces, Memory, State, planning, guardrails, outputs, evaluation, runtime,
and connector adapter surfaces. Connectors may be useful in a private runtime
because they can supply context or support actions, but they sit at the
implementation edge. They are not the source of the agent's role, values,
persona, voice, decision authority, durable Memory, live State, or governance
rules.

The core agent must remain useful with manual context and files. Manual context
is the safe baseline because it is inspectable, framework-neutral, and free of
external side effects.

Live connectors are intentionally excluded from v0.1 for public safety,
credential safety, scope discipline, framework neutrality, easier inspection,
and avoidance of external side effects. Connector output also needs
classification, reconciliation, and approval before use. It may be stale,
partial, conflicting, permission-limited, or incorrectly interpreted.

## Decision

Connectors are adapter-layer artifacts, not core identity.

The public scaffold may document connector policy, registry shape, protocol
mapping, host adapter expectations, and synthetic examples. It must not add
live connectors, connector implementations, credentials, scripts, runtime
behavior, private connector configs, or external side effects.

Connector output is evidence, not truth. Connector-fed context must be
classified before it influences Memory, State, Knowledge, workflow decisions,
or outputs. Durable extraction into Memory requires approval. Live
classification into State requires a stale-after date or review trigger.

Guardrails govern connector access, connector use, connector output, and any
external action. Connectors must not bypass public/private safety review.

Any future connector work belongs in one of two places:

- A private runtime instance with private storage, explicit source allowlists,
  approved credentials handling, and human review.
- A clearly scoped public adapter example with no credentials, no private
  content, no real workplace systems, and no external side effects.

Connectors must not define the agent's role, values, persona, voice, or
decision authority.

## Taxonomy Mapping

Connectors do not create a new top-level taxonomy bucket. They map to the
existing 14-bucket taxonomy as adapter and governance concerns.

| Bucket | Connector relationship |
| --- | --- |
| 1. Identity | No ownership. Connectors must not define the agent's role, values, persona, or decision authority. |
| 2. Operating style | No ownership. Connectors must not define voice, reasoning posture, or communication method. |
| 3. Capability modules | No ownership. Connector availability must not determine the agent's core task capabilities. |
| 4. Tools | Primary. Connector policies, registries, protocol mappings, and host adapter notes live here. |
| 5. Knowledge and resources | Secondary. Connector-provided reference material may become Knowledge only after classification and approval. |
| 6. Prompts and interfaces | Limited. Prompts may describe how to request or label connector-fed context, but connectors remain adapter inputs. |
| 7. Memory | Secondary and controlled. Connector-fed material may affect Memory only after approved durable extraction. |
| 8. State | Secondary and controlled. Connector-fed live context may affect State only after classification with stale-after or review handling. |
| 9. Planning and orchestration | Primary. Planning may decide when connector-fed evidence is relevant, stale, conflicting, or insufficient. |
| 10. Guardrails and governance | Primary. Guardrails define access, approval, confidentiality, side-effect, and safety boundaries. |
| 11. Outputs and schemas | Secondary. Connector results may require structured records, citations, confidence notes, or output fields. |
| 12. Evaluation and observability | Primary. Evals should check connector safety, evidence handling, classification, and approval boundaries. |
| 13. Runtime and deployment | Primary. Live connectors, if any, belong to a private runtime or a safe public adapter example. |
| 14. Learning and iteration | Limited. Changes to connector posture can be tracked here, but connectors are still not a separate taxonomy category. |

## Consequences

- The agent remains useful without connectors because manual context and files
  are first-class inputs.
- The public scaffold stays framework-neutral and easier to inspect.
- v0.1 avoids credential handling, live integrations, and external side
  effects.
- Connector-fed context must be reviewed before it influences durable or live
  context layers.
- Future connector work must carry classification, reconciliation, approval,
  and observability expectations from the start.
- Private runtime instances can add connectors without changing the public
  agent identity or governance model.

## Alternatives Considered

### Connectors As Core Identity

Rejected. This would let specific integrations shape the agent's role, values,
voice, and decision authority. The agent should remain a strategic workplace
communication coach even when no connector is available.

### Live Connectors In The Public Scaffold

Rejected for v0.1. Live connectors would introduce credential risk, private
data risk, external side effects, host-specific assumptions, and a larger
inspection burden. The public scaffold should remain safe to publish and
validate locally.

### Host-Specific Connector Design First

Deferred. Starting with one host or protocol would bias the architecture toward
that runtime. The public docs should define framework-neutral boundaries first,
then allow private runtimes to map those boundaries to specific hosts.

### Manual Context Only Forever

Rejected. Manual context is the safe baseline, but private runtimes may
eventually benefit from approved read-only sources, draft helpers, or other
adapter-layer capabilities. The architecture should allow that without making
connectors mandatory.

### Separate Connector Repo Now

Deferred. A separate repo may be useful later if public adapter examples grow.
For v0.1, connector policy and adapter posture can stay inside the scaffold as
documentation. Live private connectors still belong outside the public repo.

## Public/Private Safety Impact

This decision keeps the public repository limited to scaffold material:
policies, templates, protocol notes, synthetic examples, schemas, docs, evals,
and validation scripts.

The public repository must not include:

- Real workplace messages, screenshots, documents, meeting notes, or raw
  communications.
- Real employer, manager, peer, sponsor, team, client, or workplace details.
- Private Memory stores.
- Live State files from active situations.
- Raw traces, logs, exports, or observability data from private use.
- Connector credentials, local environment values, local secrets, or private
  connector configs.
- Regulated data, confidential documents, or internal screenshots.

Private runtimes may use connectors only inside their own storage and approval
boundaries. Public contributions must not include private connector behavior or
private data derived from connectors.

## Relationship To Memory, State, And Guardrails

Memory is durable, slowly changing context. Connector-fed content may influence
Memory only after durable extraction is proposed, reviewed, approved, and
recorded with appropriate source, confidence, sensitivity, and review metadata.

State is fast-changing execution context tied to active situations, deadlines,
decisions, risks, or workflows. Connector-fed live context may influence State
only after classification. State entries need a stale-after date or review
trigger because connector context can become outdated quickly.

Memory and State must remain separate. A connector result must not silently move
from live evidence into durable Memory, and active State must not be treated as
a stable personal fact.

Guardrails govern connector access, input handling, output use, retention,
approval, and external action. Guardrails must require explicit approval for
external side effects and must preserve confidentiality, source limits,
classification, and public/private review boundaries.

## Validation And Review Guidance

Review future connector-related changes for these questions:

- Does the change keep connectors in the adapter layer?
- Does the core agent still work from manual context and files?
- Does the change avoid live connectors, credentials, private configs, runtime
  behavior, and external side effects in the public repo?
- Does connector-fed context remain evidence rather than truth?
- Does the flow classify connector-fed context before it affects Memory,
  State, Knowledge, workflow, or outputs?
- Does any Memory update require durable extraction and approval?
- Does any State update include stale-after or review handling?
- Do guardrails govern connector access, use, output, and external actions?
- Is the change framework-neutral and free of private or employer-specific
  content?

Run the standard repository validation before review:

```bash
npm run validate
git diff --check
```
