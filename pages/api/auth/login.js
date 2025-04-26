import connectDB from '../../../config/db';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Schéma User pour MongoDB (même que dans users/index.js)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profileImage: {
    type: String,
    default: ''
  },
  cloudinaryId: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  phone: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req, res) {
  // Vérifier si la méthode est POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    
    if (!conn) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    
    const { email, password } = req.body;
    
    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    // Rechercher l'utilsateur par email
    const user = await User.findOne({ email });
    
    // Vérifier si l'utilsateur existe
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier si l'utilsateur est actif
    if (!user.isActive) {
      return res.status(401).json({ error: 'Compte désactivé. Contactez l\'administrateur.' });
    }
    
    // Vérifier le mot de passe
    console.log('Début de la vérification du mot de passe pour l\'utilsateur:', user.email);
    const isMatch = await user.comparePassword(password);
    console.log('Résultat de la vérification du mot de passe (isMatch):', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Créer un token JWT
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Renvoyer le token et les informations de l'utilsateur (sans le mot de passe)
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.status(200).json({
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Erreur API login:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
