#!/usr/bin/env node
// push-round <round-file> [--no-open]
//
// The ONLY entry point. Parses and validates the round (loudly, before anything
// is pushed), starts-or-reuses the session server, pushes the round, and blocks
// until the browser answers — then prints the answers to stdout.
//
// Hard fail, no fallback: any problem exits non-zero with one line on stderr.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(HERE, '..', 'server.mjs');

const die = (msg) => {
  process.stderr.write(`grill-visual: ${msg}\n`);
  process.exit(1);
};

const argv = process.argv.slice(2);
const noOpen = argv.includes('--no-open');
const roundFile = argv.find((a) => !a.startsWith('--'));
if (!roundFile) die('usage: push-round <round-file> [--no-open]');

// ---------------------------------------------------------------- round file

/**
 * Round file = 1..4 questions separated by a line of exactly `%%%`.
 * Each question = flat frontmatter (plus one `options:` list), a line of
 * exactly `---`, then an optional raw-HTML body.
 */
function parseRound(text, file) {
  const bad = (q, why) => die(`${file}: question ${q} — ${why}`);
  const chunks = text.split(/^%%%[ \t]*$/m).map((c) => c.trim()).filter(Boolean);
  if (chunks.length === 0) bad('(none)', 'file contains no questions');
  if (chunks.length > 4) die(`${file}: ${chunks.length} questions — hard cap is 4 per round`);

  const seen = new Set();
  const questions = chunks.map((chunk, i) => {
    const label = `#${i + 1}`;
    const lines = chunk.split('\n');
    const sep = lines.findIndex((l) => l.trim() === '---');
    if (sep === -1) bad(label, 'missing the `---` line between frontmatter and body');

    const fm = {};
    let list = null;
    for (const raw of lines.slice(0, sep)) {
      const line = raw.replace(/\s+$/, '');
      if (!line.trim()) continue;
      const item = line.match(/^\s+-\s+(.*)$/);
      if (item) {
        if (!list) bad(label, `list item "${item[1]}" appears before any list key`);
        list.push(item[1].trim());
        continue;
      }
      const kv = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
      if (!kv) bad(label, `cannot parse frontmatter line: ${JSON.stringify(line)}`);
      const [, key, value] = kv;
      if (value === '') { list = []; fm[key] = list; } else { list = null; fm[key] = value; }
    }

    const body = lines.slice(sep + 1).join('\n').trim();
    const q = {
      id: fm.id,
      kind: fm.kind,
      prompt: fm.prompt,
      options: Array.isArray(fm.options) ? fm.options : [],
      recommended: typeof fm.recommended === 'string' ? fm.recommended : '',
      body,
    };

    if (!q.id) bad(label, 'missing `id`');
    if (seen.has(q.id)) bad(q.id, 'duplicate id in this round');
    seen.add(q.id);
    if (!['choice', 'multi', 'open'].includes(q.kind)) {
      bad(q.id, `kind must be choice|multi|open, got ${JSON.stringify(q.kind ?? null)}`);
    }
    if (!q.prompt) bad(q.id, 'missing `prompt`');
    if (q.kind !== 'open' && q.options.length < 2) {
      bad(q.id, `kind ${q.kind} needs at least 2 options, got ${q.options.length}`);
    }
    if (q.kind === 'open' && q.options.length) bad(q.id, 'kind open must not list options');
    if (q.recommended) {
      const hit = q.options.find((o) => o === q.recommended || o.startsWith(`${q.recommended}.`) || o.startsWith(`${q.recommended} `));
      if (!hit) bad(q.id, `recommended ${JSON.stringify(q.recommended)} matches no option`);
      q.recommended = hit;
    }
    return q;
  });

  return { id: crypto.randomUUID(), pushed: new Date().toISOString(), questions };
}

let round;
try {
  round = parseRound(fs.readFileSync(roundFile, 'utf8'), roundFile);
} catch (err) {
  if (err?.code === 'ENOENT') die(`round file not found: ${roundFile}`);
  throw err;
}

// ---------------------------------------------------------------- state dir

