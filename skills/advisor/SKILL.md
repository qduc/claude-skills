---
name: advisor
description: Use this skill when Claude needs an outside perspective on complex problems, is stuck on a technical challenge, needs validation of an approach, or wants consultation on architectural decisions. Provides access to Codex and Gemini for getting unbiased second opinions and fresh perspectives.
---

# Advisor Skill

This skill enables Claude to consult other AI models when facing challenging problems that benefit from an outside perspective.

## When to Use This Skill

Use the advisor skill when:

- **Stuck on a problem** - Exhausted obvious approaches and need fresh ideas
- **Complex architectural decisions** - Need validation or alternative perspectives on design choices
- **Technical uncertainty** - Unclear about the best approach among multiple options
- **Debugging challenging issues** - Standard debugging hasn't revealed the root cause
- **Validating assumptions** - Want to verify an approach before implementing
- **Need specialized expertise** - Problem involves domains where another perspective helps

## Available Advisors

### Codex
**Best for:** Deep reasoning problems, complex logical challenges, multi-step analysis

**Command:**
```bash
codex e "your query here" 2>/dev/null
```

**Use when:**
- Complex reasoning or planning problems requiring deep thought
- Multi-faceted analysis with many interconnected factors
- Evaluating trade-offs between approaches
- Difficult algorithmic or logical challenges
- Need step-by-step reasoning through complex scenarios

### Gemini
**Best for:** Online research, current information, real-world data, web-based queries

**Command:**
```bash
gemini "your query here" 2>/dev/null
```

**Use when:**
- Need current information or recent developments
- Looking up documentation, APIs, or libraries
- Research on tools, frameworks, or best practices
- Finding examples or solutions from the web
- Checking current status of technologies or standards

## Usage Pattern

### 1. Identify the Need

Before consulting an advisor, clearly identify:
- What problem you're facing
- What you've already tried
- What specific insight you need

### 2. Formulate the Query

Craft a clear, focused query that:
- Provides necessary context
- States the specific question or problem
- Mentions constraints or requirements
- Avoids unnecessary details

### 3. Execute the Consultation

Use the Bash tool with appropriate timeout (10 minutes = 600000ms):

```bash
codex e "How can I efficiently find duplicate entries in a large dataset with 100M+ records while minimizing memory usage?" 2>/dev/null
```

or

```bash
gemini "I'm deciding between microservices and monolith architecture for a medium-sized team. What factors should guide this decision?" 2>/dev/null
```

### 4. Integrate the Response

After receiving advice:
- Evaluate its applicability to your specific context
- Combine it with your own knowledge
- Adapt recommendations to fit the actual requirements
- Make the final decision based on all available information

## Best Practices

**DO:**
- Use advisors when genuinely stuck or uncertain
- Provide clear, focused queries with relevant context
- Allow the full 10-minute timeout for complex queries
- Consider the advisor's perspective alongside your own analysis
- Choose the right advisor for the problem type (Codex for deep reasoning, Gemini for online research)

**DON'T:**
- Consult advisors for straightforward problems you can solve directly
- Use advisors as a substitute for your own analysis
- Include sensitive or proprietary information in queries
- Accept advice blindly without evaluating its fit for your context
- Make excessive queries - reserve for genuinely challenging situations

## Command Template

Always use the Bash tool with these parameters:

```
Bash tool parameters:
- command: codex e "query" 2>/dev/null  OR  gemini "query" 2>/dev/null
- description: "Consulting [Codex/Gemini] about [brief problem description]"
- timeout: 600000  (10 minutes in milliseconds)
```

## Example Scenarios

### Example 1: Deep Reasoning - Architecture Trade-offs

**Situation:** Need to deeply analyze trade-offs between multiple architectural approaches.

**Query to Codex:**
```bash
codex e "I need to design a notification system that handles 100K notifications/day with delivery guarantees. Compare event-driven (Kafka), queue-based (RabbitMQ), and polling approaches. Consider: failure handling, scaling, operational complexity, latency requirements, and team expertise (3 backend devs, no DevOps). What would you recommend and why?" 2>/dev/null
```

### Example 2: Online Research - Current Best Practices

**Situation:** Need to know current best practices for a technology or framework.

**Query to Gemini:**
```bash
gemini "What are the current best practices for implementing authentication in Next.js 14 apps in 2024? I need to understand popular libraries, session vs JWT trade-offs, and security considerations." 2>/dev/null
```

### Example 3: Deep Reasoning - Complex Algorithm Design

**Situation:** Complex algorithmic problem requiring multi-step reasoning.

**Query to Codex:**
```bash
codex e "I need to implement a job scheduler that: 1) respects dependencies between jobs, 2) handles priority levels, 3) supports job cancellation mid-execution, 4) distributes across multiple workers. Walk through the data structures and algorithm design. What are the edge cases and how would you handle them?" 2>/dev/null
```

### Example 4: Online Research - Library/Tool Investigation

**Situation:** Need current information about tools, libraries, or frameworks.

**Query to Gemini:**
```bash
gemini "I need a Python library for parsing PDFs with table extraction. Research current options (2024), compare their accuracy, performance, and ease of use. What do developers recommend?" 2>/dev/null
```

### Example 5: Deep Reasoning - Debugging Complex Logic

**Situation:** Complex bug requiring careful logical reasoning through multiple possibilities.

**Query to Codex:**
```bash
codex e "I have a distributed transaction that occasionally commits on service A but fails on service B, leaving inconsistent state. The retry logic sometimes creates duplicates. Given: idempotency keys, 2PC is not an option, compensation logic exists but races with retries. Reason through the failure scenarios and design a robust solution." 2>/dev/null
```

### Example 6: Online Research - Documentation Lookup

**Situation:** Need to find specific API documentation or examples.

**Query to Gemini:**
```bash
gemini "Find documentation and examples for using PostgreSQL's LISTEN/NOTIFY feature with connection pooling (pgbouncer). What are the gotchas and how do production systems handle this?" 2>/dev/null
```

## Integration with Regular Workflow

The advisor skill complements Claude's normal problem-solving:

1. **Attempt direct solution** - Use your knowledge and available tools first
2. **Identify complexity** - Recognize when a problem is particularly challenging
3. **Consult advisor** - Get outside perspective on the challenging aspects
4. **Synthesize solution** - Combine advisor input with your analysis
5. **Implement** - Execute the solution using all available information

Remember: Advisors provide valuable perspectives, but you remain responsible for the final implementation and ensuring it fits the specific context and requirements.
