const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserHistory,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/validateTokenHandler");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get user history (protected route)
router.get("/history", authenticateToken, getUserHistory);

module.exports = router;
