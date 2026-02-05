const express = require("express");
const router = express.Router();
const { getWeatherProbability } = require("../controllers/weatherController");
const { authenticateToken } = require("../middleware/validateTokenHandler");

// Weather probability route (protected)
router.post("/probability", authenticateToken, getWeatherProbability);

module.exports = router;
