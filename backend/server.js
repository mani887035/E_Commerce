require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "E-commerce Backend Running"
  });
});

// Database health check
app.get("/api/health", (req, res) => {
  res.json({
    backend: "Running",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected"
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});