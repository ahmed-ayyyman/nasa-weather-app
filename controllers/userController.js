const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Register user
const registerUser = async (req, res) => {
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
      { expiresIn: "24h" },
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
};

// Login user
const loginUser = async (req, res) => {
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
      { expiresIn: "24h" },
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
};

// Get user search history
const getUserHistory = async (req, res) => {
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
};

module.exports = {
  registerUser,
  loginUser,
  getUserHistory,
};
