const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'secret');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Utilisateur introuvable' });
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux admins' });
  next();
};

module.exports = { protect, adminOnly };
