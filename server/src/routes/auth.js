const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || name.trim().length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters.' });
  if (!emailOk(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (!password || password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

  const hash = await bcrypt.hash(password, 12); // salted + hashed, never stored in plain text
  const user = await User.create({ name, email, password: hash });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
  const ok = user && (await bcrypt.compare(String(password || ''), user.password));
  if (!ok) return res.status(401).json({ message: 'Incorrect email or password.' });
  res.json({ token: sign(user), user: publicUser(user) });
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
