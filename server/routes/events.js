const express = require("express");
const Event = require("../models/Events");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const events = await Event.find({ user: req.user.id });
  res.json(events);
});

router.post("/", auth, async (req, res) => {
  const event = new Event({
    ...req.body,
    user: req.user.id
  });
  await event.save();
  res.json(event);
});

router.put("/:id", auth, async (req, res) => {
  const event = await Event.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  if (!event) return res.status(404).json({ message: "Not found" });
  Object.assign(event, req.body);
  await event.save();
  res.json(event);
});

router.delete("/:id", auth, async (req, res) => {
  await Event.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });
  res.json({ message: "Deleted" });
});
module.exports = router;