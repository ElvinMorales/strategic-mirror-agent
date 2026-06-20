# Connector Strategy

The agent is connector-ready but not connector-dependent.

## Tiers

- Tier 0: manual input, pasted or uploaded by the user.
- Tier 1: read-only local files from approved folders.
- Tier 2: read-only personal productivity sources.
- Tier 3: draft creation, with no outbound sending.
- Tier 4: external side effects, only with explicit approval.
- Tier 5: workplace systems, only in a private or internal instance that follows workplace policy.

## Rules

- Start read-only.
- Prefer drafts over sends.
- Prefer explicit source allowlists over broad access.
- Treat connector output as input to evaluate.
- Never write directly to durable memory without classification and reconciliation.
- Never perform external side effects without explicit approval.

No live connectors are implemented in this public scaffold.
