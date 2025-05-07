import mongoose from 'mongoose';

const adminActivityLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  target: String,
  meta: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AdminActivityLog || mongoose.model('AdminActivityLog', adminActivityLogSchema);
const mongoose = require('mongoose');

// Schéma pour les logs d'activité administrative
const AdminActivityLogSchema = new mongoose.Schema({
  // Utilisateur concerné par l'activité
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Peut être null pour les visiteurs anonymes
  },
  
  // Type d'utilisateur
  userType: {
    type: String,
    enum: ['admin', 'seller', 'customer', 'visitor'],
    required: true
  },
  
  // Nom d'utilisateur ou identifiant
  userName: {
    type: String,
    required: false
  },
  
  // Type d'activité
  activityType: {
    type: String,
    enum: ['login', 'logout', 'view', 'search', 'purchase', 'cart_add', 'cart_remove', 
           'registration', 'product_create', 'product_update', 'product_delete',
           'review', 'order_status_change', 'payment', 'refund', 'wishlist',
           'seller_application', 'admin_action'],
    required: true
  },
  
  // Description de l'activité
  description: {
    type: String,
    required: true
  },
  
  // Identifiant de l'objet concerné (produit, commande, etc.)
  objectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  
  // Type d'objet concerné
  objectType: {
    type: String,
    enum: ['product', 'category', 'order', 'user', 'seller', 'review', 'cart', 'payment'],
    required: false
  },
  
  // Valeur avant modification (pour les mises à jour)
  previousValue: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  
  // Valeur après modification (pour les mises à jour)
  newValue: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  
  // Adresse IP
  ipAddress: {
    type: String,
    required: false
  },
  
  // Informations sur le navigateur/appareil
  userAgent: {
    type: String,
    required: false
  },

  // Pays/région
  location: {
    type: String,
    required: false
  },
  
  // Référent (d'où vient l'utilisateur)
  referrer: {
    type: String,
    required: false
  },
  
  // URL visitée
  url: {
    type: String,
    required: false
  },
  
  // Méthode HTTP pour les requêtes API
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: false
  },
  
  // Statut HTTP pour les requêtes API
  statusCode: {
    type: Number,
    required: false
  },
  
  // Temps d'exécution (en ms)
  executionTime: {
    type: Number,
    required: false
  }
}, { 
  timestamps: true,
  // Création automatique d'index pour améliorer les requêtes
  indexes: [
    { createdAt: -1 },
    { userId: 1 },
    { userType: 1 },
    { activityType: 1 },
    { objectId: 1, objectType: 1 }
  ]
});

// Création d'index spécifiques pour des requêtes courantes
AdminActivityLogSchema.index({ createdAt: -1, activityType: 1 });
AdminActivityLogSchema.index({ createdAt: -1, userType: 1 });
AdminActivityLogSchema.index({ createdAt: -1, activityType: 1, userType: 1 });

// Méthode pour formater les logs pour l'affichage
AdminActivityLogSchema.methods.toDisplayFormat = function() {
  return {
    id: this._id,
    user: this.userName || 'Anonyme',
    userType: this.userType,
    action: this.activityType,
    details: this.description,
    date: this.createdAt,
    url: this.url
  };
};

// Création du modèle à partir du schéma
const AdminActivityLog = mongoose.models.AdminActivityLog || mongoose.model('AdminActivityLog', AdminActivityLogSchema);

module.exports = AdminActivityLog;
