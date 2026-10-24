// EduWealth AI - Development & Prototype Preview Server
// AI-Powered Financial Education & Wealth-Building Platform for Students

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const normalizedDir = path.resolve(__dirname).toLowerCase();

const server = http.createServer((req, res) => {
  // Normalize URL path
  let safePath = req.url.split('?')[0];
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  const resolvedPath = path.resolve(__dirname, '.' + safePath);

  // Security check: ensure path is within directory (case-insensitive for Windows)
  if (!resolvedPath.toLowerCase().startsWith(normalizedDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If requested file not found, fall back to index.html for SPA routing
      const indexPath = path.join(__dirname, 'index.html');
      fs.stat(indexPath, (indexErr, indexStats) => {
        if (!indexErr && indexStats.isFile()) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(indexPath).pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: ' + safePath);
        }
      });
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'X-Powered-By': 'EduWealth AI Prototype'
    });

    const stream = fs.createReadStream(resolvedPath);
    stream.on('error', (streamErr) => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
      }
      res.end('Internal Server Error');
    });
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please terminate existing process or use another port.`);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log('===========================================================');
  console.log('  EDUWEALTH AI - FINANCIAL EDUCATION & WEALTH PLATFORM');
  console.log('  "Turn Financial Knowledge into Financial Freedom"');
  console.log(`  Local Server: http://localhost:${PORT}`);
  console.log('===========================================================');
});
