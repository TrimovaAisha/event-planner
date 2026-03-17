const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
if (!process.env.JWT_SECRET) {
  console.log("❌ JWT_SECRET missing");
}
const authRoutes = require("./routes/Auth");
const eventRoutes = require("./routes/events");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

const User = require("./models/User");
// Подключение к MongoDB
const PORT = process.env.PORT || 5000;
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    // Роут для проверки
    app.get("/api/test", (req, res) => {
      res.json({ message: "Server works!" });
    });

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

startServer();