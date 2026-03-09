const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Champs requis manquants' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email déjà utilisé' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    res.json({ token: signToken(user._id), user: { ...user.toJSON() } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
