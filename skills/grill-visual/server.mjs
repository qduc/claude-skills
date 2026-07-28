#!/usr/bin/env node
// grill-visual server. Node stdlib only. Binds 127.0.0.1. Token-gated.
//
// Started only by bin/push-round. Serves the STATIC client.html that sits next
// to this file (resolved via import.meta.url) — the page is never templated or
// regenerated per session; the token and port reach it through its own URL.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_PATH = path.join(HERE, 'client.html');

const IDLE_MS = 2 * 60 * 60 * 1000; // exit after ~2h of silence
const CLIENT_STALE_MS = 15_000; // a beat older than this means nobody is watching

const args = process.argv.slice(2);
const argOf = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};

const stateDir = argOf('--state');
const token = argOf('--token');
if (!stateDir || !token) {
  console.error('grill-visual: server requires --state <dir> --token <token>');
  process.exit(2);
}

fs.mkdirSync(stateDir, { recursive: true });
const ANSWERS = path.join(stateDir, 'answers.jsonl');
const SERVER_JSON = path.join(stateDir, 'server.json');

/** @type {{history: any[], pending: any, status: string, lastBeat: number}} */
const S = {
  history: [],
  pending: null,
  status: 'thinking', // waiting | thinking | (client decides 'disconnected')
  done: false,       // 'Done grilling' pressed — survives a page reload
  lastBeat: 0,
};

const sseClients = new Set();
const waiters = new Set(); // push-round long-polls parked here

let idleTimer = null;
function touch() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    try { fs.unlinkSync(SERVER_JSON); } catch {}
    process.exit(0);
  }, IDLE_MS);
  idleTimer.unref?.();
}

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try { res.write(payload); } catch { sseClients.delete(res); }
  }
}

const clientLive = () => Date.now() - S.lastBeat < CLIENT_STALE_MS;

function snapshot() {
  return { history: S.history, pending: S.pending, status: S.status, done: S.done };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 4_000_000) reject(new Error('body too large'));
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  res.end(body);
}

// Requests must carry the session token and must not come from a foreign origin.
function authorized(req, url) {
  const supplied = url.searchParams.get('token') || req.headers['x-grill-token'];
  if (supplied !== token) return false;
  const origin = req.headers.origin;
  if (origin) {
    try {
      const h = new URL(origin).hostname;
      if (h !== '127.0.0.1' && h !== 'localhost') return false;
    } catch { return false; }
  }
  return true;
}

// A fast user can answer before push-round's first /wait request lands. Park the
// result so the next /wait claims it instead of blocking on an answer that has
// already been given.
let unclaimed = null;

function settleWaiters(result) {
  if (waiters.size === 0) { unclaimed = result; return; }
  for (const res of waiters) {
    try { json(res, 200, result); } catch {}
  }
  waiters.clear();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const p = url.pathname;

  if (p === '/health') return json(res, 200, { ok: true, pid: process.pid });

  if (!authorized(req, url)) return json(res, 403, { error: 'forbidden' });
  touch();

  // ---- the static page -------------------------------------------------
  if (p === '/' || p === '/index.html') {
    let html;
    try {
      html = fs.readFileSync(CLIENT_PATH);
    } catch {
      return json(res, 500, { error: `client.html missing at ${CLIENT_PATH}` });
    }
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'content-length': html.length,
      'cache-control': 'no-store',
    });
    return res.end(html);
  }

  // ---- lossless reload -------------------------------------------------
  if (p === '/state') {
    S.lastBeat = Date.now();
    return json(res, 200, snapshot());
  }

  if (p === '/heartbeat') {
    S.lastBeat = Date.now();
    return json(res, 200, { status: S.status });
  }

  // ---- server -> browser ----------------------------------------------
  if (p === '/events') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-store',
      connection: 'keep-alive',
    });
    // 3s, not 1s: after the server exits the browser retries forever, and a
    // once-per-second reconnect fills the console with connection-refused noise.
    res.write('retry: 3000\n\n');
    res.write(`event: state\ndata: ${JSON.stringify(snapshot())}\n\n`);
    sseClients.add(res);
    S.lastBeat = Date.now();
    const ping = setInterval(() => { try { res.write(': ping\n\n'); } catch {} }, 20_000);
    ping.unref?.();
    req.on('close', () => { clearInterval(ping); sseClients.delete(res); });
    return;
  }

  // ---- Claude -> server (push-round) ----------------------------------
  if (p === '/push' && req.method === 'POST') {
    let round;
    try { round = JSON.parse(await readBody(req)); } catch { return json(res, 400, { error: 'bad json' }); }
    unclaimed = null; // a new round supersedes any unread result
    S.done = false;   // a new round re-opens a session the user had ended
    S.pending = round;
    S.status = 'waiting';
    broadcast('round', snapshot());
    return json(res, 200, { ok: true, clientLive: clientLive() });
  }

  // push-round parks here until the browser answers
  if (p === '/wait') {
    if (unclaimed) { const r = unclaimed; unclaimed = null; return json(res, 200, r); }
    const deadline = Number(url.searchParams.get('timeout') || 60_000);
    let timer;
    const finish = (code, obj) => {
      clearTimeout(timer);
      waiters.delete(res);
      try { json(res, code, obj); } catch {}
    };
    waiters.add(res);
    // The realistic failure is "server up, tab closed". Detect it, never hang.
    timer = setTimeout(() => {
      if (!clientLive()) finish(200, { error: 'no browser client connected' });
      else { waiters.delete(res); json(res, 200, { pending: true }); }
    }, deadline);
    timer.unref?.();
    req.on('close', () => { clearTimeout(timer); waiters.delete(res); });
    return;
  }

  // ---- browser -> server ----------------------------------------------
  if (p === '/answer' && req.method === 'POST') {
    let payload;
    try { payload = JSON.parse(await readBody(req)); } catch { return json(res, 400, { error: 'bad json' }); }
    S.lastBeat = Date.now();

    const round = S.pending || { questions: [] };
    const record = {
      ts: new Date().toISOString(),
      done: Boolean(payload.done),
      answers: Array.isArray(payload.answers) ? payload.answers : [],
    };
    // answers.jsonl is the durable inbound channel: one JSON object per line.
    fs.appendFileSync(ANSWERS, JSON.stringify(record) + '\n');

    for (const a of record.answers) {
      const q = (round.questions || []).find((x) => x.id === a.id) || {};
      S.history.push({
        id: a.id,
        prompt: q.prompt || a.id,
        options: q.options || [],
        selected: a.selected || [],
        notes: a.notes || '',
        accepted: Boolean(a.accepted),
      });
    }

    if (record.done) S.done = true;
    S.pending = null;
    S.status = 'thinking';
    broadcast('state', snapshot());
    settleWaiters({ ...record, resolved: true });
    return json(res, 200, { ok: true });
  }

  return json(res, 404, { error: 'not found' });
});

server.on('error', (err) => {
  console.error(`grill-visual: server error: ${err.message}`);
  process.exit(1);
});

server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  fs.writeFileSync(
    SERVER_JSON,
    JSON.stringify({ pid: process.pid, port, token, started: Date.now() }, null, 2),
  );
  touch();
  console.error(`grill-visual: listening on http://127.0.0.1:${port}/?token=${token}`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    try { fs.unlinkSync(SERVER_JSON); } catch {}
    process.exit(0);
  });
}
