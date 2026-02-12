const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    if (!title) {
      return res.status(400).json({ ok: false, message: "Title is required." });
    }

    const task = await Task.create({
      userId: req.user.userId,
      title,
      completed: false,
    });

    return res.json({ ok: true, task });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ ok: true, tasks });
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: "Invalid task id." });
    }

    const updates = {};
    if (typeof req.body.title === "string") {
      const title = req.body.title.trim();
      if (!title) {
        return res.status(400).json({ ok: false, message: "Title is required." });
      }
      updates.title = title;
    }
    if (typeof req.body.completed === "boolean") {
      updates.completed = req.body.completed;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { $set: updates },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ ok: false, message: "Task not found." });
    }

    return res.json({ ok: true, task });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: "Invalid task id." });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({ ok: false, message: "Task not found." });
    }

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
