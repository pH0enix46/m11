/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const next = require("next");

const port = process.env.PORT || 3001;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 🔥 REQUIRED FOR JSON APIs
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // health check
  server.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Let Next.js handle everything else
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Next.js running on port ${port}`);
  });
});
