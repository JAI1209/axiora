const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "30d";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function signAccessToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required.",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid email format.",
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        ok: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({
        ok: false,
        message: "User already exists.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    return res.json({ ok: true, message: "Registered successfully." });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Invalid credentials.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        ok: false,
        message: "Invalid credentials.",
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await User.updateOne(
      { _id: user._id },
      { $set: { refreshTokenHash } }
    );

    return res.json({ ok: true, token: accessToken, refreshToken });
  } catch (err) {
    return next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = String(req.body.refreshToken || "");
    if (!refreshToken) {
      return res.status(401).json({ ok: false, message: "Refresh token required." });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ ok: false, message: "Invalid refresh token." });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ ok: false, message: "Invalid refresh token." });
    }

    const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!match) {
      return res.status(401).json({ ok: false, message: "Invalid refresh token." });
    }

    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    const refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    return res.json({ ok: true, token: accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return next(err);
  }
});

router.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user.userId },
      { $unset: { refreshTokenHash: "" } }
    );
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).lean();
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found." });
    }

    return res.json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
