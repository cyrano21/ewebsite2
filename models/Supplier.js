
const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  website: String,
  description: String,
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  shippingMethods: [{
    name: String,
    price: Number,
    estimatedDeliveryDays: Number
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'pending'
  },
  commissionRate: {
    type: Number,
    default: 15 // pourcentage
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);

module.exports = Supplier;
