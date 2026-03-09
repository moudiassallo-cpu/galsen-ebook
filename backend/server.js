const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth',   require('./routes/auth'));
app.use('/api/ebooks', require('./routes/ebooks'));
app.use('/api/users',  require('./routes/users'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/galsen-ebook')
  .then(() => {
    console.log('✅ MongoDB connecté');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB:', err.message); process.exit(1); });
