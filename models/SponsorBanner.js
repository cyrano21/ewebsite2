const mongoose = require('mongoose');

const SponsorBannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.SponsorBanner || mongoose.model('SponsorBanner', SponsorBannerSchema);
