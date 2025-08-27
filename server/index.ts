import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3pkg from "sqlite3";
import cardRouter from "./routes/cardRouter.ts";

dotenv.config();

const app = express();
const sqlite3 = sqlite3pkg.verbose();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(`./${process.env.DB_NAME}.sqlite`, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Attach db to app.locals so routers can access it
app.locals.db = db;

// Routes
app.use("/api/cards", cardRouter);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
