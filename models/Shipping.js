const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  isDropshipping: {
    type: Boolean,
    default: false
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  carrier: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    default: 'pending'
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  trackingHistory: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Méthode pour ajouter un événement de tracking
ShippingSchema.methods.addTrackingEvent = function(status, location, description) {
  this.trackingHistory.push({
    status,
    location,
    description,
    timestamp: new Date()
  });
  this.status = status;
  
  if (status === 'delivered') {
    this.actualDelivery = new Date();
  }
  
  return this.save();
};

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Shipping = mongoose.models.Shipping || mongoose.model('Shipping', ShippingSchema);

module.exports = Shipping;
