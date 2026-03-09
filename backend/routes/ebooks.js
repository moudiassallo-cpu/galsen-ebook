const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Ebook = require('../models/Ebook');
const { protect, adminOnly } = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// GET /api/ebooks
router.get('/', async (req, res) => {
  try {
    const { categorie, search } = req.query;
    let query = {};
    if (categorie) query.categorie = categorie;
    if (search) query.$or = [
      { titre: { $regex: search, $options: 'i' } },
      { auteur: { $regex: search, $options: 'i' } },
    ];
    const ebooks = await Ebook.find(query).sort({ createdAt: -1 });
    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/ebooks/:id
router.get('/:id', async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) return res.status(404).json({ message: 'Ebook introuvable' });
    res.json(ebook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/ebooks  (admin)
router.post('/', protect, adminOnly, upload.fields([{ name: 'image' }, { name: 'pdf' }]), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.image) data.image_couverture = '/uploads/' + req.files.image[0].filename;
    if (req.files?.pdf) data.fichier_pdf = '/uploads/' + req.files.pdf[0].filename;
    const ebook = await Ebook.create(data);
    res.status(201).json(ebook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/ebooks/:id  (admin)
router.put('/:id', protect, adminOnly, upload.fields([{ name: 'image' }, { name: 'pdf' }]), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.image) data.image_couverture = '/uploads/' + req.files.image[0].filename;
    if (req.files?.pdf) data.fichier_pdf = '/uploads/' + req.files.pdf[0].filename;
    const ebook = await Ebook.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!ebook) return res.status(404).json({ message: 'Ebook introuvable' });
    res.json(ebook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/ebooks/:id  (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Ebook.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ebook supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
