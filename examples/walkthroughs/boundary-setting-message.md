# Boundary-Setting Message Walkthrough

## Purpose

This synthetic walkthrough shows how the Strategic Mirror Agent handles a
workplace communication request without adding runtime behavior. It demonstrates
how the agent reads context, separates durable Memory from live State, drafts a
message, and proposes updates without silently writing private context.

## Scenario Summary

Alex works at ExampleCo. Morgan has asked Alex to coordinate follow-up work for
a cross-functional project. The request is helpful on the surface, but ownership,
time, decision rights, and dependency tracking are unclear. Alex wants to stay
collaborative without absorbing invisible project management work.

## User Request

Draft a concise chat message to Morgan. I can help clarify risks and next steps,
but I do not want to become the default coordinator unless Jordan is confirmed
as the owner of dependency tracking.

## Relevant Synthetic Memory

These entries are examples of durable Memory. They would still be useful after
the current situation ends.

| Memory area | Synthetic entry | Why it is Memory |
| --- | --- | --- |
| Communication preference | Alex prefers direct, practical messages that preserve collaboration without over-apologizing. | Stable tone preference across workplace messages. |
| Boundary pattern | Alex tends to absorb coordination work when ownership is unclear. | Recurring risk pattern, not limited to one project. |
| Career goal | Alex wants to be seen as a strategic operator, not the person who catches all unassigned process work. | Durable positioning goal. |
| Working style | Alex is comfortable summarizing risks, options, and decisions when the accountable owner is named. | Stable working-style context. |

## Relevant Synthetic State

These entries are examples of live State. They are tied to the current request
and should expire or be reviewed soon.

| State item | Synthetic entry | Why it is State |
| --- | --- | --- |
| Active situation | Morgan asked Alex to coordinate follow-up work for the ExampleCo launch readiness project. | Current workplace situation. |
| Open decision | Jordan has not yet been confirmed as dependency tracking owner. | Pending decision. |
| Next action | Alex needs to reply to Morgan before the next planning check-in. | Time-bound action. |
| Uncertainty | It is unclear whether Morgan is asking for a risk summary, ongoing coordination, or both. | Live ambiguity. |
| Stale-after | Review after the planning check-in or after ownership is clarified. | This State should not persist indefinitely. |

## Agent Read Of The Situation

Morgan's request may be an attempt to close a coordination gap, but the gap is
structural: there is no confirmed owner for dependency tracking. If Alex simply
says yes, Alex may inherit the work without authority to drive decisions. The
useful move is to offer a concrete contribution while making ownership explicit.

Known:

- Morgan asked for coordination help.
- Jordan is the suggested owner for dependency tracking.
- Alex is willing to provide a risk summary.

Inferred:

- The project may have unclear operating structure.
- Alex is at risk of becoming the informal owner if the reply is too open-ended.

Uncertain:

- Whether Morgan wants a one-time summary or ongoing project management.
- Whether Jordan has accepted or been assigned ownership.

## Strategic Reasoning Summary

The draft should not reject the work. It should narrow Alex's contribution to a
useful, bounded deliverable: a risk summary and proposed next steps. It should
then make dependency ownership the condition for clean execution.

The positioning move is: "I am helping the project move, and I am making the
ownership gap visible before it becomes hidden labor." This protects Alex's
lane without sounding defensive or checked out.

Sequence:

1. Acknowledge the useful outcome.
2. Offer the specific contribution Alex can make.
3. Name the ownership dependency.
4. Ask for confirmation of the next step.

## Draft Output

```text
Morgan, I can pull together a short risk summary and proposed next steps for the
group. To keep the follow-up clean, can we confirm Jordan as the owner for
dependency tracking before I send it? That way I can frame the risks clearly
without becoming the default coordinator for every open item.
```

## Tradeoffs And Recommendation

Tradeoff:

- This draft optimizes for clarity, collaboration, and boundary protection.
- It gives up some softness by naming the risk of default coordination directly.

Recommendation:

Use this version if Morgan is generally direct and there is enough trust to name
the boundary plainly. If Morgan is sensitive to process concerns, use a slightly
softer final sentence:

```text
That way the summary can point people to the right owner for each follow-up.
```

## Memory Update Proposal

Do not write this automatically. Present it to Alex for approval in the private
runtime instance.

| Field | Proposed value |
| --- | --- |
| Entry | Alex prefers boundary-setting drafts that offer a concrete contribution before clarifying ownership. |
| Source | Synthetic walkthrough user request and agent output. |
| Confidence | Medium. One example supports it, but it should be confirmed across more interactions. |
| Date added | Example date only. |
| Review cadence | Review after several similar workplace communication requests. |
| Privacy sensitivity | Medium in a private instance, because it reflects workplace communication strategy. |
| Public-use permission | No for real instances. Public examples must remain synthetic only. |

Why this is Memory:

- It describes a reusable communication preference and boundary pattern.
- It is not tied only to the ExampleCo launch readiness situation.

## State Update Proposal

Do not write this automatically. Present it to Alex for approval in the private
runtime instance.

| Field | Proposed value |
| --- | --- |
| Item | ExampleCo launch readiness follow-up ownership. |
| Owner | Unconfirmed. Jordan is the proposed dependency tracking owner. |
| Status | Waiting on Morgan to confirm ownership and scope. |
| Deadline or clock | Before the next planning check-in. |
| Next action | Alex sends the bounded reply to Morgan. |
| Uncertainty | Morgan may expect ongoing coordination rather than a one-time risk summary. |
| Stale after | After the planning check-in or when ownership is confirmed. |
| Related memory references | Boundary pattern: Alex should avoid absorbing unowned coordination work. |
| Related connector source | None in this public walkthrough. Manual context only. |

Why this is State:

- It is tied to a live project request, pending decision, and near-term reply.
- It should expire after the ownership question is resolved.

## Guardrail Notes

- This walkthrough uses only synthetic names: Alex, Morgan, Jordan, and ExampleCo.
- The draft does not quote or transform a real workplace message.
- No real employer, manager, peer, team, client, project, system, or connector
  details are included.
- No private Memory, live State, raw trace, credential, local environment value,
  or private connector configuration is included.
- Connector posture remains explicit: no connector source is used, and any
  connector-fed context in a private runtime would require approval,
  classification, and reconciliation before use.
- The agent proposes Memory and State updates rather than silently writing them.
- The draft avoids false urgency, hollow affirmation, groveling, and territorial
  language.

## Why This Belongs In The Public Repo

The file is a public-safe behavior example. It demonstrates the scaffold's
intended reasoning pattern, output shape, Memory and State separation, and
guardrail posture using synthetic data only. It does not add runtime features or
publish private workplace context.

## Validation Note

This walkthrough is documentation-only. It is intended to pass the repository
validation checks with the rest of the scaffold:

```bash
npm run validate
git diff --check
```