function sessionId() {
  const env = process.env.CLAUDE_CODE_SESSION_ID;
  if (env) return env.replace(/[^A-Za-z0-9._-]/g, '_');
  const h = crypto.createHash('sha256').update(`${process.cwd()}\n${process.ppid}`).digest('hex');
  return `cwd-${h.slice(0, 16)}`;
}

const stateDir = path.join(os.homedir(), '.claude', 'grill-visual', sessionId());
fs.mkdirSync(stateDir, { recursive: true });
const serverJson = path.join(stateDir, 'server.json');

const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };

function readServer() {
  try {
    const s = JSON.parse(fs.readFileSync(serverJson, 'utf8'));
    return s && s.pid && alive(s.pid) ? s : null;
  } catch { return null; }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const OPENERS = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', ['/c', 'start', '']] };

function openBrowser(url) {
  const spec = OPENERS[process.platform];
  if (!spec) return;
  const [cmd, pre = []] = spec;
  try {
    spawn(cmd, [...pre, url], { detached: true, stdio: 'ignore' }).unref();
  } catch { /* the URL is printed anyway */ }
}

async function startServer() {
  try { fs.unlinkSync(serverJson); } catch {}
  const token = crypto.randomUUID();
  const log = fs.openSync(path.join(stateDir, 'server.log'), 'a');
  const child = spawn(process.execPath, [SERVER, '--state', stateDir, '--token', token], {
    detached: true,
    stdio: ['ignore', log, log],
  });
  child.unref();

  for (let i = 0; i < 100; i++) {
    const s = readServer();
    if (s?.port) {
      try {
        const r = await fetch(`http://127.0.0.1:${s.port}/health`);
        if (r.ok) return { ...s, fresh: true };
      } catch { /* not up yet */ }
    }
    if (!alive(child.pid)) break;
    await sleep(100);
  }
  let tail = '';
  try { tail = fs.readFileSync(path.join(stateDir, 'server.log'), 'utf8').trim().split('\n').slice(-1)[0] || ''; } catch {}
  die(`server failed to start (state: ${stateDir})${tail ? ` — ${tail}` : ''}`);
}

// ---------------------------------------------------------------- run

const api = (s, p, q = '') => `http://127.0.0.1:${s.port}${p}?token=${encodeURIComponent(s.token)}${q}`;

function render(record) {
  const out = [];
  const byId = new Map(round.questions.map((q) => [q.id, q]));
  for (const a of record.answers || []) {
    const q = byId.get(a.id);
    const picked = (a.selected || []).join(' | ');
    // "accepted" only means something when there WAS a recommendation to accept;
    // an untouched open question is simply unanswered, not agreement.
    let line;
    if (picked) line = a.accepted ? `${picked}  (accepted recommendation)` : picked;
    else if (a.notes) line = '(freeform answer only)';
    else line = q?.recommended ? '(accepted recommendation)' : '(no answer)';
    out.push(`${a.id}: ${line}`);
    if (a.notes) out.push(`  notes: ${a.notes.replace(/\n/g, '\n         ')}`);
  }
  if (record.done) out.push('DONE GRILLING: the user ended the session.');
  return out.join('\n');
}

const existing = readServer();
const server = existing || (await startServer());

const url = api(server, '/');
if (server.fresh && !noOpen) openBrowser(url);
process.stderr.write(`grill-visual: ${url}\n`);

const pushed = await fetch(api(server, '/push'), {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(round),
}).catch((e) => die(`could not push round: ${e.message}`));
if (!pushed.ok) die(`server rejected the round (HTTP ${pushed.status})`);

// Block until answered. The first /wait window is the connect deadline: if no
// browser has checked in within ~60s the tab is closed and we fail loudly.
for (;;) {
  let res;
  try {
    res = await fetch(api(server, '/wait', '&timeout=60000'));
  } catch (e) {
    die(`lost the server while waiting for answers: ${e.message}`);
  }
  const body = await res.json();
  if (body.error) die(`${body.error} — open ${url} and retry`);
  if (body.resolved) {
    process.stdout.write(render(body) + '\n');
    process.exit(0);
  }
  // body.pending: a live tab, user still thinking — keep waiting.
}
