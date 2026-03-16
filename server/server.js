const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Простейшая модель пользователя
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// Подключение к MongoDB
const PORT = process.env.PORT || 5000;
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Роут для регистрации
    app.post("/api/auth/register", async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: "User registered" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
      }
    });

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