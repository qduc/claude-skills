# Consultation Examples

Extended examples demonstrating effective strategist collaboration patterns.

## Example 1: Architecture Decision

### Situation
Building a new feature that requires choosing between multiple architectural approaches.

### Prepared Context

```
Problem: We need to add real-time notifications to our application. Currently,
users refresh the page to see updates. We want to push updates to connected clients.

Current State:
- Monolithic Node.js application
- PostgreSQL database
- ~5,000 concurrent users at peak
- Deployed on AWS with auto-scaling

Constraints:
- 4-person engineering team
- Limited experience with WebSockets or real-time systems
- Must maintain current deployment simplicity
- Budget-conscious, avoiding expensive managed services

Options Considered:
1. WebSockets with Socket.io
2. Server-Sent Events (SSE)
3. Long polling
4. Managed service (Pusher, Ably)

Question: What factors should guide our choice between these options, and
what hidden complexities should we anticipate with each approach?
```

### Strategist Response (Expected Pattern)

The strategist would:
1. Reframe the problem in terms of fundamental trade-offs
2. Identify hidden assumptions (e.g., "real-time" might not mean sub-second)
3. Provide a framework for evaluating options against constraints
4. Highlight risks specific to each option
5. Suggest decision criteria rather than a single answer

### Post-Consultation Actions

After receiving strategic advice:
1. Check existing codebase for any real-time patterns already in use
2. Identify where notification triggers exist in the code
3. Assess which option best fits existing infrastructure patterns
4. Create a proof-of-concept for the top candidate

---

## Example 2: Debugging Strategy

### Situation
Stuck debugging an intermittent issue after multiple failed attempts.

### Prepared Context

```
Problem: Intermittent data inconsistency in our order processing system.
About 0.5% of orders end up with mismatched totals between the order record
and line items.

What We Know:
- Issue appears under high load (>100 orders/minute)
- Never reproducible in development or staging
- Started appearing after a deployment 3 weeks ago
- Logs show correct calculations at time of order creation

What We've Tried:
- Added extensive logging: shows correct values at each step
- Database query analysis: no obvious race conditions in queries
- Code review of calculation logic: appears correct
- Attempted reproduction with load testing: cannot reproduce

Constraints:
- Cannot easily add transactions (legacy system reasons)
- Limited ability to modify database schema
- Production debugging is difficult (customer data)

Question: What debugging strategies or failure patterns should we investigate
that we might be missing? How should we approach diagnosing intermittent
issues we cannot reproduce?
```

### Strategist Response (Expected Pattern)

The strategist would:
1. Identify categories of intermittent failures (race conditions, timing, external dependencies)
2. Suggest systematic isolation strategies
3. Propose diagnostic approaches that don't require reproduction
4. Recommend data analysis patterns to find commonalities in failures
5. Highlight areas the team might have tunnel vision about

### Post-Consultation Actions

1. Apply suggested diagnostic framework to production data
2. Identify patterns in failed orders (time of day, user patterns, etc.)
3. Instrument specific areas suggested by strategist
4. Create monitoring for early detection

---

## Example 3: Prioritization Decision

### Situation
Multiple competing priorities, unclear which to tackle first.

### Prepared Context

```
Problem: We have three significant initiatives competing for our small team's
attention. Leadership wants them all done "as soon as possible" but we need
to sequence them.

Initiative A - Security Audit Fixes:
- External audit identified 15 issues (3 critical, 7 medium, 5 low)
- Regulatory deadline in 4 months
- Requires touching authentication and authorization code

Initiative B - Performance Optimization:
- Customer complaints about slow dashboard loading
- 3 enterprise customers threatening to leave
- Requires database query optimization and caching

Initiative C - New Feature (API Access):
- Largest customer requesting API access for integration
- Contract renewal contingent on delivery
- Requires new authentication layer and rate limiting

Team: 4 engineers (1 senior, 2 mid, 1 junior)
Time Estimate: Each initiative estimated at 6-8 weeks with full team focus

Question: How should we think about sequencing these initiatives? What
framework would help us make this decision objectively rather than based
on whoever is loudest?
```

### Strategist Response (Expected Pattern)

The strategist would:
1. Identify hidden dependencies between initiatives
2. Provide a prioritization framework (urgency vs impact, reversibility, etc.)
3. Suggest ways to parallelize or find synergies
4. Highlight risks of each sequencing option
5. Recommend stakeholder communication strategies

### Post-Consultation Actions

