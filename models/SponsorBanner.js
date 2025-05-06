import mongoose from 'mongoose';

const SponsorBannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Vérifier si le modèle existe déjà pour éviter l'erreur "Cannot overwrite model once compiled"
const SponsorBanner = mongoose.models.SponsorBanner || mongoose.model('SponsorBanner', SponsorBannerSchema);

export default SponsorBanner;
