const mongoose = require('mongoose');

const SponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom pour ce sponsor'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Veuillez fournir une URL d\'image pour ce sponsor']
  },
  link: {
    type: String,
    default: '#'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Sponsor || mongoose.model('Sponsor', SponsorSchema);