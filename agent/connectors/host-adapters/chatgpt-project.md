# ChatGPT Project Host Adapter

- Host name: ChatGPT Project
- Supported connector types: manual input, uploaded files, project files where approved
- Read permissions: user-provided files and project context
- Write permissions: draft text inside chat only
- Approval requirements: user review before using drafts externally
- Memory write behavior: propose Memory updates, do not silently store
- State write behavior: propose State updates and stale-after dates
- Knowledge read behavior: read approved project files
- Secrets handling: do not request or store credentials
- Known limitations: project memory behavior depends on host settings
- Public-safety notes: keep real context in private projects only
