# OpenAI Agents SDK Host Adapter

- Host name: OpenAI Agents SDK
- Supported connector types: manual input, configured tools, approved file stores
- Read permissions: depends on private runtime configuration
- Write permissions: draft outputs by default
- Approval requirements: explicit human approval for side-effecting tools
- Memory write behavior: route through classification and reconciliation
- State write behavior: route through classification and stale-after handling
- Knowledge read behavior: approved reference stores
- Secrets handling: use private runtime secret management only
- Known limitations: actual tool behavior depends on implementation
- Public-safety notes: public repo provides schemas and policy, not runtime credentials
