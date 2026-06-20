# Codex Local Host Adapter

- Host name: Codex local
- Supported connector types: manual input, repository files, approved local files
- Read permissions: current workspace and approved roots
- Write permissions: current workspace when asked
- Approval requirements: human approval for commands with external effects
- Memory write behavior: template-only in public repo, private instance by request
- State write behavior: template-only in public repo, private instance by request
- Knowledge read behavior: approved local references
- Secrets handling: avoid reading or echoing secrets, respect `.gitignore`
- Known limitations: sandbox and network policies vary
- Public-safety notes: inspect diffs before publishing
