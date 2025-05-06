// models/Product.js
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

const ProductSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  slug:           { type: String, index: true },
  description:    { type: String, required: true },
  price:          { type: Number, required: true },
  discountPrice:  { type: Number, default: null },
  category:       { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand:          { type: String, trim: true, default: 'Générique' },
  sku:            { type: String, default: function() { return `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`; } },
  seller:         { type: String, trim: true },
  sellerId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  isDropshipping: { type: Boolean, default: false },
  supplier:       { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  supplierSku:    { type: String },
  supplierPrice:  { type: Number },
  dropshipMargin: { type: Number, default: 30 },
  images:         { type: [String], default: [] },
  imageUrl:       { type: String },
  cloudinaryId:   { type: String },
  colors: [ { name: String, hex: String, img: String } ],
  sizes:          { type: [String], default: [] },
  specifications: { type: [SpecificationSchema], default: [] },
  tags:           { type: [String], default: [] },
  rating:         { type: Number, default: 0 },
  ratingsCount:   { type: Number, default: 0 },
  reviews:        { type: [ReviewSchema], default: [] },
  stock:          { type: Number, default: 0 },
  quantity:       { type: Number, default: 0 },
  totalSold:      { type: Number, default: 0 },
  viewCount:      { type: Number, default: 0 },
  isNew:          { type: Boolean, default: false },
  isFeatured:     { type: Boolean, default: false },
  boughtTogether:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  similarProducts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  legacyId:       { type: String, index: true }
}, {
  timestamps: true
});

ProductSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
