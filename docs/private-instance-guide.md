# Private Instance Guide

Use this public repo as the template. Store real context somewhere private.

## Suggested Layout

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

## Setup Steps

1. Copy templates from `agent/memory/` and `agent/state/`.
2. Rename `.template.md` files to private working files.
3. Fill only the minimum useful context.
4. Keep source links or citations where possible.
5. Review stale State items regularly.
6. Never commit the private folder to the public scaffold.

Use connector configs only in the private instance.
