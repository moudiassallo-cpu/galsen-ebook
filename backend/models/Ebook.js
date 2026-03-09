const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
  titre:           { type: String, required: true, trim: true },
  auteur:          { type: String, required: true, trim: true },
  description:     { type: String, default: '' },
  prix:            { type: Number, required: true, min: 0 },
  categorie:       { type: String, default: 'Roman' },
  image_couverture:{ type: String, default: '' },
  fichier_pdf:     { type: String, default: '' },
  emoji:           { type: String, default: '📚' },
  note:            { type: Number, default: 4.5 },
  popular:         { type: Boolean, default: false },
  isNew:           { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Ebook', ebookSchema);
