/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const cors = require("cors");

const app = express();

// Passenger / Webuzo provides PORT automatically
const PORT = process.env.PORT || 3000;

/**
 * MIDDLEWARES
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Allow ALL origins (for development / public API)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

/**
 * ROUTES
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", (req, res) => {
  res.json({
    success: true,
    message: "Login endpoint working",
  });
});

/**
 * 404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * START SERVER
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on port ${PORT}`);
});