1. Map dependencies in the actual codebase
2. Identify if any initiatives share code paths
3. Create detailed estimates based on actual complexity
4. Present framework and recommendation to leadership

---

## Example 4: Trade-off Analysis

### Situation
Evaluating trade-offs between two valid approaches.

### Prepared Context

```
Problem: Deciding how to handle multi-tenancy for our SaaS application.

Current State:
- Single database with tenant_id columns
- ~200 tenants, largest has 50x data of average
- Growing compliance requirements from enterprise customers

Option A - Shared Database (current approach, enhanced):
- Add row-level security policies
- Improve tenant isolation at application layer
- Lower operational complexity

Option B - Database per Tenant:
- Each tenant gets dedicated database
- True data isolation
- Higher operational complexity, easier compliance story

Context:
- Team of 6, one dedicated to DevOps
- Using PostgreSQL on RDS
- Some enterprise customers asking about data isolation
- Currently ~$5K/month infrastructure cost

Question: What are the second-order consequences of each approach that
we might not be considering? At what scale or circumstance should we
definitely choose one over the other?
```

### Strategist Response (Expected Pattern)

The strategist would:
1. Identify often-overlooked consequences (migrations, backup complexity, etc.)
2. Provide decision criteria based on business trajectory
3. Suggest hybrid approaches if applicable
4. Highlight when to revisit the decision
5. Frame in terms of reversibility and optionality

### Post-Consultation Actions

1. Analyze current tenant data distribution
2. Assess technical feasibility of each approach in current codebase
3. Calculate operational cost differences
4. Create decision document with criteria and recommendation

---

## Example 5: Problem Reframing

### Situation
Feeling stuck, might be solving the wrong problem.

### Prepared Context

```
Problem: We keep building features but user engagement isn't improving.
Last quarter we shipped: advanced filtering, bulk actions, export to CSV,
keyboard shortcuts. Usage metrics are flat.

What We're Observing:
- Feature usage stats show low adoption of new features
- Support tickets haven't decreased
- User interviews say the product is "fine" but not enthusiastic
- Competitor gained market share

What We've Tried:
- Better onboarding for new features
- In-app announcements
- Email campaigns highlighting features
- UI improvements to make features more discoverable

Team Assumption:
- We need to build more/better features

Question: Are we solving the right problem? How should we reframe this
situation to identify what's actually driving flat engagement?
```

### Strategist Response (Expected Pattern)

The strategist would:
1. Challenge the assumption that features drive engagement
2. Suggest alternative problem framings
3. Identify what questions the team should be asking
4. Recommend investigation approaches
5. Highlight potential root causes the team might be blind to

### Post-Consultation Actions

1. Conduct deeper user research focusing on jobs-to-be-done
2. Analyze competitor positioning, not just features
3. Look at usage patterns, not just feature adoption
4. Reassess product strategy based on reframed understanding

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Code Dump

**Bad:**
```
Here's our authentication code:
[500 lines of code]

What's wrong with it?
```

**Why Bad:** Strategist cannot read code. This wastes the consultation.

**Better:** Describe the authentication flow conceptually, what problem you're experiencing, and what you've tried.

---

### Anti-Pattern 2: Vague Problem Statement

**Bad:**
```
Our system is slow. What should we do?
```

**Why Bad:** No context, constraints, or specific question.

**Better:** Describe what "slow" means (metrics), what you've measured, where the bottleneck appears to be, and what constraints exist.

---

### Anti-Pattern 3: Asking for Implementation Details

**Bad:**
```
What library should we use for caching in Node.js?
```

**Why Bad:** This is a tactical question better answered by documentation or experimentation, not strategic consultation.

**Better:** Ask about caching strategy, trade-offs between approaches, or how to evaluate caching solutions for your specific constraints.

---

### Anti-Pattern 4: Not Following Up

**Bad:** Receive strategic advice, immediately implement without validation.

**Why Bad:** Strategist advice is based on described constraints, which may not match codebase reality.

**Better:** Validate recommendations against actual code, adapt to local constraints, re-consult if significant conflicts arise.

---

### Anti-Pattern 5: Asking Multiple Unrelated Questions

**Bad:**
```
Should we use microservices? Also, what testing strategy do you recommend?
And how should we handle deployments?
```

**Why Bad:** Dilutes focus, gets shallow answers to everything.

**Better:** Focus each consultation on one specific decision or problem. Use multiple consultations for unrelated questions.
