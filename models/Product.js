// models/Product.js
const mongoose = require('mongoose');
const slugify = require('slugify');

// Sous-schémas
const SpecificationSchema = new mongoose.Schema({
  key:   { type: String, required: [true, 'La clé de spécification est requise'] },
  value: { type: String, required: [true, 'La valeur de spécification est requise'] }
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, required: true, trim: true },
  date:     { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name:           { type: String, required: [true, 'Le nom du produit est requis'], trim: true, index: true },
  slug:           { type: String, index: true, unique: true }, // Slug doit être unique
  description:    { type: String, required: [true, 'La description est requise'] },
  shortDescription: { type: String, trim: true }, // Ajout d'une description courte
  price:          { type: Number, required: [true, 'Le prix est requis'], min: [0, 'Le prix ne peut pas être négatif'] },
  discountPrice:  { type: Number, default: null, min: [0, 'Le prix réduit ne peut pas être négatif'] },
  category:       { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'La catégorie est requise'], index: true },
  brand:          { type: String, trim: true, default: 'Générique' },
  sku:            { type: String, unique: true, sparse: true }, // SKU devrait être unique s'il est utilisé
  seller:         { type: String, trim: true },
  sellerId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }, // Si vous avez un modèle Seller
  isDropshipping: { type: Boolean, default: false },
  supplier:       { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, // Si vous avez un modèle Supplier
  supplierSku:    { type: String },
  supplierPrice:  { type: Number },
  dropshipMargin: { type: Number, default: 30 },
  images:         { type: [String], default: [], validate: [val => val.length <= 10, 'Maximum 10 images autorisées'] }, // Limiter le nombre d'images
  // imageUrl:       { type: String }, // Redondant si 'images' est utilisé ?
  // cloudinaryId:   { type: String }, // Si vous stockez l'ID Cloudinary
  colors: [ { name: String, hex: String, img: String } ],
  sizes:          { type: [String], default: [] },
  specifications: { type: [SpecificationSchema], default: [] },
  tags:           { type: [String], default: [], index: true },
  rating:         { type: Number, default: 0, min: 0, max: 5 },
  ratingsCount:   { type: Number, default: 0, min: 0 },
  reviews:        { type: [ReviewSchema], default: [] },
  stock:          { type: Number, default: 0, min: 0, required: [true, 'Le stock est requis'] },
  // quantity:       { type: Number, default: 0 }, // Souvent géré côté client/panier, redondant ici ?
  totalSold:      { type: Number, default: 0, min: 0 },
  viewCount:      { type: Number, default: 0, min: 0 },
  isNewlyAdded:   { type: Boolean, default: false, index: true }, // Champ renommé
  isFeatured:     { type: Boolean, default: false, index: true },
  isActive:       { type: Boolean, default: true, index: true }, // Ajout pour activer/désactiver facilement
  boughtTogether:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  similarProducts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  legacyId:       { type: String, index: true } // Si vous migrez d'un ancien système
}, {
  timestamps: true,
  // suppressReservedKeysWarning: true, // Optionnel: supprime l'avertissement si besoin absolu
  toJSON: { virtuals: true }, // Inclure les virtuels lors de la conversion en JSON
  toObject: { virtuals: true }
});

// Middleware pour générer le slug avant la sauvegarde si pas déjà défini ou si le nom change
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  }
  // Générer SKU si vide
  if (!this.sku) {
     this.sku = `SKU-${this.name.substring(0, 5).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  }
  next();
});

// Calculer la note moyenne (exemple de virtual ou hook)
ProductSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    if (this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.rating = sum / this.reviews.length;
      this.ratingsCount = this.reviews.length;
    } else {
      this.rating = 0;
      this.ratingsCount = 0;
    }
  }
  next();
});

// Ajouter un index text pour la recherche si nécessaire
// ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Assurer l'exportation correcte pour éviter les recompilations de modèle Mongoose en dev
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);