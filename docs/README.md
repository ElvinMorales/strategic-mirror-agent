# Documentation

This index points to the main public scaffold docs without duplicating their
content.

## Start Here

- [Install guide](../INSTALL.md) explains how to adapt the public scaffold into
  Claude web, Claude Code, or local Markdown workflows.
- [Release notes v0.1.0](release-notes-v0.1.0.md) summarizes the initial public
  scaffold release.
- [Public safety](public-safety.md) defines what can be published and what must
  stay private.

## Architecture And Artifact Map

- [Architecture](architecture.md) explains the file-first scaffold structure.
- [Artifact map](artifact-map.md) maps the repo to the 14-bucket agent artifact
  taxonomy.
- [Memory versus State](memory-vs-state.md) explains the durable context and
  live execution context split.

## Private Instance Guidance

- [Private instance guide](private-instance-guide.md) explains how to create a
  private runtime boundary outside the public repo.

## Framework And Host Adaptation

- [Framework mapping notes](framework-mapping.md) show how to adapt the scaffold
  to host environments without treating any host as the architecture.
- [Connector strategy](connector-strategy.md) describes the connector-ready,
  file-first posture.

## Decisions

- [Decision records](decisions/) index architecture and governance decisions.
- [ADR 0001: Connectors as adapter-layer artifacts](decisions/0001-connectors-as-adapters.md)
  records why connectors stay at the implementation edge.

## Release And Roadmap

- [Roadmap v0.2.0](roadmap-v0.2.0.md) outlines likely next public scaffold
  improvements and non-goals.
- [Changelog](../CHANGELOG.md) tracks public scaffold changes.

## Public Safety

- [Issue templates](../.github/ISSUE_TEMPLATE/) support artifact, docs, eval,
  and public-safety review requests.
- [Pull request template](../.github/pull_request_template.md) keeps review
  attention on validation, public safety, and private boundary checks.

## Examples And Evals

- [Examples](../examples/) collect synthetic, public-safe examples.
- [Walkthroughs](../examples/walkthroughs/) show public-safe end-to-end usage
  patterns.
- [Schema instances](../examples/schema-instances/) provide valid example JSON
  records for schema validation.
- [Evals](../evals/) provide synthetic cases and a rubric for manual review.
