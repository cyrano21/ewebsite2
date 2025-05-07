
import { getSession } from 'next-auth/react';
import AdminActivityLog from '../models/AdminActivityLog';
import connectDB from '../config/db';

// Middleware pour enregistrer les activités des utilisateurs
export async function logActivity(req, res, next) {
  try {
    // Connexion à la base de données
    await connectDB();
    
    // Récupérer la session utilisateur si disponible
    const session = await getSession({ req });
    
    // Extraire les informations de base sur la requête
    const { method, url, headers, body } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const ipAddress = headers['x-forwarded-for'] || 
                       headers['x-real-ip'] || 
                       req.connection.remoteAddress;
    const referrer = headers['referer'] || '';
    
    // Déterminer le type d'utilisateur
    let userType = 'visitor';
    let userId = null;
    let userName = 'Anonymous';
    
    if (session && session.user) {
      userType = session.user.role || 'customer';
      userId = session.user.id;
      userName = session.user.name || session.user.email;
    }
    
    // Déterminer le type d'activité en fonction de l'URL et de la méthode
    let activityType = 'view';
    let objectType = null;
    let objectId = null;
    let description = `Accès à ${url}`;
    
    // Analyser l'URL pour déterminer le type d'activité
    if (url.includes('/api/')) {
      // Requêtes API
      if (url.includes('/api/products')) {
        objectType = 'product';
        
        if (method === 'GET') {
          activityType = 'view';
          description = 'Consultation de produit(s)';
        } else if (method === 'POST') {
          activityType = 'product_create';
          description = 'Création de produit';
        } else if (method === 'PUT' || method === 'PATCH') {
          activityType = 'product_update';
          description = 'Mise à jour de produit';
        } else if (method === 'DELETE') {
          activityType = 'product_delete';
          description = 'Suppression de produit';
        }
        
        // Extraire l'ID du produit si présent dans l'URL
        const productIdMatch = url.match(/\/products\/([^\/\?]+)/);
        if (productIdMatch && productIdMatch[1]) {
          objectId = productIdMatch[1];
        }
      } else if (url.includes('/api/cart')) {
        objectType = 'cart';
        
        if (method === 'POST') {
          activityType = 'cart_add';
          description = 'Ajout au panier';
        } else if (method === 'DELETE') {
          activityType = 'cart_remove';
          description = 'Retrait du panier';
        } else {
          activityType = 'view';
          description = 'Consultation du panier';
        }
      } else if (url.includes('/api/orders')) {
        objectType = 'order';
        
        if (method === 'POST') {
          activityType = 'purchase';
          description = 'Création de commande';
        } else if (method === 'PUT' || method === 'PATCH') {
          activityType = 'order_status_change';
          description = 'Modification de statut de commande';
        } else {
          activityType = 'view';
          description = 'Consultation de commande(s)';
        }
        
        // Extraire l'ID de la commande si présent dans l'URL
        const orderIdMatch = url.match(/\/orders\/([^\/\?]+)/);
        if (orderIdMatch && orderIdMatch[1]) {
          objectId = orderIdMatch[1];
        }
      } else if (url.includes('/api/auth/signin') || url.includes('/api/auth/login')) {
        activityType = 'login';
        objectType = 'user';
        description = 'Tentative de connexion';
      } else if (url.includes('/api/auth/signout') || url.includes('/api/auth/logout')) {
        activityType = 'logout';
        objectType = 'user';
        description = 'Déconnexion';
      } else if (url.includes('/api/auth/register')) {
        activityType = 'registration';
        objectType = 'user';
        description = 'Création de compte';
      } else if (url.includes('/api/reviews')) {
        activityType = 'review';
        objectType = 'review';
        description = 'Action sur avis';
      } else if (url.includes('/api/seller/register')) {
        activityType = 'seller_application';
        objectType = 'seller';
        description = 'Demande de statut vendeur';
      } else if (url.includes('/api/search') || url.includes('/api/products/search')) {
        activityType = 'search';
        description = 'Recherche de produits';
      }
    } else {
      // Pages normales (non-API)
      if (url.includes('/shop/product/')) {
        activityType = 'view';
        objectType = 'product';
        description = 'Consultation de page produit';
        
        // Extraire l'ID du produit de l'URL
        const productIdMatch = url.match(/\/product\/([^\/\?]+)/);
        if (productIdMatch && productIdMatch[1]) {
          objectId = productIdMatch[1];
        }
      } else if (url.includes('/checkout')) {
        activityType = 'purchase';
        description = 'Processus de paiement';
      } else if (url.includes('/admin/')) {
        activityType = 'admin_action';
        description = 'Action admin';
      } else if (url.includes('/seller/')) {
        activityType = 'seller_action';
        description = 'Action vendeur';
      }
    }
    
    // Créer l'entrée de log
    const logEntry = new AdminActivityLog({
      userId,
      userType,
      userName,
      activityType,
      description,
      objectType,
      objectId,
      ipAddress,
      userAgent,
      referrer,
      url,
      method,
    });
    
    // Enregistrer le log de manière asynchrone (ne pas attendre la fin pour continuer)
    logEntry.save().catch(err => console.error('Erreur lors de l\'enregistrement du log d\'activité:', err));
    
    // Continuer l'exécution sans attendre l'enregistrement du log
    if (typeof next === 'function') {
      next();
    }
  } catch (error) {
    console.error('Erreur dans le middleware de logging:', error);
    // Continuer même en cas d'erreur de logging
    if (typeof next === 'function') {
      next();
    }
  }
}

export default logActivity;
