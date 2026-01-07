import express from "express";
import next from "next";

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const server = express();

// health check
server.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// handle all routes (Express v5 safe)
server.use((req, res) => {
  return handle(req, res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server ready on http://localhost:${port}`);
});
