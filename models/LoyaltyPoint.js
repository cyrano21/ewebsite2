
const mongoose = require('mongoose');

const LoyaltyPointSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  points: { 
    type: Number, 
    default: 0 
  },
  history: [
    {
      amount: { type: Number, required: true },
      type: { 
        type: String, 
        enum: ['earned', 'spent', 'expired', 'bonus'], 
        required: true 
      },
      reason: { type: String, required: true },
      reference: { 
        type: String, 
        required: false 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
  totalEarned: { 
    type: Number, 
    default: 0 
  },
  totalSpent: { 
    type: Number, 
    default: 0 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.LoyaltyPoint || mongoose.model('LoyaltyPoint', LoyaltyPointSchema);
