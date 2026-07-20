#!/usr/bin/env node
/**
 * Kairos local preview server — LOCAL ONLY (Vercel serves the real thing).
 *
 * Replaces `python -m http.server` for previewing `site/`. Two reasons it exists:
 *
 *  1. `Cache-Control: no-store` on every response. The Python server sent no
 *     caching headers at all, which licenses the browser (and Claude's built-in
 *     Browser pane, whose `navigate` doesn't reliably hard-reload subresources)
 *     to serve a STALE `site/css/main.css` after `npm run build` — reads and
 *     screenshots then faithfully reflect the OLD stylesheet. `no-store` forces a
 *     fresh fetch every time, so a rebuild is always picked up with no cache-bust
 *     ritual. (This does NOT address the separate snapshot/animation race — that
 *     one is inherent to observing a never-idle page through a capture channel.)
 *
 *  2. Parity with `vercel.json` (`cleanUrls: true`): extensionless URLs resolve
 *     to `.html`, and unknown routes serve `404.html` with a 404 status — so the
 *     local preview matches production instead of drifting from it.
 *
 *   node scripts/preview-server.mjs [port]   # default 4173
 *   npm run preview                          # same, via package.json
 */

import { createServer } from "node:http";
import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "site"); // the deploy output dir
const PORT = Number(process.argv[2] || process.env.PORT || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

/** Resolve a URL pathname to a file inside ROOT, honoring cleanUrls. Returns an
 *  absolute path inside ROOT, or null if it escapes ROOT / nothing matches. */
async function resolveFile(pathname) {
  let rel = decodeURIComponent(pathname.split("?")[0]);
  if (rel.endsWith("/")) rel += "index.html";

  const abs = path.resolve(ROOT, "." + rel);
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) return null; // traversal guard

  const candidates = [abs];
  if (!path.extname(abs)) candidates.push(abs + ".html", path.join(abs, "index.html")); // cleanUrls

  for (const c of candidates) {
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {
      /* try next */
    }
  }
  return null;
}

async function send(res, status, filePath, fallbackBody) {
  const headers = { "Cache-Control": "no-store" };
  if (filePath) {
    headers["Content-Type"] = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(status, headers);
    res.end(await readFile(filePath));
  } else {
    headers["Content-Type"] = "text/html; charset=utf-8";
    res.writeHead(status, headers);
    res.end(fallbackBody || "");
  }
}

const server = createServer(async (req, res) => {
  try {
    const file = await resolveFile(req.url || "/");
    if (file) return void (await send(res, 200, file));
    // Miss → 404.html with a 404 status (matches Vercel), else a plain 404.
    const notFound = await resolveFile("/404.html");
    return void (await send(res, 404, notFound, "404 Not Found"));
  } catch (err) {
    await send(res, 500, null, "500 Internal Server Error");
    console.error(err);
  }
});

server.listen(PORT, () => {
  console.log(`Kairos preview → http://localhost:${PORT}  (serving ${path.relative(process.cwd(), ROOT)}/, Cache-Control: no-store)`);
});
