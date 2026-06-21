---
name: Artifact template request
about: Propose a new or improved agent artifact template
title: "[Artifact]: "
labels: ["repo hygiene"]
assignees: ""
---

## Summary

What artifact class is being proposed or improved?

## Taxonomy Bucket

Which 14-bucket taxonomy bucket owns this artifact?

## Artifact Posture

- [ ] Design-time scaffold
- [ ] Runtime template
- [ ] Adapter layer
- [ ] Evaluation artifact
- [ ] Iteration artifact

## Problem

What problem does this solve for the public scaffold?

## Public-Safety Considerations

What public-safe example should be included, and what must stay private?

## Memory, State, And Connectors

- [ ] Touches Memory
- [ ] Touches State
- [ ] Introduces or changes connector behavior
- [ ] Keeps connectors adapter-layer only, with no credentials or side effects

## Proposed Files Or Folders

List the files or folders to create or change.

## Acceptance Criteria

- [ ] Artifact bucket ownership is clear.
- [ ] Public and private boundaries are clear.
- [ ] Memory and State remain separate.
- [ ] Examples are synthetic or generic only.

## Validation Checklist

- [ ] `npm run validate`
- [ ] `git diff --check`
