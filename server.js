const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const HTML_FILE = path.join(__dirname, 'index.html');

function readLogs() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}

function writeLogs(logs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(logs, null, 2));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Serve frontend
  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync(HTML_FILE));
  }

  // GET logs
  if (method === 'GET' && url === '/api/logs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(readLogs()));
  }

  // POST logs (full replace — client sends entire array)
  if (method === 'POST' && url === '/api/logs') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const logs = JSON.parse(body);
        writeLogs(logs);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400);
        res.end('Bad JSON');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Rejs Borzy running at http://localhost:${PORT}`);
});
