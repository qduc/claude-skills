---
name: implement-feature
description: Implement an approved software feature as thin end-to-end slices before hardening individual components. Use when a concrete feature design or implementation plan already exists and the task requires safe incremental implementation in an existing codebase.
---

# Implement Feature

Implement the feature breadth first.

Prove the complete path through the system before fully developing any isolated layer.

## Check the design

Confirm that the design defines:

* intended behavior
* affected components
* important interfaces and data changes
* meaningful edge cases
* compatibility constraints
* rollout and rollback
* test strategy
* resolved decision ownership

Return to design work if fundamental decisions remain unresolved.

Do not silently make a material technical or product decision during implementation.

## Establish the skeleton

Add the minimum structure needed for the feature to exist.

This may include types, interfaces, routes, service boundaries, configuration, feature flags, migration scaffolding, and test fixtures.

Keep the project compiling and tests runnable.

Avoid building complete isolated components that are not yet connected to the real feature path.

## Build a thin end-to-end slice

Implement the smallest representative happy path through the actual system.

Exercise the real integration points where practical:

* entry point
* validation
* authorization
* domain or service logic
* persistence or external dependency
* response or presentation
* one useful end-to-end or integration test

Use this slice to verify that the design fits the codebase.

## Expand breadth first

Add the remaining major behaviors as end-to-end increments before deeply polishing individual layers.

Cover alternate valid paths, expected failures, authorization outcomes, persistence variations, integration outcomes, and user-visible states.

Keep each increment small, runnable, and reviewable.

Report progress in terms of completed behavior rather than files or components changed.

## Harden depth first

After the feature exists across the full path, strengthen each component.

Add the required:

* detailed validation
* edge-case handling
* concurrency protection
* retry and idempotency behavior
* timeout and cancellation handling
* performance safeguards
* structured logging and metrics
* focused unit and integration tests

Follow established project patterns.

Do not introduce a new architecture unless the existing architecture cannot safely support the feature and the engineer approves the decision.

## Protect the existing system

Search usages before changing shared contracts.

Prefer additive and backward-compatible changes.

Keep the blast radius small.

Separate prerequisite refactors from feature behavior when that improves safety or reviewability.

Verify migrations, mixed-version operation, feature flags, rollback, observability, and resource usage.

## Respond to discoveries

Treat implementation as validation of the design.

When reality contradicts the design:

1. Stop at the affected boundary.
2. Identify the invalid assumption.
3. Investigate the codebase.
4. Determine whether existing evidence resolves the issue.
5. Update the design when the answer is established.
6. Escalate the decision to the engineer when multiple valid choices remain.
7. Resume from the revised plan.

For an unresolved technical decision, present the feasible options, trade-offs, risks, and a recommendation.

For a product or business decision, explain the technical constraints and help the engineer formulate the question for the appropriate product owner.

Do not hide design changes inside the implementation.

Do not continue by silently choosing a convenient default.

## Finish cleanly

Remove temporary scaffolding, debug code, dead branches, and obsolete comments.

Update tests and documentation to match the implemented behavior.

Consider the feature complete only when:

* it works end to end
* agreed edge cases are covered
* existing behavior remains protected
* compatibility and rollout requirements are satisfied
* operational failures are observable
* temporary implementation scaffolding is removed
* the final code remains consistent with the surrounding codebase
* no material decision was made without the appropriate owner
