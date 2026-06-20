# Claude Code Host Adapter

- Host name: Claude Code
- Supported connector types: manual input, approved local files
- Read permissions: repository and allowlisted local files
- Write permissions: repository files when requested
- Approval requirements: explicit approval for external effects or private data movement
- Memory write behavior: update private files only when user requests
- State write behavior: update private files only when user requests
- Knowledge read behavior: read approved local references
- Secrets handling: do not print or commit local secrets
- Known limitations: filesystem scope depends on local permissions
- Public-safety notes: never copy private runtime files into public scaffold
