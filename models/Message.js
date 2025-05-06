const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Créer un index pour améliorer les performances des requêtes
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ conversation: 1 });
MessageSchema.index({ read: 1 });

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

module.exports = Message;