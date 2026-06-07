import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4174);
const host = "127.0.0.1";
  const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".webm": "audio/webm"
  };

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  const route = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, route));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const total = stat.size;
    const ext = path.extname(filePath);
    const mime = types[ext] || "application/octet-stream";
    const range = request.headers.range;

    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      const start = m && m[1] ? parseInt(m[1], 10) : 0;
      const end = m && m[2] ? parseInt(m[2], 10) : total - 1;
      const chunk = end - start + 1;

      response.writeHead(206, {
        "Content-Type": mime,
        "Content-Length": chunk,
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Accept-Ranges": "bytes"
      });
      fs.createReadStream(filePath, { start, end }).pipe(response);
    } else {
      response.writeHead(200, {
        "Content-Type": mime,
        "Content-Length": total,
        "Accept-Ranges": "bytes"
      });
      fs.createReadStream(filePath).pipe(response);
    }
  });
});

server.listen(port, host, () => {
  console.log(`Birthday archive running at http://${host}:${port}`);
});
