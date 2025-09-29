const mongoose = require("mongoose");
const Weather = require("./models/Weather");

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://ahmedayyman:Ahmed1752005$@cluster0.b7jge59.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mock data
const mockData = [
  {
    lat: 30.0444,
    lon: 31.2357,
    date: new Date("2025-07-01"),
    temp: 42,
    rain: 0,
    wind: 15,
    snow: 0,
  },
  {
    lat: 30.0444,
    lon: 31.2357,
    date: new Date("2025-07-15"),
    temp: 39,
    rain: 0,
    wind: 12,
    snow: 0,
  },
  {
    lat: 30.0444,
    lon: 31.2357,
    date: new Date("2025-07-30"),
    temp: 41,
    rain: 0,
    wind: 18,
    snow: 0,
  },
  {
    lat: 30.0444,
    lon: 31.2357,
    date: new Date("2024-07-01"),
    temp: 38,
    rain: 0,
    wind: 10,
    snow: 0,
  },
  {
    lat: 30.0444,
    lon: 31.2357,
    date: new Date("2024-07-15"),
    temp: 43,
    rain: 0,
    wind: 20,
    snow: 0,
  },
  {
    lat: 30.05,
    lon: 31.24,
    date: new Date("2025-07-01"),
    temp: 41,
    rain: 0,
    wind: 14,
    snow: 0,
  },
  {
    lat: 30.05,
    lon: 31.24,
    date: new Date("2025-07-15"),
    temp: 40,
    rain: 0,
    wind: 16,
    snow: 0,
  },
  {
    lat: 30.05,
    lon: 31.24,
    date: new Date("2024-07-01"),
    temp: 37,
    rain: 0,
    wind: 11,
    snow: 0,
  },
  {
    lat: 30.05,
    lon: 31.24,
    date: new Date("2024-07-15"),
    temp: 42,
    rain: 0,
    wind: 19,
    snow: 0,
  },
  {
    lat: 30.05,
    lon: 31.24,
    date: new Date("2024-07-30"),
    temp: 39,
    rain: 0,
    wind: 13,
    snow: 0,
  },
];

// Insert mock data
async function seedDatabase() {
  try {
    // Clear existing data
    await Weather.deleteMany({});

    // Insert new data
    await Weather.insertMany(mockData);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
