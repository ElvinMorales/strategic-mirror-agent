# Architecture

Strategic Mirror Agent is file-first. The public repo defines the agent scaffold, while a private runtime instance supplies real context.

## Layers

- Direction defines identity, methodology, and voice.
- Memory stores durable, slowly changing context.
- State stores live, fast-changing execution context.
- Knowledge stores reference material that is reusable but not personal memory.
- Connectors describe optional input and output edges.
- Guardrails govern confidentiality, honesty, wellbeing, and connector safety.
- Prompts and interfaces describe how users and hosts invoke the agent.
- Workflow defines the session loop, handoffs, and continuation logic.
- Outputs and schemas define expected response shapes.
- Evals and observability provide review scaffolding without storing live traces.

## Runtime Flow

1. Load direction, memory, state, knowledge, connector registry, and guardrails.
2. Ingest user input or approved connector input.
3. Classify material as durable memory, transient state, reference knowledge, output-only material, or ignored material.
4. Reconcile contradictions, stale assumptions, and changed facts.
5. Act on the request.
6. Validate voice, confidentiality, connector safety, and claims.
7. Propose or write approved updates to the correct layer.

Connectors never bypass this flow.
