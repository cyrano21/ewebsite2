const mongoose = require('mongoose');

const FavoriteShopSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Index composé pour s'assurer qu'un utilisateur ne peut pas ajouter la même boutique deux fois
FavoriteShopSchema.index({ user: 1, shop: 1 }, { unique: true });

// Méthode pour incrémenter le compteur de favoris pour une boutique
FavoriteShopSchema.post('save', async function() {
  try {
    const Shop = mongoose.model('Shop');
    await Shop.findByIdAndUpdate(this.shop, { $inc: { favoritesCount: 1 } });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compteur de favoris:', error);
  }
});

// Méthode pour décrémenter le compteur de favoris pour une boutique
FavoriteShopSchema.post('remove', async function() {
  try {
    const Shop = mongoose.model('Shop');
    await Shop.findByIdAndUpdate(this.shop, { $inc: { favoritesCount: -1 } });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compteur de favoris:', error);
  }
});

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const FavoriteShop = mongoose.models.FavoriteShop || mongoose.model('FavoriteShop', FavoriteShopSchema);

module.exports = FavoriteShop;
