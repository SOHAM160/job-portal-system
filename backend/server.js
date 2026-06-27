const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const jobRoutes = require("./routes/job.routes");
const companyRoutes = require("./routes/company.routes");
const applicationRoutes = require("./routes/application.routes");
const chatRoutes = require("./routes/chat.routes");
const statsRoutes = require("./routes/stats.routes");
const assistantRoutes = require("./routes/assistant.routes");

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/assistant", assistantRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "HireHub API is running 🚀" });
});

// ── Global error handler ───────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── Database & Server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;
const http = require("http");
const { initSocket } = require("./socket");
const { execSync } = require("child_process");

const server = http.createServer(app);

initSocket(server);

// Graceful EADDRINUSE handler: auto-kill stale process & retry
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠️  Port ${PORT} is busy. Killing stale process and retrying...`);
    try {
      // Find and kill whatever is holding the port
      const result = execSync(
        `netstat -ano | findstr :${PORT}`,
        { encoding: "utf-8" }
      );
      const lines = result.trim().split("\n");
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== "0" && pid !== String(process.pid)) {
          pids.add(pid);
        }
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { encoding: "utf-8" });
          console.log(`   Killed PID ${pid}`);
        } catch (_) { /* already dead */ }
      }
    } catch (_) {
      /* netstat found nothing, port should be free now */
    }
    // Retry after a short delay
    setTimeout(() => {
      server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (recovered)`);
      });
    }, 1000);
  } else {
    console.error("❌ Server error:", err);
    process.exit(1);
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
