---
name: grill-visual
description: Interrogate a plan or design in the browser — opens a local web page and pushes questions with hand-authored HTML diagrams (decision trees, comparison grids, flows) to it, then reads the answers back. Use when the user wants to be grilled visually or graphically, wants a visual/interactive grilling UI instead of terminal Q&A, or invokes grill-visual.
---

# Grill Visual

Interview the user relentlessly about every aspect of this plan until you reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one. **For every question, provide your recommended answer.**

If a question can be answered by exploring the codebase, explore the codebase instead of asking.

The difference from terminal grilling: questions go to a local web page as rendered HTML, so a fork in the design can be *drawn* rather than described. The user invokes this once and then types nothing in the terminal — every answer arrives through the browser.

**Static assets are on disk. Use them as-is.** `client.html`, `server.mjs`, and the class kit below are committed files in this skill directory. Never regenerate, template, inline, or re-emit them per session. The only per-session artifacts are the round files you write, `~/.claude/grill-visual/<session-id>/`, and the exported ledger.

## Delegate the bootstrap

On first invocation, hand the setup to a subagent: start the server via `bin/push-round`, confirm the tab opened and the page rendered, debug anything that did not. Infrastructure noise does not belong in the interview context. Keep your own context on design content.

## The batching rule

This replaces "one question at a time."

Push **1–4 questions per round, typically 2–3, hard cap 4** (the pusher rejects a fifth).

Admit a question into the round only if it passes the **independence test**:

> Would any plausible answer to a question already in this round change this question's options, change its recommendation, or make it moot?

If yes, it waits for the next round. Flat parts of the design therefore go three or four at a time; genuine forks stay serialized, one round each.

**The tradeoff, stated plainly:** batching commits you to a framing before you have heard any answers. When a round comes back and reveals the framing was wrong, **discard the stale questions** and re-ask from the new understanding. Do not push on with options you now know are bad just because they are already written.

## Visual budget

Spend visual weight in proportion to the question's complexity.

| Question | Body |
|---|---|
| A naming preference, a yes/no, a scope trim | none — prose card only |
| Two options with a clear tradeoff | a `.cols` compare, or nothing |
| Three-plus interacting options, or a dependency between them | `.tree` or `.flow` |
| A mechanism the user must picture to answer | `.flow` with `.step` notes |

A text-only question renders as a clean prose card with no empty frame — omit the body rather than filling it.

Optionally give a round one shared visual (a `.tree` with the current branch marked `.on`) showing where each question in the round sits.

## Class kit — consult this before composing every round

Bodies are **raw HTML**. There is no Markdown renderer, no Mermaid, no chart library. Write short semantic markup using these classes and **never write coordinates or inline styles** — the stylesheet does all layout. Drifting into inline-styled markup is how visual consistency is lost.

| Class | Use |
|---|---|
| `.card` | bordered block. `<div class=card><div class=title>Constraint</div>Node stdlib only.</div>` |
| `.cols` | comparison columns. `<div class=cols><div><h4>SSE</h4><ul><li>stdlib</li></ul></div><div><h4>WS</h4><ul><li>dependency</li></ul></div></div>` |
| `.tree` | nested `<ul>` as a decision tree, connectors drawn by CSS. `<ul class=tree><li>Transport<ul><li class=on>SSE</li><li class=off>WebSocket</li></ul></li></ul>` |
| `.flow` + `.step` | annotated flow, arrows between steps. Add `.down` for top-down. `<div class="flow down"><div class=step>Write round<span class=note>1..4 questions</span></div><div class=step>push-round<span class=note>blocks</span></div></div>` |
| `.on` | chosen / live — green, badged "chosen". Works on any element. |
| `.off` | rejected / dimmed — badged "rejected". |
| `.open` | unresolved — amber, badged "open". |

State modifiers self-label, so a diagram needs no legend. They combine with the containers: `<div class="card off">`, `<div class="step on">`, `<li class=open>`.

## Round file format

One file per round. Questions separated by a line containing exactly `%%%`. Each question is frontmatter, then a line containing exactly `---`, then an optional raw-HTML body.

```
id: q1
kind: choice
prompt: Which transport?
options:
  - A. SSE + POST
  - B. WebSocket
recommended: A
---
<ul class=tree><li>Transport<ul><li class=on>SSE</li><li class=off>WS</li></ul></li></ul>
%%%
id: q2
kind: open
prompt: Anything else to add?
---
```

- `id` — short, unique within the round.
- `kind` — `choice` (one), `multi` (several), or `open` (no options).
- `options` — the only list key. Two or more for `choice`/`multi`; none for `open`.
- `recommended` — required in spirit for every question that has options. Give the letter (`A`) or the full option text. It is marked in the UI **and pre-selected**.

Every question also gets a permanently visible "Other / notes" textarea; freeform is a primary answer path, not a fallback.

Malformed rounds fail loudly at parse time, naming the offending question, before anything is pushed.

## The operational loop

1. Write the round to a scratch file (e.g. `/tmp/grill-round-3.md`).
2. Run `skills/grill-visual/bin/push-round <file>` (add `--no-open` to suppress the browser tab). It starts or reuses the session server, pushes the round, and **blocks** until the user submits.
3. Read the answers from stdout. One line per question, `q1: <answer>`, plus an indented `notes:` line when the user typed anything. The answer reads:
   - `A. SSE + POST` — actively chosen.
   - `A. SSE + POST  (accepted recommendation)` — the question was never touched, so this is your recommendation coming back as explicit agreement. An empty submit means agreement with the whole round, and the button says what it is accepting before they press it.
   - `(freeform answer only)` — no option picked; the `notes:` line is the answer.
   - `(no answer)` — nothing picked, nothing typed, nothing recommended.
4. Compose the next round from what you just learned. Discard stale questions.
5. On `DONE GRILLING`, export the ledger and stop asking.

Answers are also appended one JSON object per line to `~/.claude/grill-visual/<session-id>/answers.jsonl` — the durable inbound channel if you ever want to watch it with a persistent `Monitor` on `tail -f`.

**Hard fail rule.** If `push-round` exits non-zero, report the single-line reason to the user and **STOP**. Do not fall back to asking in the terminal, do not retry in a loop. The likeliest cause is a closed tab: the page heartbeats, so "server up, nobody watching" is detected in ~60s instead of hanging forever. The fix is for the user to reopen the printed URL.

## Ledger export

When grilling ends, write the ledger to `./.grill/<slug>.md` in the working directory, where `<slug>` derives from the topic.

Per question: the question, its options, the user's answer, and the resolved decision.

It is a **record of decisions only** — not a design document and not an implementation spec. `grill-design` owns those; do not duplicate them here.

Mention `.grill/` to the user the first time it is created. Do not add it to `.gitignore`.

Then ask the user what they want to do next.
