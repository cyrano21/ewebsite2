import connectDB from '../../../config/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';

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
    const isMatch = await bcrypt.compare(password, user.password);
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
