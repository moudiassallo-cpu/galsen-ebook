const router = require('express').Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/users/me
router.get('/me', protect, (req, res) => res.json(req.user));

// PUT /api/users/me
router.put('/me', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/users  (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
