import mongoose from 'mongoose';

// Vérifier si le modèle existe déjà pour éviter les erreurs "Cannot overwrite model"
const SponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez indiquer le nom du sponsor'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  imageUrl: {
    type: String,
    required: [true, 'Veuillez fournir une URL d\'image'],
    trim: true
  },
  link: {
    type: String,
    trim: true,
    default: '#'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Sponsor || mongoose.model('Sponsor', SponsorSchema);