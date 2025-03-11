// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
  // try {
  //   const { name, email, password } = req.body;
  //   let user = await User.findOne({ email });
  //       if (user) {
  //           return res.status(400).json({ error: "User already exists" });
  //       }
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   user = await User.create({ name, email, password: hashedPassword });
  //   res.status(201).json(user);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
  }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "User registered successfully", token, user });
} catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
}

};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
      res.clearCookie("token"); // Clear JWT Token (if using cookies)
      return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
      return res.status(500).json({ error: "Logout failed" });
  }
};