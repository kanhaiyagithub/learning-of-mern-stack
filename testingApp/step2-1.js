// step2-1.js
const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const users = {}; // {email: {passwordHash, name}}

app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  users[email] = { passwordHash: hash, name };
  res.status(201).json({ email, name });
});

// Export app (don't call listen here)
module.exports = app;
