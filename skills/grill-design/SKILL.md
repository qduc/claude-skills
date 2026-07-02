---
name: grill-design
description: Investigate and pressure-test the design of a non-trivial software feature before implementation. Use when requirements, architecture, integration points, edge cases, compatibility, migrations, rollout, or testing decisions remain uncertain, especially in an existing codebase.
---

# Grill Feature Design

Reduce uncertainty until implementation is mostly mechanical.

Do not implement the feature while material requirements or technical decisions remain unresolved.

## Understand the request

Restate the requested behavior, success criteria, constraints, and scope.

Distinguish confirmed requirements from assumptions.

Do not silently turn an assumption into a requirement.

## Investigate the existing system

Explore the codebase before asking the engineer questions.

Inspect relevant:

* implementations
* tests
* types and interfaces
* schemas and migrations
* configuration
* documentation and ADRs
* commit history
* deployment and operational setup

Find the closest existing feature and identify the conventions it follows.

Trace the affected flow end to end, including relevant entry points, validation, authorization, business logic, persistence, side effects, external integrations, responses, observability, deployment, and rollback.

Search for direct and indirect consumers before proposing changes to shared behavior or contracts.

## Resolve or escalate ambiguity

Do not silently answer material ambiguities.

Classify each unresolved question and identify its decision owner.

### Questions answerable from evidence

Resolve a question directly only when the answer can be established with sufficient confidence from the existing system.

Use evidence from:

* code
* tests
* types and schemas
* documentation and ADRs
* configuration
* commit history
* operational constraints
* established project conventions

Show the relevant evidence and record any remaining uncertainty.

### Unresolved technical decisions

Escalate technical decisions that cannot be answered from existing evidence to the engineer driving the agent.

Examples include:

* choosing between viable architectures
* introducing a new abstraction
* changing a shared contract
* accepting compatibility, performance, or operational trade-offs
* selecting a migration or rollout strategy
* deciding how much technical debt to address
* choosing among multiple valid implementation patterns

For each decision:

1. State the decision clearly.
2. Explain why the existing system does not determine the answer.
3. Present the feasible options.
4. Describe the trade-offs and risks.
5. Recommend an option.
6. Ask the engineer to decide.

Do not proceed by silently selecting the recommendation.

### Product and business decisions

Escalate questions about intended behavior, business rules, policy, user experience, prioritization, pricing, compliance interpretation, permissions policy, or acceptable business risk to the engineer driving the agent.

The engineer acts as the interface to the product or business owner.

Help the engineer form a precise question by providing:

1. The decision product or business must make.
2. The feasible options.
3. The user and business consequences.
4. The technical consequences and constraints.
5. The engineering recommendation, when relevant.

Do not invent product behavior merely because one option is easier to implement.

### Mixed decisions

Separate technical constraints from product choice.

First investigate what the system permits and the cost or risk of each option.

Then escalate the remaining decision to the engineer, clearly indicating whether it requires:

* an engineering decision
* a product or business decision
* joint agreement

## Walk the decision tree

Explore one material ambiguity at a time.

For each unresolved branch:

1. Explain why it matters.
2. Investigate whether existing evidence resolves it.
3. Present realistic options when a decision remains.
4. Recommend an option.
5. Ask the engineer to decide.
6. Resolve the consequences before moving to the next branch.

Do not overwhelm the engineer with a large questionnaire when the questions depend on one another.

## Minimize the change

Prefer the smallest design that fits the existing architecture.

Reuse established patterns unless they directly cause the problem being solved.

Do not combine unrelated cleanup or broad refactoring with the feature.

When technical debt blocks the feature, isolate the minimum prerequisite refactor and explain why it is necessary.

## Pressure-test the design

Check the design against plausible risks in the actual system, including:

* invalid, missing, or duplicate input
* authorization boundaries
* concurrency and retries
* partial failure and idempotency
* stale data and ordering
* timeouts and cancellation
* backward compatibility
* mixed application versions
* migration and rollback safety
* performance and resource usage
* logging, metrics, and testing

Do not manufacture unlikely edge cases merely to make the design appear exhaustive.

## Produce the design artifact

Write a concise design containing:

* user-visible behavior
* scope and non-goals
* current system and constraints
* proposed end-to-end flow
* affected components and ownership
* data, schemas, and interfaces
* important decisions and trade-offs
* failure and edge-case handling
* compatibility, migration, rollout, and rollback
* test strategy
* breadth-first implementation sequence
* unresolved decisions and their owners

Do not hand off to implementation while a material decision remains unanswered, unless the engineer explicitly approves:

* a documented assumption
* a reversible default
* feature-flagged behavior
* a bounded technical spike

The agent investigates, recommends, and pressure-tests. The engineer remains the decision-making interface.

When implementation disproves an assumption, revise the design rather than forcing the code to follow it.
