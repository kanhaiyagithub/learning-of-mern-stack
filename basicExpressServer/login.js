require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// ---------------- DB SETUP ----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// User model
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  name: String
}));

// ---------------- UTILS ----------------
function generateTokens(user) {
  const accessToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

// Middleware: auth check
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // 5 attempts per IP
  message: "Too many login attempts. Try again later."
});

// ---------------- ROUTES ----------------

// Register
app.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password, name } = req.body;

    // check if user already exists
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash: hash, name });

    res.status(201).json({ email: user.email, name: user.name });
  }
);

// Login
app.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(401);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.sendStatus(401);

    const tokens = generateTokens(user);
    res.json(tokens);
  }
);

// Refresh token
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign(
      { email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken });
  } catch {
    res.sendStatus(401);
  }
});

// Profile (protected)
app.get('/profile', auth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) return res.sendStatus(404);
  res.json({ email: user.email, name: user.name });
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
