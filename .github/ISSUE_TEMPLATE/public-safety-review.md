---
name: Public-safety review
about: Review whether a public-facing file, example, note, or artifact is safe
title: "[Safety]: "
labels: ["repo hygiene"]
assignees: ""
---

## Summary

What file, PR, example, connector note, or artifact needs review?

## Taxonomy Bucket

Which 14-bucket taxonomy bucket or buckets are affected?

## Risk Being Checked

What kind of public-safety risk is being checked?

## Public-Safety Considerations

- [ ] No real workplace messages
- [ ] No real employer, team, person, client, system, or workflow details
- [ ] No private Memory
- [ ] No live State
- [ ] No raw traces or observability data
- [ ] No connector credentials
- [ ] No local environment values
- [ ] No private connector configs
- [ ] No regulated or confidential data

## Memory, State, And Connectors

- [ ] Includes or implies private Memory
- [ ] Includes or implies live State
- [ ] Includes connector credentials or local configs
- [ ] Introduces or changes connector behavior
- [ ] Keeps connectors adapter-layer only, with human approval for actions

## Required Changes

What needs to be removed, generalized, replaced with placeholders, or moved to a
private instance?

## Proposed Files Or Folders

List the files or folders to create or change.

## Acceptance Criteria

- [ ] The artifact is public-safe or removed from the public repo.
- [ ] Private details are generalized or moved to a private instance.
- [ ] Memory and State boundaries are preserved.
- [ ] Connector posture remains safe and credential-free.

## Validation Checklist

- [ ] `npm run validate`
- [ ] `git diff --check`
- [ ] Manual public-safety review completed.
