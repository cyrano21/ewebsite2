
import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminActivityLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  username: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'user', 'visitor'],
    default: 'visitor'
  },
  action: {
    type: String,
    required: true
  },
  activityType: {
    type: String,
    enum: ['auth', 'product', 'order', 'user', 'admin', 'review', 'payment', 'navigation', 'api', 'other'],
    default: 'other'
  },
  details: {
    type: Object,
    default: {}
  },
  ip: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    required: false
  },
  resourceType: {
    type: String,
    required: false
  },
  successful: {
    type: Boolean,
    default: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String,
    required: false
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    required: false
  },
  referrer: {
    type: String,
    required: false
  },
  statusCode: {
    type: Number,
    required: false
  },
  responseTime: {
    type: Number,
    required: false
  },
  queryParams: {
    type: Object,
    default: {}
  },
  bodyParams: {
    type: Object,
    default: {}
  },
  errorMessage: {
    type: String,
    required: false
  },
  entityBefore: {
    type: Object,
    required: false
  },
  entityAfter: {
    type: Object,
    required: false
  },
  changes: [{
    field: String,
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'other'],
      required: false
    },
    browser: {
      type: String,
      required: false
    },
    os: {
      type: String,
      required: false
    }
  },
  session: {
    type: String,
    required: false
  },
  processingTime: {
    type: Number,
    required: false
  },
  importanceLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  relatedActivities: [{
    type: Schema.Types.ObjectId,
    ref: 'AdminActivityLog'
  }],
  tags: [{
    type: String
  }],
  securityLevel: {
    type: String,
    enum: ['normal', 'sensitive', 'critical'],
    default: 'normal'
  },
  retentionPolicy: {
    type: String,
    enum: ['standard', 'extended', 'permanent'],
    default: 'standard'
  }
}, {
  timestamps: true
});

// Indexation pour améliorer les performances des requêtes
AdminActivityLogSchema.index({ timestamp: -1 });
AdminActivityLogSchema.index({ userId: 1, timestamp: -1 });
AdminActivityLogSchema.index({ activityType: 1, timestamp: -1 });
AdminActivityLogSchema.index({ 'details.productId': 1 }, { sparse: true });
AdminActivityLogSchema.index({ 'details.orderId': 1 }, { sparse: true });
AdminActivityLogSchema.index({ path: 1, timestamp: -1 });

// Méthode statique pour ajouter un log d'activité
AdminActivityLogSchema.statics.logActivity = async function(activityData) {
  try {
    return await this.create(activityData);
  } catch (error) {
    console.error('Erreur lors de la journalisation de l\'activité:', error);
    // Ne pas planter l'application si la journalisation échoue
    return null;
  }
};

// Méthode pour obtenir les tendances d'activité
AdminActivityLogSchema.statics.getActivityTrends = async function(startDate, endDate, groupBy = 'day') {
  const match = {};
  if (startDate || endDate) {
    match.timestamp = {};
    if (startDate) match.timestamp.$gte = new Date(startDate);
    if (endDate) match.timestamp.$lte = new Date(endDate);
  }

  let dateFormat;
  switch (groupBy) {
    case 'hour':
      dateFormat = { hour: { $hour: '$timestamp' }, day: { $dayOfMonth: '$timestamp' }, month: { $month: '$timestamp' }, year: { $year: '$timestamp' } };
      break;
    case 'day':
      dateFormat = { day: { $dayOfMonth: '$timestamp' }, month: { $month: '$timestamp' }, year: { $year: '$timestamp' } };
      break;
    case 'week':
      dateFormat = { week: { $week: '$timestamp' }, year: { $year: '$timestamp' } };
      break;
    case 'month':
      dateFormat = { month: { $month: '$timestamp' }, year: { $year: '$timestamp' } };
      break;
    default:
      dateFormat = { day: { $dayOfMonth: '$timestamp' }, month: { $month: '$timestamp' }, year: { $year: '$timestamp' } };
  }

  return this.aggregate([
    { $match: match },
    { $group: {
        _id: dateFormat,
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1, '_id.week': 1 } }
  ]);
};

const AdminActivityLog = mongoose.models.AdminActivityLog || mongoose.model('AdminActivityLog', AdminActivityLogSchema);

export default AdminActivityLog;
