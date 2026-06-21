---
name: Documentation improvement
about: Improve docs, README content, examples, maps, guides, or release notes
title: "[Docs]: "
labels: ["documentation", "repo hygiene"]
assignees: ""
---

## Summary

Which doc, example, map, guide, README section, or release note needs work?

## Taxonomy Bucket

Which 14-bucket taxonomy bucket or buckets are affected?

## Issue

What is confusing, missing, stale, or unsafe?

## Public-Safety Considerations

Does this need public/private boundary clarification? What private details must
stay out of the public repo?

## Memory, State, And Connectors

- [ ] Could mix Memory and State
- [ ] Touches Memory guidance
- [ ] Touches State guidance
- [ ] Introduces or changes connector behavior
- [ ] Keeps connectors adapter-layer only, with no credentials or side effects

## Proposed Files Or Folders

List the files or folders to create or change.

## Acceptance Criteria

- [ ] Affected bucket ownership is clear.
- [ ] Public and private boundaries are clear.
- [ ] Memory and State are not blurred.
- [ ] The update stays documentation-only unless explicitly scoped otherwise.

## Validation Checklist

- [ ] `npm run validate`
- [ ] `git diff --check`
- [ ] Link check passes if Markdown links changed.
