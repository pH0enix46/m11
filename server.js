#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 5000;

app.prepare().then(() => {
  // Use Node's built-in HTTP server
  const http = require("http");

  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Next.js app ready on port ${PORT}`);
  });
});
