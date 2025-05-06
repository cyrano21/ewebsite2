const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['banner', 'popup', 'sidebar', 'featured', 'video', 'carousel'],
    required: true
  },
  position: {
    type: String,
    enum: ['home', 'shop', 'shop_sidebar', 'product', 'checkout', 'category', 'blog', 'shipping_info', 'product_detail', 'global'],
    required: true
  },
  priority: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true,
    description: 'Active/désactive l\'affichage de la publicité sur le site'
  },
  imageUrl: {
    type: String,
    required: function() {
      return ['banner', 'popup', 'sidebar', 'featured', 'carousel'].includes(this.type);
    }
  },
  videoUrl: {
    type: String,
    required: function() {
      return this.type === 'video';
    }
  },
  targetUrl: {
    type: String,
    required: true
  },
  targetDevice: {
    type: [String],
    enum: ['desktop', 'tablet', 'mobile', 'all'],
    default: ['all']
  },
  targetContext: {
    type: [String],
    enum: ['home', 'shop', 'product', 'category', 'blog', 'blog_post', 'cart', 'checkout', 'account', 'shipping', 'other'],
    default: ['all']
  },
  rotationSettings: {
    frequency: {
      type: Number,
      default: 15, // Temps en secondes entre deux rotations
      min: 5,
      max: 60
    },
    rotationGroup: {
      type: String,
      default: 'default' // Permet de grouper les publicités qui tournent ensemble
    },
    rotationPriority: {
      type: Number,
      default: 1, // Plus la valeur est élevée, plus la publicité apparaît fréquemment
      min: 0,
      max: 10
    }
  },
  targetAudience: {
    ageRange: {
      min: Number,
      max: Number
    },
    gender: [String],
    interests: [String],
    location: [String]
  },
  keywords: {
    type: [String],
    default: []
  },
  content: {
    title: String,
    subtitle: String,
    description: String,
    callToAction: String,
    buttonText: String
  },
  dimensions: {
    width: Number,
    height: Number
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Peut être un vendeur ou un client externe
  },
  budget: {
    total: Number,
    spent: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  analytics: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    ctr: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    dailyStats: [{
      date: Date,
      impressions: Number,
      clicks: Number,
      conversions: Number
    }],
    devices: {
      type: Object,
      default: () => ({})
    },
    positions: {
      type: Object,
      default: () => ({})
    },
    pages: {
      type: Object,
      default: () => ({})
    },
    viewDurations: [{
      duration: Number,
      timestamp: Date,
      deviceType: String,
      position: String,
      page: String,
      viewportSize: {
        width: Number,
        height: Number
      }
    }],
    relevanceScore: {
      type: Number,
      default: 50 // Score de pertinence entre 0 et 100
    }
  },
  tags: [String],
  // Le champ isActive existe déjà plus haut dans le schéma
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

// Prétraitement avant sauvegarde
AdvertisementSchema.pre('save', function(next) {
  // Calcul automatique du CTR (Click-Through Rate)
  if (this.analytics.impressions > 0) {
    this.analytics.ctr = (this.analytics.clicks / this.analytics.impressions) * 100;
  }
  
  // Mise à jour automatique du statut en fonction des dates
  const now = new Date();
  if (this.isActive) {
    if (now < new Date(this.startDate)) {
      this.status = 'scheduled';
    } else if (now > new Date(this.endDate)) {
      this.status = 'completed';
    } else {
      this.status = 'active';
    }
  }
  
  next();
});

// Méthode pour incrémenter les impressions avec analytics avancés
AdvertisementSchema.methods.incrementImpressions = async function(deviceType, position, page) {
  this.analytics.impressions += 1;
  
  // Ajouter aux statistiques quotidiennes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let dailyStat = this.analytics.dailyStats.find(stat => 
    new Date(stat.date).setHours(0, 0, 0, 0) === today.getTime()
  );
  
  if (dailyStat) {
    dailyStat.impressions += 1;
  } else {
    this.analytics.dailyStats.push({
      date: today,
      impressions: 1,
      clicks: 0,
      conversions: 0
    });
  }
  
  // Tracking par appareil
  if (deviceType) {
    if (!this.analytics.devices[deviceType]) {
      this.analytics.devices[deviceType] = { impressions: 0, clicks: 0 };
    }
    this.analytics.devices[deviceType].impressions += 1;
  }
  
  // Tracking par position
  if (position) {
    if (!this.analytics.positions[position]) {
      this.analytics.positions[position] = { impressions: 0, clicks: 0 };
    }
    this.analytics.positions[position].impressions += 1;
  }
  
  // Tracking par page
  if (page) {
    if (!this.analytics.pages[page]) {
      this.analytics.pages[page] = { impressions: 0, clicks: 0 };
    }
    this.analytics.pages[page].impressions += 1;
  }
  
  // Recalculer le CTR
  if (this.analytics.impressions > 0) {
    this.analytics.ctr = (this.analytics.clicks / this.analytics.impressions) * 100;
  }
  
  return this.save();
};

