---
name: strategist-cooperation
description: Guides effective collaboration with the strategist agent—a remote expert providing unbiased advice on complex architectural decisions, trade-offs, and problems where you're stuck or need outside perspective. The strategist cannot access the codebase.
---

# Strategist Cooperation

The strategist is a remote consultant offering fresh perspective on complex problems. They bring experience across many projects but cannot see your code.

## Key Constraint: Stateless

Each consultation is independent—the strategist has no memory of previous conversations. Always provide complete context, and reference previous advice explicitly in follow-ups.

```
Bad:  "What about the token issue we discussed?"
Good: "Previously you suggested TTL-based caching. I've found our system
       requires immediate revocation. How can we balance both needs?"
```

## When to Consult

**Good fit:**
- Architecture decisions with multiple valid approaches
- Going in circles after multiple failed attempts
- Trade-off analysis between competing options
- Need validation before significant investment
- Lost objectivity, need fresh eyes

**Poor fit:**
- Straightforward implementation tasks
- Code-level questions (syntax, API usage, debugging)
- Questions requiring codebase access ("where is X defined?")

## Before Consulting: Explore First

The strategist provides strategic advice; you must ground it in your codebase reality. Before consulting:

1. Search for existing implementations of similar functionality
2. Understand current architecture patterns and constraints
3. Check dependencies and technical limitations
4. Note what's been tried and why it failed

## Preparing Context

**Avoid biasing the strategist.** You're seeking fresh perspective—don't contaminate it by presenting your preferred solution or framing the problem to lead toward a conclusion. State facts and constraints neutrally.

```
Biased:   "We need to add Redis for caching because our current approach
           is clearly inadequate and Redis is industry standard."
Neutral:  "Token validation hits the database on every request, causing
           latency under load. We're evaluating caching options."
```

Since the strategist cannot see code, translate technical details into concepts:

**Instead of:** "The `UserService.authenticate()` calls `TokenManager.validate()` hitting the database each request"

**Write:** "Authentication validates tokens via database query on every request, causing performance issues under load"

**Include:**
- Problem summary in plain language
- Constraints (team size, timeline, technical limitations)
- What you've tried and why it didn't work
- A specific question or decision to address

### Example Context

```
Problem: Authentication validates tokens against the database on every
request, degrading performance under load.

Constraints:
- 3-person team, limited DevOps expertise
- Must maintain current security guarantees
- Cannot add significant infrastructure complexity

Tried:
- Simple in-memory cache—token revocation became inconsistent
- Considered Redis—team lacks operational experience

Question: What caching strategies balance performance, security, and
operational simplicity for our situation?
```

## Invoking the Strategist

```
Task tool:
  subagent_type: "advisor-skills:strategist"
  description: "Architecture advice on [topic]"
  prompt: [Your prepared context and question]
```

## Handling Advice

Strategist recommendations are guidance, not implementation specs.

1. **Validate against codebase** — Check if existing code partially implements suggestions
2. **Adapt to local constraints** — Modify for technical debt, team conventions, dependencies
3. **Re-consult if needed** — If advice conflicts with reality, provide that context and ask for alternatives

## Iterative Consultation

Complex problems require multiple rounds. Each round must include full context since the strategist is stateless.

**Pattern:**
1. Initial consultation → Get direction and framework
2. Explore/implement → Discover specifics in your codebase
3. Follow-up → Share findings, ask about challenges (include previous advice)
4. Refine → Adjust and implement
5. Repeat as needed

### Example: Iterative Flow

**Round 1:**
```
Problem: Token validation hits database on every request, causing
performance issues under load (~500 req/sec).

Constraints: Small team, can't add Redis, need simple solution.

Question: What caching approaches should we consider?
```
*Strategist suggests TTL-based in-memory caching with fallback validation.*

**You explore codebase, find existing session manager.**

**Round 2:**
```
Previously you suggested TTL-based caching for token validation.
I've explored our codebase and found we have an existing session
manager that tracks user state.

Question: How should we integrate token caching with our existing
session infrastructure rather than building separate cache?
```
*Strategist provides integration guidance.*

**You implement, discover edge case with immediate revocation.**

**Round 3:**
```
Building on the session manager integration you suggested, I've
implemented caching but discovered our compliance requires immediate
token revocation (within 1 second). TTL-based caching can't guarantee this.

Question: How can we handle immediate revocation while keeping cache benefits?
```
*Strategist suggests event-driven invalidation pattern.*

## Common Mistakes

**Vague problem statements**
- Bad: "Our system is slow. What should we do?"
- Good: Describe metrics, what you've measured, where bottlenecks appear, constraints

**Asking for implementation details**
- Bad: "What Node.js caching library should we use?"
- Good: Ask about caching strategy and trade-offs for your constraints

**Multiple unrelated questions**
- Bad: "Should we use microservices? Also, what testing strategy? And deployment?"
- Good: One focused question per consultation

**Skipping post-consultation validation**
- Bad: Implement advice immediately without checking codebase fit
- Good: Validate against actual code, adapt to local constraints, re-consult if conflicts arise

**Assuming memory**
- Bad: "What about the issue we discussed earlier?"
- Good: Summarize previous advice, explain what you learned, ask specific follow-up

**Leading the witness**
- Bad: "Redis is clearly the right choice here, right?" or "Our architecture is fundamentally broken"
- Good: Present facts neutrally, let the strategist form their own conclusions
