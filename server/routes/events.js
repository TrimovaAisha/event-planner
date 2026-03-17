const express = require("express");
const Event = require("../models/Events");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Получить события
router.get("/", auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (err) {
    console.error("GET events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Создать событие
router.post("/", auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      user: req.user.id
    });

    await event.save();
    res.json(event);
  } catch (err) {
    console.error("POST event error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Обновить событие
router.put("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!event) {
      return res.status(404).json({ message: "Not found" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json(event);
  } catch (err) {
    console.error("PUT event error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Удалить событие
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!event) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE event error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;