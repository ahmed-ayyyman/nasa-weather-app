const Weather = require("../models/Weather");
const User = require("../models/User");

// Get weather probability
const getWeatherProbability = async (req, res) => {
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
};

module.exports = {
  getWeatherProbability,
};
