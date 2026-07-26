# Claude Skills

A collection of agents and skills for Claude Code that structure how AI tackles complex work — planning, reviewing, implementing, and coordinating.

## Agents

### Explore

**Read-only search agent for broad codebase fan-out searches.**

Locates code by reading excerpts rather than whole files. Supports three thoroughness levels: quick, medium, and very thorough. Uses the haiku model to keep costs low.

### Consultant

**Senior technical reviewer consulted at decision points.**

Verifies claims against actual code, finds load-bearing assumptions, and returns a single recommendation with a blocks/doesn't-block verdict. Uses the fable model.

Use before committing to an approach, when stuck on recurring errors, or when work appears complete.

## Skills

### Cartographer

**Plan work too big for one session as a living map of unknowns.**

Maintains a `MAP.md` that names the destination, tracks open questions, and stays live through implementation. Unknowns found during building go back to the map instead of silently into the diff.

Four modes for resolving questions: research, prototype, grill, and task.

### Coordinator

**Orchestrate work by delegating to specialized subagents.**

Breaks complex requests into components, selects the right agent for each, and coordinates execution — parallel where possible, serial where dependent.

### Grill Design

**Pressure-test a feature design before implementation.**

Investigates the existing codebase, resolves ambiguity by escalating to the engineer, walks the decision tree one question at a time, and produces a design artifact. Continues until implementation is mostly mechanical.

### Implement Feature

**Implement an approved design as thin end-to-end slices.**

Builds breadth-first: establishes a skeleton, proves the complete happy path, then expands coverage before hardening individual layers. Protects the existing system throughout.

## Repository Structure

```
├── agents/
│   ├── Explore.md
│   └── consultant.md
├── skills/
│   ├── cartographer/SKILL.md
│   ├── coordinator/SKILL.md
│   ├── grill-design/SKILL.md
│   └── implement-feature/SKILL.md
└── README.md
```

## License

MIT
