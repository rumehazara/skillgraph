const express = require("express");
const cors = require("cors");
const driver = require("./config/database");

const developerRoutes = require("./routes/developerRoutes");
const projectRoutes = require("./routes/projectRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "SkillGraph API is running"
  });
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await driver.verifyConnectivity();

    res.json({
      status: "healthy",
      database: "CognoDB connected"
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(503).json({
      status: "unhealthy",
      database: "CognoDB unavailable"
    });
  }
});

// Developer routes
app.use("/api/developers", developerRoutes);

// Project routes
app.use("/api/projects", projectRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SkillGraph API running on http://localhost:${PORT}`);
});