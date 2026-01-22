require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/auth");
const budgetRoutes = require("./routes/budget");
const goalRoutes = require("./routes/goal");
const ExpenseRoutes = require("./routes/expense");
const advisorRoutes = require("./routes/advisor");
const subscriptionRoutes = require("./routes/subscription");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow all origins for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health Check
app.get("/health", (req, res) => res.status(200).json({ status: "UP", timestamp: new Date() }));
app.get("/api/health", (req, res) => res.status(200).json({ status: "UP", timestamp: new Date(), source: "cron" }));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expense", ExpenseRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/advisor", advisorRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Serve static assets (ALWAYS try to if build exists, regardless of NODE_ENV)
const path = require("path");
const fs = require("fs");
// Check if build is in root (Railway) or sibling (Local)
const buildPath = path.join(__dirname, "../build");

console.log(`[DEBUG] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[DEBUG] Checking for build at: ${buildPath}`);

if (fs.existsSync(buildPath)) {
  console.log(`[DEBUG] Build folder FOUND. Serving static files.`);
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    // Exclude API routes from wildcard match to prevent HTML responses for API errors
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
} else {
  console.log(`[DEBUG] Build folder NOT FOUND at ${buildPath}`);
  // Fallback route to help debug if the frontend isn't building
  app.get("/", (req, res) => {
    res.send(`
      <h1>Backend is Online</h1>
      <p>NODE_ENV: ${process.env.NODE_ENV}</p>
      <p>Build Path Checked: ${buildPath}</p>
      <p style="color:red">Build folder not found. Did 'npm run build' fail?</p>
    `);
  });
}

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
