const mongoose = require('mongoose');

// Schéma pour les articles de blog
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  displayDate: {
    type: String,
    // Sera utilsé pour l'affichage du format de date personnalisé
  },
  category: {
    type: String,
    trim: true,
    default: 'Non classé'
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    // URL de l'image stockée sur Cloudinary
  },
  imagePublicId: {
    type: String,
    // ID public de l'image sur Cloudinary pour la suppression
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    author: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    approved: {
      type: Boolean,
      default: false
    }
  }],
  source: {
    type: String,
    enum: ['mongodb', 'predefined'],
    default: 'mongodb'
  },
  isModifiedFromPredefined: {
    type: Boolean,
    default: false
  },
  originalId: {
    type: String,
    // Si article dérivé d'un article prédéfini, stocke l'ID original
  }
}, {
  timestamps: true, // Ajoute createdAt et updatedAt
  toJSON: {
    virtuals: true, // Inclut les champs virtuels lors de la conversion en JSON
    transform: function(doc, ret) {
      ret.id = ret._id; // Renomme _id en id pour la compatibilité avec l'existant
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Méthode pour formater la date en français
blogSchema.methods.formatDate = function() {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(this.date).toLocaleDateString('fr-FR', options);
};

// Index pour améliorer les performances de recherche
blogSchema.index({ title: 'text', content: 'text', category: 1, date: -1 });

// Middleware pre-save pour s'assurer que displayDate est toujours défini
blogSchema.pre('save', function(next) {
  if (!this.displayDate) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    this.displayDate = new Date(this.date).toLocaleDateString('fr-FR', options);
  }
  next();
});

// Création du modèle
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

module.exports = Blog;
