// Minimal, dependency-free static file server + JSON persistence API.
//
// Why this exists: the app used to be pure static files served by nginx, with all campaign
// data living only in the browser's memory (gone on refresh - hence Export/Import JSON). This
// adds just enough of a backend to auto-save/auto-load that same data to a file on a mounted
// Docker volume, so it survives container restarts and image updates, while still degrading
// gracefully (falling back to in-memory-only + manual Export/Import) if this API isn't reachable
// - e.g. if someone still just opens index.html directly in a browser with no server at all.
//
// No npm dependencies on purpose, to keep the image small and the "no build step" spirit intact
// - only Node's built-in http/fs/path modules.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 80;
const DATA_DIR = process.env.DATA_DIR || '/data';
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const SEED_FILE = path.join(__dirname, 'seed-data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_BODY_BYTES = 25 * 1024 * 1024; // 25MB - generous for a JSON campaign dump, still bounded

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) { console.error('Could not create data dir:', e.message); }

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function serveStatic(req, res, urlPath) {
  const reqPath = urlPath === '/' ? '/index.html' : urlPath;
  // Resolve against the public dir and make sure we didn't escape it (blocks path traversal
  // like "/../server.js" or encoded variants) before touching the filesystem at all.
  const resolved = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(reqPath)));
  if (!resolved.startsWith(PUBLIC_DIR + path.sep) && resolved !== PUBLIC_DIR) {
    res.writeHead(400); res.end('Bad request'); return;
  }
  fs.readFile(resolved, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function handleGetState(req, res) {
  fs.readFile(STATE_FILE, 'utf8', (err, data) => {
    if (!err) { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(data); return; }
    // Nothing saved to the volume yet (fresh install / empty volume) - fall back to the sample
    // data baked into the image, if present, so a brand-new deployment isn't blank.
    fs.readFile(SEED_FILE, 'utf8', (seedErr, seedData) => {
      if (!seedErr) { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(seedData); return; }
      res.writeHead(204); res.end();
    });
  });
}

function handlePutState(req, res) {
  let size = 0;
  const chunks = [];
  let aborted = false;
  req.on('data', (chunk) => {
    if (aborted) return;
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      aborted = true;
      sendJson(res, 413, { error: 'Payload too large' });
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => {
    if (aborted) return;
    const raw = Buffer.concat(chunks).toString('utf8');
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { sendJson(res, 400, { error: 'Invalid JSON: ' + e.message }); return; }
    // Atomic-ish write: write to a temp file in the same directory, then rename over the target,
    // so a crash or concurrent request mid-write can't leave a truncated/corrupt state.json.
    const tmpFile = STATE_FILE + '.tmp-' + process.pid + '-' + Date.now();
    fs.writeFile(tmpFile, JSON.stringify(parsed), (err) => {
      if (err) { sendJson(res, 500, { error: 'Could not write state: ' + err.message }); return; }
      fs.rename(tmpFile, STATE_FILE, (renameErr) => {
        if (renameErr) { sendJson(res, 500, { error: 'Could not save state: ' + renameErr.message }); return; }
        sendJson(res, 200, { ok: true });
      });
    });
  });
  req.on('error', () => { if (!aborted) sendJson(res, 400, { error: 'Request error' }); });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  if (urlPath === '/api/state' && req.method === 'GET') { handleGetState(req, res); return; }
  if (urlPath === '/api/state' && (req.method === 'PUT' || req.method === 'POST')) { handlePutState(req, res); return; }
  if (urlPath === '/healthz') { res.writeHead(200); res.end('ok'); return; }
  if (req.method === 'GET' || req.method === 'HEAD') { serveStatic(req, res, urlPath); return; }
  res.writeHead(405); res.end('Method not allowed');
});

server.listen(PORT, () => {
  console.log(`Campaign manager listening on port ${PORT} (data dir: ${DATA_DIR})`);
});
