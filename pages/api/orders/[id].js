import connectDB from '../../../src/config/db';
import mongoose from 'mongoose';

// Définition du schéma OrderItem pour les éléments de commande
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

// Définition du schéma Order pour MongoDB
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [OrderItemSchema],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: true
  },
  shippingPrice: {
    type: Number,
    required: true
  },
  taxPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID commande manquant' });
  }
  
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    
    if (!conn) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    
    switch (req.method) {
      case 'GET':
        // Récupérer une commande spécifique
        const order = await Order.findById(id)
          .populate('user', 'name email');
          
        if (!order) {
          return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        return res.status(200).json(order);
        
      case 'PUT':
        // Mettre à jour une commande
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { 
          new: true,
          runValidators: true
        });
        
        if (!updatedOrder) {
          return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        return res.status(200).json(updatedOrder);
        
      case 'DELETE':
        // Supprimer une commande
        const orderToDelete = await Order.findById(id);
        if (!orderToDelete) {
          return res.status(404).json({ error: 'Commande non trouvée' });
        }
        
        await Order.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Commande supprimée avec succès' });
        
      default:
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur API commande:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
