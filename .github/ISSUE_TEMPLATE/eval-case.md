---
name: Eval case
about: Propose a new eval case or rubric improvement
title: "[Eval]: "
labels: ["repo hygiene"]
assignees: ""
---

## Summary

What behavior should be tested?

## Taxonomy Bucket

Which 14-bucket taxonomy bucket or buckets are affected?

## Case Type

- [ ] Positive case
- [ ] Negative case
- [ ] Regression case
- [ ] Rubric improvement

## Synthetic Input

What synthetic input should be used?

## Expected Behavior

What should the eval or rubric check?

## Public-Safety Considerations

What safety or privacy failure should this avoid?

## Memory, State, Connectors, And Outputs

- [ ] Touches Memory
- [ ] Touches State
- [ ] Touches connectors
- [ ] Touches outputs or schemas
- [ ] Keeps examples synthetic or generic only

## Proposed Files Or Folders

List the files or folders to create or change.

## Acceptance Criteria

- [ ] Expected behavior is clear.
- [ ] Privacy and safety failure modes are named.
- [ ] Memory and State remain separate.
- [ ] Connector behavior remains adapter-layer only.

## Validation Checklist

- [ ] `npm run validate`
- [ ] `git diff --check`
- [ ] Schema or example validation passes if schemas or examples changed.
