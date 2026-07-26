---
name: cartographer
description: Work that's too big to hold in one session, planned as a living map of unknowns — named destination, sharp questions, and fog — resolved one at a time, and kept open through implementation so unknowns found mid-build come back to the map instead of into the diff.
disable-model-invocation: true
---

The map is not the territory. The **map** is what you hand the agent — prompts, specs, context, this file. The **territory** is where the work actually lands: the codebase, the constraints, the taste nobody wrote down. The gap between them is **unknowns**, and every unknown the agent hits, it resolves by guessing at what you wanted.

For small work you can absorb the guesses. For work too big to hold in one session, you can't — the guesses compound, and the thread dies with the context window. This skill keeps one artifact, `MAP.md`, that survives sessions: it names where you're going, holds the unknowns you can phrase and the ones you can only sense, and stays open through implementation so unknowns found late come back to the map rather than silently into the diff.

The destination varies. A spec to hand off, a decision to lock, a change made in place like a data migration. Naming it is the first act, because it fixes scope and everything else is judged against it. The shape is domain-agnostic — engineering, writing, course design, whatever fits.

## The four kinds of unknown

Everything on the map is one of these. Knowing which you're holding tells you what move to make.

| | You know it's there | You don't |
|---|---|---|
| **You can state it** | **Known known** — it's in the spec. Write it in **Notes** or the destination and stop thinking about it. | **Unknown known** — obvious to you, never written down. You'd recognize it instantly if you saw it violated. |
| **You can't** | **Known unknown** — a sharp question with no answer yet. This is an **Open** entry. | **Unknown unknown** — you haven't considered it at all. This is **Fog**. |

The two on the right are where the work is. **Unknown knowns** are drawn out by prototypes and references — you can't enumerate your taste, but you'll react to a rough artifact in seconds. **Unknown unknowns** are drawn out by breadth-first grilling and by shipping something and watching what breaks.

The whole discipline is moving things leftward and upward, cheaply, before they get expensive.

## Plan, don't do — but stay open

Default output is **decisions, not deliverables**. Each open question resolves something; the map is *ready* when nothing is left to decide before someone goes and builds. The pull to just start building usually means you've reached the edge and it's handoff time.

But ready is not done. Unknowns surface deep in implementation, and sometimes an unknown reveals you should be solving the problem a different way entirely. So the map stays live: when implementation hits something the map didn't anticipate, it goes back to the map — as a new question, a graduated patch of fog, or in the worst and most valuable case, a redrawn destination.

An effort can override the default in **Notes** and carry execution into the map itself. Absent that, decide here and build elsewhere.

## Refer by name

Every question has a name. In everything a human reads, use the name — never a bare number. `Q3, Q4, Q7` is illegible; names read at a glance.

## The map

One file, `MAP.md`, at the root of the effort. Canonical, and the only thing loaded in full at session start.

It is an **index, not a store**. Real detail — a research write-up, a prototype, a resolved design — lives in its own file under `map/`. The map holds a one-line gist and a link. A decision lives in exactly one place.

```markdown
# <effort name>

## Destination

<what reaching the end of this map looks like. One or two lines; every session
orients to it before choosing a question. Redrawing this is allowed and
significant — note the date and why.>

## Notes

<domain; references worth pointing at (source code beats prose); skills or docs
every session should consult; standing preferences; known knowns worth stating
once so nobody re-litigates them>

## Decided

- **<question name>** — <one-line gist of the answer> → [detail](map/<slug>.md)

## Open

<!-- known unknowns: sharp enough to phrase now. Mode in brackets, blockers named. -->

- **<question name>** [grill] — <the question, one or two lines>
- **<question name>** [research] — <the question> — *blocked by: <name>*

## Fog

<!-- unknown unknowns you've caught a glimpse of: in scope, not yet sayable.
     Graduates into Open as answers clear the way. -->

## Out of scope

<!-- ruled past the destination. Never graduates. -->

## Found in the territory

<!-- unknowns surfaced during or after implementation: what the map missed and
     what it cost. Feeds back into Open, Fog, or the destination. -->
```

## Modes

Every question is **HITL** — worked *with* a human who speaks for themselves — or **AFK**, driven alone. A HITL question only resolves through that live exchange; never stand in for the human's side. An agent that answers its own grilling questions has defeated the point.

