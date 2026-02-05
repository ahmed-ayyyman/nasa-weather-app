const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();
const userRoutes = require("./routes/userRoute");
const weatherRoutes = require("./routes/weatherRoute");
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
  }),
);

// Routes
app.use("/auth", userRoutes);
app.use("/weather", weatherRoutes);

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/nasa-weather-app";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log(
      "Server will continue to run, but database operations will fail.",
    );
    console.log(
      "Please check your MongoDB connection string or use a local MongoDB instance.",
    );
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
