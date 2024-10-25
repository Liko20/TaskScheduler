const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body)
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ username, email, password });
  await user.save();
  res.status(201).json({ id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({ id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

module.exports = router;