- **`[research]`** (AFK) — read docs, third-party APIs, local knowledge, to surface a fact a decision waits on. Use when the answer exists outside the working directory. Findings to `map/<slug>.md`.
- **`[prototype]`** (HITL) — make something cheap, rough and concrete to react to: an outline, a stub, working UI, a bad first draft. This is the tool for **unknown knowns** — the criteria that only become visible once something exists to violate them. Use when *how should it look* or *how should it behave* is the real question. Link the artifact; don't paste it in.
- **`[grill]`** (HITL) — interview, one question at a time, **prioritizing questions whose answer would change the shape of the thing**. Not five trivial questions; one structural one. The default mode.
- **`[task]`** (either) — manual work blocking a decision. Nothing to decide, prototype or research, but the discussion can't move until it's done: signing up for a service so its API can be judged, provisioning access, moving data so its shape is visible. The only mode that *does* rather than decides, and it earns its place by unblocking a decision, not by delivering the destination. Record what was done and any facts later questions depend on — where credentials live, new URLs, row counts.

Picking the mode before you start is most of the value. It stops you grinding conversationally on something that was always a go-and-look-it-up, and stops you researching something that needed a rough sketch and a reaction.

**On references:** when you can't describe what you want — no language for it, or it'd take an hour — point at an existing implementation instead. Source code is the highest-bandwidth reference there is, and it works even across languages and domains. A reference belongs in **Notes**, not in a question.

## Fog of war

The map is *deliberately* incomplete. Don't chart what you can't see. Beyond the open questions is **fog** — decisions you can tell are coming but can't pin down, because they hang on questions still open. Resolving a question clears the fog ahead of it, graduating whatever became sayable into fresh open questions, until the way is clear.

**Fog or question?** The test is whether you can state it precisely *now* — **not** whether you can answer it now.

- **Open** when the question is already sharp, even if blocked.
- **Fog** when you can't phrase it that sharply. Write as loosely as the view allows.

Don't pre-slice fog into question-shaped pieces. It's coarser than a question, and one patch may graduate into several, or none, once the frontier reaches it.

Fog excludes what's decided, what's already open, and what's out of scope.

## Out of scope

Fog only gathers *toward* the destination. Work beyond it isn't fog — it's **out of scope**, consciously ruled out of *this* effort. Scope, not sharpness, lands it there, and it never graduates. It returns only if the destination is redrawn, and then as a fresh effort.

When an open question turns out to sit past the destination — mis-scoped while charting, or exposed by an answer — move it out with one line on why. It stays out of **Decided**, which records the route actually walked; a scope boundary isn't a step on it.

## Invocation

Three modes. **Never resolve more than one question per session** — research excepted, since it can run in parallel without contaminating the next decision.

### Chart

Invoked with a loose idea.

1. **Name the destination.** Grill until you've pinned down what this is finding its way to. Scope first, because everything else is judged against it.
2. **Map the frontier.** Grill again, **breadth-first**: fan out across the space rather than deep on one thread. Ask explicitly for the unknowns most likely to change the implementation, grouped by risk — what the codebase might hide, what the product assumes, what rollout demands. **Nothing edits yet.**
3. **If no fog surfaces**, the way is already clear and the journey fits one session. You don't need a map. Stop and say so.
4. **Write `MAP.md`.** Destination and Notes filled, **Decided** empty, sharp questions in **Open** with modes and blockers, the rest sketched into **Fog**.
5. **Fire the research.** Anything `[research]` can run now, in parallel, into `map/<slug>.md`.
6. Stop. Charting is one session's work and resolves nothing by hand.

### Work

Invoked with the map. A named question is optional — without one, you pick.

1. Load `MAP.md` entire, and nothing else yet.
2. Choose: the named question, or the first unblocked entry in **Open**.
3. Resolve it. **Zoom as needed** — open detail files for related decisions on demand, consult whatever **Notes** points at.
4. Record: detail to `map/<slug>.md`, then a one-line gist and link under **Decided**.
5. **Re-survey.** Add newly surfaced questions. Graduate any fog the answer made sayable, clearing it from **Fog** so it lives in one place. If the answer reveals something sits past the destination, rule it out of scope. If it invalidates other parts of the map, rewrite or delete them.

Step 5 is where the value is. A good answer reshapes what's left — which is exactly why you take one per session. Batching means deciding the later questions on stale information.

### Return

Invoked from implementation, when the territory disagrees with the map.

1. Write what was found under **Found in the territory**: the unknown, and what it cost to hit it late.
2. Route it. A sharp question → **Open**. A vague sense there's more of this → **Fog**. Past the destination → **Out of scope**.
3. **Check the destination.** If the finding means the problem should be solved a different way, say so plainly rather than patching around it. Redrawing the destination is expensive and sometimes correct; burying the contradiction is neither.
4. Resume implementation only once the routing is written down. An unknown resolved silently in the diff is one nobody can find again.

When a long task comes back wrong, the first question isn't *what should I have prompted*. It's *which unknown did I fail to surface while it was still cheap* — and then it goes on the map.