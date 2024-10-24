const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isPasswordStrong = (password) => {
  return password.length >= 8;
};

router.post("/register", async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    profileImage,
    age,
    city,
    interests,
  } = req.body;

  try {
    let user = await User.findOne({ email });
    let userName = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    if (userName)
      return res
        .status(400)
        .json({ message: "A user with this username already exists" });

    const existingUsers = await User.find();
    const isPasswordTaken = existingUsers.some((existingUser) => {
      return bcrypt.compareSync(password, existingUser.password);
    });

    if (!isPasswordStrong(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password must be at least 8 characters long, contain at least one uppercase letter and one number.",
        });
    }

    if (isPasswordTaken) {
      return res
        .status(400)
        .json({ message: "A user with this password already exists" });
    }

    user = new User({
      name,
      username,
      email,
      password: password,
      profileImage,
      age,
      city,
      interests,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          profileImage: user.profileImage,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error server." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ message: "Incorrect username or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Incorrect username or password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error server." });
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const url = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `<p>You requested a password reset. Click <a href="${url}">here</a> to reset your password.</p>`,
    });

    res
      .status(200)
      .json({ message: "A password reset link has been sent to your email." });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!isPasswordStrong(newPassword)) {
      return res
        .status(400)
        .json({
          message:
            "Password must be at least 8 characters long, contain at least one uppercase letter and one number.",
        });
    }

    const existingUsers = await User.find();
    const isPasswordTaken = existingUsers.some((existingUser) => {
      return bcrypt.compareSync(newPassword, existingUser.password);
    });

    if (isPasswordTaken) {
        return res
          .status(400)
          .json({ message: "A user with this password already exists" });
      }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
