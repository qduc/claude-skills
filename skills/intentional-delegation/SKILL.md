---
name: intentional-delegation
description: Before beginning any implementation, investigation, review, or other task expected to take more than a trivial amount of work
---

# Subagent Delegation

## Purpose

Use subagents deliberately to reduce cognitive load, improve parallelism, or obtain independent judgment. Delegate because it improves the outcome—not because delegation is the default.

The controller (you) owns planning, decomposition, integration, and final decisions. Subagents own bounded missions.

---

## Before Delegating

Ask these questions:

1. Can I describe the task with a clear objective and acceptance criteria?
2. Can the task be completed without my entire working context?
3. Will delegation provide meaningful value through isolation, specialization, parallelism, or independent review?
4. Can I verify the result without redoing the work myself?

If most answers are yes, delegate. Otherwise, keep the work in the controller.

---

## Choose the Right Worker

### Controller

Keep work in the controller when it requires:

* planning or decomposition
* integrating multiple pieces of work
* maintaining continuous context
* resolving technical ambiguity
* escalating product or business ambiguity to the engineer
* making final technical decisions

---

### Execution Subagent (Lower Intelligence: Sonnet-if you are Opus; Haiku-if you are Sonnet)

Use for work that is already defined.

Examples:

* implement an approved design
* search the codebase
* gather information
* enumerate call sites
* perform mechanical refactors
* execute a migration
* run tests and summarize failures
* compare code against a checklist

Execution agents should not invent solutions when requirements are unclear. If they encounter meaningful ambiguity, they should stop and report it.

---

### Consulting Subagent (Higher Intelligence: Fable-if you are Opus; Opus-if you are Sonnet)

Use when independent judgment is valuable.

Examples:

* review an architecture
* challenge assumptions
* identify edge cases
* compare implementation strategies
* perform security or performance review
* look for hidden risks
* determine whether technical ambiguity should be escalated

Consulting agents provide recommendations, not final decisions.

---

## Delegate Independent Work

Prefer tasks that are naturally isolated.

Good:

* backend implementation
* frontend implementation
* migration plan
* documentation
* performance investigation

Avoid splitting work with heavy back-and-forth dependencies.

---

## Keep Context Small

Give each subagent only the information it needs.

Include:

* objective
* relevant files
* constraints
* expected output
* acceptance criteria

Avoid copying unnecessary conversation history.

---

## Integrate Carefully

Never assume a subagent is correct.

Review:

* correctness
* consistency with the overall design
* interactions with other completed work
* unresolved questions

The controller owns the final result.
