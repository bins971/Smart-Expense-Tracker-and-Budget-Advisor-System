const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const userRoutes = require("./routes/auth");
const budgetRoutes = require("./routes/budget");
const goalRoutes = require("./routes/goal");
const connectDB = require("./config/db");
const ExpenseRoutes = require("./routes/expense");
const advisorRoutes = require("./routes/advisor");
const subscriptionRoutes = require("./routes/subscription");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "../build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../build", "index.html"));
  });
}

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
