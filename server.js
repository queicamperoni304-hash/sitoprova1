#!/usr/bin/env node
/* Server statico senza dipendenze per sito/.
   Railway assegna la porta in PORT e richiede l'ascolto su 0.0.0.0. */
const http = require('node:http');
const fs   = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, 'sito');
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html':'text/html; charset=utf-8',
  '.css' :'text/css; charset=utf-8',
  '.js'  :'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.jpg' :'image/jpeg',
  '.jpeg':'image/jpeg',
  '.png' :'image/png',
  '.svg' :'image/svg+xml',
  '.webp':'image/webp',
  '.ico' :'image/x-icon',
  '.woff2':'font/woff2',
  '.woff':'font/woff',
  '.txt' :'text/plain; charset=utf-8',
  '.xml' :'application/xml; charset=utf-8'
};

/* i frame del film, i font e le librerie sono immutabili: si servono una volta sola.
   index.html no, altrimenti un aggiornamento non arriva mai al visitatore. */
function cacheFor(rel, ext){
  if (ext === '.html') return 'no-cache';
  if (/^(radar|fonts|vendor)\//.test(rel)) return 'public, max-age=31536000, immutable';
  return 'public, max-age=3600';
}

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { res.writeHead(400).end('Bad Request'); return; }

  if (req.method !== 'GET' && req.method !== 'HEAD'){
    res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method Not Allowed');
    return;
  }

  let rel = pathname.replace(/^\/+/, '');
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';

  const file = path.resolve(ROOT, rel);
  /* nessuna uscita dalla cartella servita */
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)){
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()){
      res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' }).end('404');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    const head = {
      'Content-Type'  : TYPES[ext] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control' : cacheFor(rel, ext),
      'X-Content-Type-Options': 'nosniff'
    };
    res.writeHead(200, head);
    if (req.method === 'HEAD'){ res.end(); return; }
    fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Kompla in ascolto su 0.0.0.0:' + PORT + ' — radice ' + ROOT);
});