// Méthode pour incrémenter les clics avec analytics avancés
AdvertisementSchema.methods.incrementClicks = async function(deviceType, position, page) {
  this.analytics.clicks += 1;
  
  // Ajouter aux statistiques quotidiennes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let dailyStat = this.analytics.dailyStats.find(stat => 
    new Date(stat.date).setHours(0, 0, 0, 0) === today.getTime()
  );
  
  if (dailyStat) {
    dailyStat.clicks += 1;
  } else {
    this.analytics.dailyStats.push({
      date: today,
      impressions: 0,
      clicks: 1,
      conversions: 0
    });
  }
  
  // Tracking par appareil
  if (deviceType) {
    if (!this.analytics.devices[deviceType]) {
      this.analytics.devices[deviceType] = { impressions: 0, clicks: 0 };
    }
    this.analytics.devices[deviceType].clicks += 1;
  }
  
  // Tracking par position
  if (position) {
    if (!this.analytics.positions[position]) {
      this.analytics.positions[position] = { impressions: 0, clicks: 0 };
    }
    this.analytics.positions[position].clicks += 1;
  }
  
  // Tracking par page
  if (page) {
    if (!this.analytics.pages[page]) {
      this.analytics.pages[page] = { impressions: 0, clicks: 0 };
    }
    this.analytics.pages[page].clicks += 1;
  }
  
  // Recalculer le CTR
  if (this.analytics.impressions > 0) {
    this.analytics.ctr = (this.analytics.clicks / this.analytics.impressions) * 100;
  }
  
  return this.save();
};

// Méthode pour incrémenter les conversions avec analytics avancés
AdvertisementSchema.methods.incrementConversions = async function(deviceType, position, page) {
  this.analytics.conversions += 1;
  
  // Ajouter aux statistiques quotidiennes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let dailyStat = this.analytics.dailyStats.find(stat => 
    new Date(stat.date).setHours(0, 0, 0, 0) === today.getTime()
  );
  
  if (dailyStat) {
    dailyStat.conversions += 1;
  } else {
    this.analytics.dailyStats.push({
      date: today,
      impressions: 0,
      clicks: 0,
      conversions: 1
    });
  }
  
  // Tracking par appareil
  if (deviceType) {
    if (!this.analytics.devices[deviceType]) {
      this.analytics.devices[deviceType] = { impressions: 0, clicks: 0, conversions: 0 };
    }
    if (!this.analytics.devices[deviceType].conversions) {
      this.analytics.devices[deviceType].conversions = 0;
    }
    this.analytics.devices[deviceType].conversions += 1;
  }
  
  // Tracking par position
  if (position) {
    if (!this.analytics.positions[position]) {
      this.analytics.positions[position] = { impressions: 0, clicks: 0, conversions: 0 };
    }
    if (!this.analytics.positions[position].conversions) {
      this.analytics.positions[position].conversions = 0;
    }
    this.analytics.positions[position].conversions += 1;
  }
  
  // Tracking par page
  if (page) {
    if (!this.analytics.pages[page]) {
      this.analytics.pages[page] = { impressions: 0, clicks: 0, conversions: 0 };
    }
    if (!this.analytics.pages[page].conversions) {
      this.analytics.pages[page].conversions = 0;
    }
    this.analytics.pages[page].conversions += 1;
  }
  
  return this.save();
};

// Méthode pour ajouter une durée de visionnage
AdvertisementSchema.methods.addViewDuration = async function(duration, deviceType, position, page, viewportSize) {
  if (!this.analytics.viewDurations) {
    this.analytics.viewDurations = [];
  }
  
  this.analytics.viewDurations.push({
    duration,
    timestamp: new Date(),
    deviceType,
    position,
    page,
    viewportSize
  });
  
  // Limiter le tableau à 1000 entrées pour éviter une croissance excessive
  if (this.analytics.viewDurations.length > 1000) {
    this.analytics.viewDurations = this.analytics.viewDurations.slice(-1000);
  }
  
  return this.save();
};

// Calculer le score de pertinence pour un contexte spécifique
AdvertisementSchema.methods.calculateRelevanceScore = function(pageContext, userInterests = []) {
  let score = 50; // Score de base
  
  // 1. Vérifier la correspondance de contexte de page
  if (this.targetContext && this.targetContext.includes(pageContext)) {
    score += 20;
  }
  
  // 2. Vérifier les mots-clés correspondant aux intérêts de l'utilisateur
  if (this.keywords && this.keywords.length > 0 && userInterests.length > 0) {
    const matchingInterests = this.keywords.filter(keyword => 
      userInterests.some(interest => 
        interest.toLowerCase().includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    if (matchingInterests.length > 0) {
      score += Math.min(25, matchingInterests.length * 5);
    }
  }
  
  // 3. Tenir compte de la priorité définie de la publicité
  if (this.priority) {
    score += this.priority * 5; // Maximum +25 pour priorité 5
  }
  
  // Plafonner le score à 100
  this.analytics.relevanceScore = Math.min(100, score);
  
  return this.analytics.relevanceScore;
};

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);

module.exports = Advertisement;
