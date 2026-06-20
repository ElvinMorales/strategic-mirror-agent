# Connector Policy

## Default Posture

Start read-only. Prefer drafts over sends. Prefer explicit source allowlists over broad access.

## Required Flow

1. Load direction, Memory, State, Knowledge, connector registry, and Guardrails.
2. Ingest connector-provided input.
3. Classify extracted material as durable Memory, transient State, reference Knowledge, output-only material, or ignored material.
4. Reconcile against the stored model.
5. Act on the user's request.
6. Write back only to approved layers.
7. Flag confidentiality, timing, boundary, and approval concerns.

## Prohibited In Public Repo

- Real connector credentials
- Real workplace systems
- Real email, calendar, document, or chat exports
- Private memory stores
- Live runtime state
- Unsanitized traces
- Private connector configs

## Approval Rule

Any external side effect requires explicit human approval at the moment of action.
