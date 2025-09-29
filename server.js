const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const Weather = require("./models/Weather");
const User = require("./models/User");
require("dotenv").config();
const app = express();
const PORT = 5000;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware
app.use(express.json());
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/nasa-weather-app";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log(
      "Server will continue to run, but database operations will fail."
    );
    console.log(
      "Please check your MongoDB connection string or use a local MongoDB instance."
    );
  });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Authentication Routes
// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error:
          "Database connection not available. Please check your MongoDB connection.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoServerError"
    ) {
      res
        .status(503)
        .json({ error: "Database connection error. Please try again later." });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error:
          "Database connection not available. Please check your MongoDB connection.",
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoServerError"
    ) {
      res
        .status(503)
        .json({ error: "Database connection error. Please try again later." });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Get user search history
app.get("/user/history", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("searchHistory");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      searchHistory: user.searchHistory.reverse(), // Most recent first
    });
  } catch (error) {
    console.error("History retrieval error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Weather Probability Route (now requires authentication)
app.post("/weather/probability", authenticateToken, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const { month, weatherType, threshold } = req.body;

    if (!lat || !lon || !month || !weatherType || threshold === undefined) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const result = await Weather.aggregate([
      {
        $match: {
          lat: { $gte: Number(lat) - 0.5, $lte: Number(lat) + 0.5 },
          lon: { $gte: Number(lon) - 0.5, $lte: Number(lon) + 0.5 },
          $expr: { $eq: [{ $month: "$date" }, Number(month)] },
        },
      },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          extremeDays: {
            $sum: {
              $cond: [{ $gt: [`$${weatherType}`, Number(threshold)] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          probability: {
            $cond: [
              { $eq: ["$totalDays", 0] },
              0,
              { $divide: ["$extremeDays", "$totalDays"] },
            ],
          },
        },
      },
    ]);

    const probability = result[0]?.probability || 0;

    // Save search to user's history
    try {
      const user = await User.findById(req.user.userId);
      if (user) {
        await user.addSearchToHistory({
          lat: Number(lat),
          lon: Number(lon),
          month: Number(month),
          weatherType,
          threshold: Number(threshold),
          probability,
        });
      }
    } catch (historyError) {
      console.error("Error saving search history:", historyError);
      // Don't fail the request if history saving fails
    }

    res.json({ probability });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
