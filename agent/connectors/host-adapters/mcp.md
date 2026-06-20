# MCP Host Adapter

- Host name: Model Context Protocol
- Supported connector types: approved MCP resources and tools
- Read permissions: read-only resources by default
- Write permissions: disabled unless explicitly approved
- Approval requirements: approval for any tool that changes external systems
- Memory write behavior: summarize and propose, never raw-copy
- State write behavior: summarize live items with stale-after dates
- Knowledge read behavior: read approved resources only
- Secrets handling: server credentials remain outside the public scaffold
- Known limitations: server trust and permissions vary by host
- Public-safety notes: treat MCP output as input requiring classification
