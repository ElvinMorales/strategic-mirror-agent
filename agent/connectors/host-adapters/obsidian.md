# Obsidian Host Adapter

- Host name: Obsidian
- Supported connector types: read-only local Markdown vaults, private note folders
- Read permissions: explicit vault or folder allowlist
- Write permissions: draft notes only when approved
- Approval requirements: user approval for creating or updating private notes
- Memory write behavior: propose durable note updates
- State write behavior: propose live note updates with stale-after dates
- Knowledge read behavior: approved reference notes
- Secrets handling: do not scan hidden or credential folders
- Known limitations: note structure is user-defined
- Public-safety notes: vault contents belong in private runtime only
