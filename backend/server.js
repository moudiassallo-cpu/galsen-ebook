const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/ebooks', require('./routes/ebooks'));
app.use('/api/users',  require('./routes/users'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'GALSEN EBOOK API running' }));

// Connexion MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/galsen-ebook');
  }
};
connectDB().catch(err => console.error('MongoDB:', err.message));

// Pour lancement local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
}

// Export pour Vercel
module.exports = app;
