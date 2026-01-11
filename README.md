# Advisor Skills for Claude Code

**Empower Claude with a "Council of Experts" for better decision-making.**

## Introduction

This plugin extends Claude Code's capabilities by giving it the ability to **consult specialized external models and agents**. Just as senior engineers seek second opinions or research documentation when stuck, this toolset allows Claude to:

1.  **Break Tunnel Vision:** Use the **Strategist** agent to get an unbiased, high-level perspective on architectural decisions. By delegating complex reasoning to this specialized sub-agent (using the **Opus** model), you save costs by reserving high-intelligence processing only for critical strategic decisions while keeping your main session efficient.
2.  **Verify & Research:** Use **Gemini** to fetch real-time documentation and libraries, preventing hallucinations about outdated APIs.
3.  **Deepen Reasoning:** Use **Codex** to handle complex algorithmic logic and multi-step reasoning tasks that require a dedicated focus.

Instead of relying on a single model's training data, this workflow enables a collaborative AI approach to problem-solving.

## Installation

Add this collection to your Claude Code environment:

```bash
/plugin marketplace add qduc/advisor-skills
```

## Skills

### Consult

**Seek second opinions from specialized AI models and agents**

The Consult skill enables Claude to seek advice from various sources:
- **Strategist Agent** - Unbiased, objective advice on complex strategic decisions and architectural trade-offs.
- **Codex** - Deep reasoning for complex logical problems and multi-faceted analysis.
- **Gemini** - Online research for current information, documentation, and real-world examples.

Use when stuck on difficult problems, validating approaches, or needing fresh perspectives.

**Installation:**
```bash
/skill install consult
```

### Strategist Cooperation

**Guidelines for effective collaboration with the Strategist agent**

Provides patterns and best practices for working with the Strategist, including session continuity, preparing context, and handling advice.

**Installation:**
```bash
/skill install strategist-cooperation
```

## Agents

### Strategist

**Unbiased, objective advice on complex strategic decisions**

A specialized agent that provides an outsider's perspective on difficult problems without being influenced by existing code, implementation details, or project constraints.

**Key capabilities:**
- Radical objectivity - evaluates everything purely on merit
- Fresh perspective - unencumbered by technical debt or sunk costs
- Strategic thinking - focuses on fundamental principles
- Devil's advocate - challenges assumptions and explores alternatives

**Use when:**
- Stuck on architectural decisions and going in circles
- Team debates with strong conflicting opinions
- Need to cut through bias and see the situation with fresh eyes
- Evaluating major refactoring or rewrite decisions

The agent applies first principles thinking, identifies hidden assumptions, and provides decision frameworks rather than prescriptive solutions.

## Repository Structure

```
claude-skills/
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── agents/
│   └── strategist.md
├── skills/
│   ├── consult/
│   │   └── SKILL.md
│   └── strategist-cooperation/
│       └── SKILL.md
└── README.md
```

## Contributing

Skills in this collection are designed for personal productivity and AI-enhanced problem-solving workflows.

## License

MIT
