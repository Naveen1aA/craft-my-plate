const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register a user
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, phone });
  
  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json(user);
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, phone, addresses } = req.body;
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, { name, phone, addresses }, { new: true });
  res.json(updatedUser);
});

module.exports = router;
