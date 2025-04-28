const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  site: {
    siteName: { type: String, default: '' },
    siteDescription: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' }
    }
  },
  payment: {
    stripeEnabled: { type: Boolean, default: false },
    paypalEnabled: { type: Boolean, default: false },
    stripePK: { type: String, default: '' },
    stripeSK: { type: String, default: '' }
  },
  security: {
    twoFactorAuth: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 5 }
  }
}, { timestamps: true });

module.exports = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
