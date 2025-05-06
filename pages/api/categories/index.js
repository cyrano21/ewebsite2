import connectDB from '../../../config/db';
import mongoose from 'mongoose';
import { withAdminAuth } from '../../../middleware/authMiddleware';

// Catégories par défaut à utiliser si la base de données n'est pas disponible
const DEFAULT_CATEGORIES = [
  {
    name: "Men's Sneaker",
    slug: "mens-sneaker",
    description: "Sneakers et chaussures de sport pour hommes",
    imageUrl: "/assets/images/category/01.jpg",
    isActive: true
  },
  {
    name: "Men's Pants",
    slug: "mens-pants",
    description: "Pantalons et jeans pour hommes",
    imageUrl: "/assets/images/category/02.jpg",
    isActive: true
  },
  {
    name: "Men's Boot",
    slug: "mens-boot",
    description: "Bottes et chaussures de ville pour hommes",
    imageUrl: "/assets/images/category/03.jpg",
    isActive: true
  },
  {
    name: "Bag",
    slug: "bag",
    description: "Sacs, sacoches et accessoires",
    imageUrl: "/assets/images/category/04.jpg",
    isActive: true
  },
  {
    name: "Cap",
    slug: "cap",
    description: "Casquettes et chapeaux",
    imageUrl: "/assets/images/category/05.jpg", 
    isActive: true
  },
  {
    name: "Earphones",
    slug: "earphones",
    description: "Écouteurs et accessoires audio",
    imageUrl: "/assets/images/category/01.jpg",
    isActive: true
  }
];

// Définition du schéma Category pour MongoDB
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  cloudinaryId: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function handler(req, res) {
  console.log(`🔍 [API] /api/categories - Méthode: ${req.method}, URL: ${req.url}, Query:`, req.query);
  
  // Court-circuit pour les requêtes HEAD - évite toute connexion à MongoDB
  if (req.method === 'HEAD') {
    console.log('[API] Requête HEAD détectée, réponse immédiate sans connexion DB');
    return res.status(200).end();
  }
  
  // Identifier le client pour débogage
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  console.log(`🔍 [API] Client: ${clientIP.substring(0, 15)}..., Agent: ${userAgent?.substring(0, 30)}...`);
  
  // Vérifier les en-têtes pour comprendre s'il y a des redirections
  console.log(`🔍 [API] En-têtes importants:`, {
    referer: req.headers.referer,
    host: req.headers.host,
    origin: req.headers.origin
  });
  
  try {
    // Connexion à MongoDB - Ajout de logs
    console.log('🔍 [API] Tentative de connexion à MongoDB...');
    const conn = await connectDB();
    
    // Si la connexion échoue, utiliser les catégories par défaut
    if (!conn) {
      console.log('🔍 [API] Mode hors-ligne : utilisation des catégories par défaut');
      if (req.method === 'GET') {
        console.log('🔍 [API] Réponse: 200 OK avec catégories par défaut');
        return res.status(200).json(DEFAULT_CATEGORIES);
      } else {
        console.log('🔍 [API] Réponse: 503 Service Unavailable (mode lecture seule)');
        return res.status(503).json({ 
          error: 'Base de données indisponible, mode lecture seule activé',
          offline: true 
        });
      }
    }
    
    // Connexion réussie
    console.log('🔍 [API] Connexion à MongoDB réussie');
    
    switch (req.method) {
      case 'GET':
        // Récupérer toutes les catégories ou filtrer par statut
        const { active } = req.query;
        let query = {};
        
        if (active === 'true') {
          query.isActive = true;
        } else if (active === 'false') {
          query.isActive = false;
        }
        
        console.log(`🔍 [API] Recherche de catégories avec query:`, query);
        const categories = await Category.find(query).sort({ order: 1, name: 1 });
        console.log(`🔍 [API] ${categories.length} catégories trouvées`);
        
        // Si aucune catégorie trouvée, renvoyer les catégories par défaut
        if (!categories || categories.length === 0) {
          console.log('🔍 [API] Aucune catégorie en BDD, utilisation des catégories par défaut');
          return res.status(200).json(DEFAULT_CATEGORIES);
        }
        
        console.log('🔍 [API] Réponse: 200 OK avec catégories de la BDD');
        return res.status(200).json(categories);
        
      case 'POST':
        // Vérifier si la requête vient d'un administrateur (déjà fait par withAdminAuth)
        
        // Créer une nouvelle catégorie
        const { name, slug, description, imageUrl, cloudinaryId, isActive, order } = req.body;
        
        console.log(`🔍 [API] Tentative de création de catégorie avec données:`, req.body);
        
        // Vérifier si la catégorie existe déjà
        const existingCategory = await Category.findOne({ 
          $or: [{ name }, { slug }]
        });
        
        if (existingCategory) {
          console.log('🔍 [API] Une catégorie avec ce nom ou ce slug existe déjà');
          return res.status(400).json({ error: 'Une catégorie avec ce nom ou ce slug existe déjà' });
        }
        
        const newCategory = new Category({
          name,
          slug,
          description,
          imageUrl,
          cloudinaryId,
          isActive,
          order
        });
        
        await newCategory.save();
        console.log('🔍 [API] Nouvelle catégorie créée:', newCategory);
        return res.status(201).json(newCategory);
        
      default:
        console.log(`🔍 [API] Méthode non autorisée: ${req.method}`);
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('❌ [API] Erreur dans API catégories:', error);
    
    // En cas d'erreur, renvoyer les catégories par défaut pour GET
    if (req.method === 'GET') {
      console.log('🔍 [API] Réponse d\'erreur: 200 OK avec catégories par défaut');
      return res.status(200).json(DEFAULT_CATEGORIES);
    }
    
    console.log('🔍 [API] Réponse d\'erreur: 500 Erreur serveur');
    return res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    console.log('🔍 [API] Traitement terminé pour /api/categories');
  }
}

// Appliquer le middleware d'authentification admin pour les méthodes POST
export default function(req, res) {
  console.log(`📥 [API] Requête entrante vers /api/categories - Méthode: ${req.method}`);
  
  // Pour éviter les erreurs de redirection, vérifier si la réponse a déjà été envoyée
  res.on('finish', () => {
    console.log(`📤 [API] Réponse envoyée pour /api/categories avec statut: ${res.statusCode}`);
  });
  
  if (req.method === 'POST') {
    console.log('🔑 [API] Application du middleware d\'authentification admin');
    return withAdminAuth(handler)(req, res);
  } else {
    console.log('🔓 [API] Pas de middleware d\'authentification nécessaire');
    return handler(req, res);
  }
}
