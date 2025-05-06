import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    // Nouveau champs: points forts, points faibles et cas d'utilisation
    pros: {
      type: String,
      trim: true
    },
    cons: {
      type: String,
      trim: true
    },
    useCase: {
      type: String,
      trim: true
    },
    // Images associées à l'avis
    images: [String],
    // Indique si l'avis provient d'un achat vérifié
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    // Utilisateurs qui ont trouvé cet avis utile
    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    // Utilisateurs qui n'ont pas trouvé cet avis utile
    unhelpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    // Compteur d'utilité pour faciliter le tri
    helpfulCount: {
      type: Number,
      default: 0
    },
    // Si l'avis a été édité
    isEdited: {
      type: Boolean,
      default: false
    },
    // Date de la dernière modification
    lastEditDate: {
      type: Date
    },
    // Si l'avis a été signalé
    isReported: {
      type: Boolean,
      default: false
    },
    // Raisons de signalement
    reportReasons: [String],
    // Si l'administrateur a approuvé cet avis
    isApproved: {
      type: Boolean,
      default: true // Par défaut, l'avis est approuvé automatiquement
    },
    // Réponse du vendeur
    sellerResponse: {
      content: String,
      date: Date,
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  {
    timestamps: true
  }
);

// Empêcher un utilisateur de soumettre plusieurs avis pour un même produit
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
