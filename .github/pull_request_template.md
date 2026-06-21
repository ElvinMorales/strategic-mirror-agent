## Summary

What changed?

## Related Issues

Closes #

## Artifact Bucket Checklist

- [ ] 1. Identity
- [ ] 2. Operating style
- [ ] 3. Capability modules
- [ ] 4. Tools
- [ ] 5. Knowledge and resources
- [ ] 6. Prompts and interfaces
- [ ] 7. Memory
- [ ] 8. State
- [ ] 9. Planning and orchestration
- [ ] 10. Guardrails and governance
- [ ] 11. Outputs and schemas
- [ ] 12. Evaluation and observability
- [ ] 13. Runtime and deployment
- [ ] 14. Learning and iteration

## Public/Private Boundary Checklist

- [ ] No real workplace messages
- [ ] No real employer, team, manager, peer, sponsor, client, or person names
- [ ] No private Memory
- [ ] No live State
- [ ] No raw traces or observability data
- [ ] No connector credentials
- [ ] No local environment values
- [ ] No private connector configs
- [ ] No regulated or confidential data
- [ ] Manual public-safety review completed

## Memory And State Checklist

- [ ] Does not touch Memory or State
- [ ] Touches Memory only
- [ ] Touches State only
- [ ] Touches both, with the boundary kept explicit
- [ ] Does not silently promote State into Memory

## Connector Behavior Checklist

- [ ] Does not introduce connector behavior
- [ ] Connector material remains adapter-layer only
- [ ] No live connector implementation is added
- [ ] No credentials, local configs, or environment values are added
- [ ] Connector-fed context is classified and reconciled before use
- [ ] Human approval is required for external actions

## Validation Checklist

- [ ] `npm run validate`
- [ ] `git diff --check`
- [ ] Manual public-safety review
- [ ] Link check if docs changed
- [ ] Schema/example validation if schemas or examples changed

## Reviewer Notes

Anything reviewers should inspect closely?
