const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y'],
    required: true
  },
  value: {
    type: Number,
    required: function() {
      return ['percentage', 'fixed_amount'].includes(this.type);
    },
    min: 0
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  buyXGetY: {
    buyQuantity: {
      type: Number,
      required: function() {
        return this.type === 'buy_x_get_y';
      }
    },
    getQuantity: {
      type: Number,
      required: function() {
        return this.type === 'buy_x_get_y';
      }
    },
    getDiscountPercentage: {
      type: Number,
      required: function() {
        return this.type === 'buy_x_get_y';
      },
      min: 0,
      max: 100
    }
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableToAllProducts: {
    type: Boolean,
    default: false
  },
  maxUsage: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  maxUsagePerUser: {
    type: Number,
    default: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;
