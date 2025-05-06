import mongoose from 'mongoose';

const EmailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du modèle est requis'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Le sujet du modèle est requis'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Le contenu du modèle est requis']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

export default mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', EmailTemplateSchema);