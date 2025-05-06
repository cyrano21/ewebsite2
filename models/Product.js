const mongoose = require('mongoose');
const slugify = require('slugify');

// Sous-schémas
const SpecificationSchema = new mongoose.Schema({
  key:   { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, required: true },
  date:     { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

// Schéma principal Product
const ProductSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  slug:             { type: String, index: true },
  description:      { type: String, required: true },
  price:            { type: Number, required: true },
  discountPrice:    { type: Number, default: null },
  category:         { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand:            { type: String, trim: true },
  seller:           { type: String, trim: true },
  sellerId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },

  // Champs pour le dropshipping
  isDropshipping:   { type: Boolean, default: false },
  supplier:         { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  supplierSku:      { type: String },
  supplierPrice:    { type: Number },
  dropshipMargin:   { type: Number, default: 30 }, // Marge en pourcentage

  images:           { type: [String], default: [] },    // Galerie d’images
  imageUrl:         { type: String },                    // Image principale
  cloudinaryId:     { type: String },                    // Pour suppression

  colors: [                                               // Couleurs disponibles
    {
      name: { type: String, required: true },
      hex:  { type: String, required: true },
      img:  { type: String }
    }
  ],
  sizes:            { type: [String], default: [] },     // Tailles (S, M, L...)
  specifications:   { type: [SpecificationSchema], default: [] },

  tags:             { type: [String], default: [] },
  rating:           { type: Number, default: 0 },
  ratingsCount:     { type: Number, default: 0 },
  reviews:          { type: [ReviewSchema], default: [] },

  stock:            { type: Number, default: 0 },
  quantity:         { type: Number, default: 0 },         // Quantité à ajouter au panier
  totalSold:        { type: Number, default: 0 },         // Nombre vendu
  viewCount:        { type: Number, default: 0 },         // Nombre de vues

  isNew:            { type: Boolean, default: false },
  isFeatured:       { type: Boolean, default: false },

  boughtTogether:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  similarProducts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  legacyId:         { type: String, index: true }        // Pour import UUID
}, {
  timestamps: true
});

// Génération automatique du slug
ProductSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);