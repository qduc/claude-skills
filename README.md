# Claude Skills Collection

Custom Claude Code skills and agents for enhanced AI collaboration and problem-solving.

## Installation

Add this collection to your Claude Code environment:

```bash
/plugin marketplace add qduc/claude-skills
```

## Skills

### Advisor

**Consult external AI models when facing complex challenges**

The Advisor skill enables Claude to seek second opinions from specialized AI models:
- **Codex** - Deep reasoning for complex logical problems, multi-faceted analysis, and architectural trade-offs
- **Gemini** - Online research for current information, documentation, and real-world examples

Use when stuck on difficult problems, validating approaches, or needing fresh perspectives.

**Installation:**
```bash
/skill install advisor
```

## Agents

### Neutral Advisor

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
│   └── marketplace.json
├── agents/
│   └── neutral-advisor.md
├── skills/
│   └── advisor/
│       └── SKILL.md
└── README.md
```

## Contributing

Skills in this collection are designed for personal productivity and AI-enhanced problem-solving workflows.

## License

MIT
