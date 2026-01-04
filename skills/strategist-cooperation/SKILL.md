---
name: strategist-cooperation
description: This skill should be used when Claude is facing complex architectural decisions, is stuck on a problem and going in circles, needs validation before investing significant effort, is dealing with trade-off analysis between multiple approaches, or needs an unbiased outside perspective. Guides effective collaboration with the strategist agent who provides expert advice without codebase access.
---

# Strategist Cooperation

This skill provides guidance for effectively collaborating with the strategist agent—a remote expert who offers unbiased, objective advice on complex problems but cannot access the codebase directly.

## Understanding the Strategist

The strategist operates as an experienced consultant working from a remote location:

**What the strategist brings:**
- Fresh perspective unencumbered by existing code or sunk costs
- Experience with patterns across many projects and domains
- Structured frameworks for decision-making
- Ability to challenge assumptions constructively
- Focus on principles over implementation details

**What the strategist lacks:**
- Access to the actual codebase
- Knowledge of specific file structures or implementations
- Ability to read or analyze code directly
- Context about local constraints unless explicitly provided

## When to Consult the Strategist

### Good Fit

Consult the strategist when:

| Situation | Example |
|-----------|---------|
| Architecture decisions | Choosing between monolith vs microservices, selecting a database strategy |
| Multiple valid approaches | Several solutions exist, unclear which is best for the context |
| Going in circles | Tried multiple approaches, keep hitting walls |
| Need validation | Want to verify an approach before significant investment |
| Trade-off analysis | Evaluating pros/cons of different technical choices |
| Problem decomposition | Complex problem needs breaking into manageable pieces |
| Risk assessment | Identifying potential issues before committing |
| Too close to the problem | Lost objectivity, need fresh eyes |

### Poor Fit

Do not consult the strategist for:

- **Straightforward tasks** - Clear implementation path, no real decisions
- **Code-level questions** - Syntax, API usage, specific implementation details
- **Debugging specific code** - Requires reading the actual files
- **Questions needing codebase context** - "Where is X defined?" or "How does Y work in this project?"

## Preparing Context for the Strategist

Since the strategist cannot see the code, provide context effectively:

### 1. Summarize the Problem in Plain Language

Transform code-specific issues into conceptual descriptions:

**Instead of:** "The `UserService.authenticate()` method is calling `TokenManager.validate()` which queries the database on every request"

**Write:** "Authentication validates tokens by hitting the database on every request, causing performance issues under load"

### 2. State Constraints and Requirements Clearly

List non-negotiable constraints:
- Team size and expertise
- Timeline pressures
- Budget limitations
- Technical constraints (must use X, cannot use Y)
- Business requirements

### 3. Explain What Has Been Tried

Describe previous attempts and why they failed:
- "Tried caching but invalidation was complex"
- "Considered async processing but latency requirements prevent it"
- "Looked at library X but it lacks feature Y"

### 4. Frame as a Clear Question or Decision

End with a specific question:
- "Given these constraints, should we optimize the current approach or redesign?"
- "Between options A, B, and C, which factors should drive the decision?"
- "What risks am I missing in this proposed architecture?"

### 5. Provide Just Enough Context

Include relevant context without overwhelming:
- System scale (users, requests/sec, data volume)
- Current architecture overview (conceptual, not code)
- Key integration points
- What success looks like

## Invoking the Strategist

Use the Task tool to consult the strategist:

```
Task tool:
  subagent_type: "advisor-skills:strategist"
  prompt: [Your prepared context and question]
  description: "Strategic advice on [topic]"
```

### Example Invocation

```
Task tool:
  subagent_type: "advisor-skills:strategist"
  description: "Architecture advice on caching"
  prompt: |
    Problem: Our API response times degrade significantly under load because
    we validate authentication tokens against the database on every request.

    Constraints:
    - 3-person team, limited DevOps expertise
    - Must maintain current security guarantees
    - Cannot add significant infrastructure complexity

    Tried:
    - Simple in-memory cache, but token revocation became inconsistent
    - Considered Redis, but team lacks operational experience

    Question: What caching strategies should we evaluate for token validation
    that balance performance, security, and operational simplicity?
```

## Handling Strategist Advice

### Treat as Guidance, Not Orders

The strategist provides frameworks and options, not implementation specs. Their advice must be adapted to local reality.

### Validate Against the Codebase

Before implementing strategist recommendations:
1. Check if existing code already partially implements the suggestion
2. Identify files and modules that would need modification
3. Assess whether the recommendation fits the current architecture
4. Look for patterns in the codebase that align or conflict

### Adapt to Local Constraints

The strategist doesn't know about:
- Existing abstractions that could be leveraged
- Technical debt that might complicate changes
- Team conventions and coding standards
- Dependencies and their limitations

Modify recommendations to fit these realities.

### Report Back When Advice Doesn't Fit

If strategist advice conflicts with codebase reality:
1. Identify the specific conflict
2. Re-consult with additional context
3. Ask for alternative approaches given the constraint

## Collaboration Workflow

### Standard Flow

```
1. Encounter complex decision or get stuck
2. Recognize this is a good fit for strategist consultation
3. Prepare context (summarize problem, state constraints, frame question)
4. Invoke strategist agent with prepared context
5. Receive strategic advice and frameworks
6. Validate advice against actual codebase
7. Adapt recommendations to local constraints
8. Implement the adapted solution
```

### Iterative Consultation

For complex problems, multiple rounds may be needed:

**Round 1:** Frame the problem, get initial direction
**Round 2:** Share what was discovered while implementing, refine approach
**Round 3:** Validate final solution design

Keep each consultation focused on a specific question rather than trying to solve everything at once.

## Communication Patterns

### Effective Problem Statements

**Good:** "Choosing between event-driven and request-response patterns for service communication. Team has 5 engineers, mostly synchronous experience. System handles 10K requests/minute with occasional spikes to 50K."

**Poor:** "How should our services communicate?" (too vague, no context)

### Effective Questions

**Good:** "What factors should drive the decision between patterns A and B given our constraints?"

**Poor:** "Which is better, A or B?" (asks for prescription without context)

### Effective Follow-ups

**Good:** "The strategist suggested caching with TTL-based invalidation. However, our system has strict consistency requirements for token revocation. How might we balance cache performance with immediate invalidation needs?"

**Poor:** "That won't work." (no explanation of why)

## Integration with Problem-Solving

The strategist complements, not replaces, direct problem-solving:

1. **Attempt direct solution first** - Use available knowledge and tools
2. **Recognize when stuck or uncertain** - Multiple failed attempts, going in circles, facing a fork in the road
3. **Consult strategist** - Get outside perspective on the challenging aspect
4. **Synthesize** - Combine strategic advice with codebase knowledge
5. **Implement** - Execute the adapted solution
6. **Learn** - Note what patterns worked for future similar situations

## Additional Resources

For detailed examples and advanced patterns, consult:
- **`references/consultation-examples.md`** - Extended examples of effective strategist consultations
