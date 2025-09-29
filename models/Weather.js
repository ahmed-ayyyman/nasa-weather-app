const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
  rain: {
    type: Number,
    required: true,
  },
  wind: {
    type: Number,
    required: true,
  },
  snow: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Weather", weatherSchema);
