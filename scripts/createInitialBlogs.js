
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');

const initialBlogs = [
  {
    title: "Bienvenue sur notre blog",
    content: "Nous sommes ravis de vous accueillir sur notre blog. Vous y trouverez des articles sur les dernières tendances et conseils liés à notre domaine.\n\nCet article marque le début de notre aventure ensemble. Nous publierons régulièrement du contenu pour vous tenir informé des actualités et vous proposer des astuces utiles.\n\nN'hésitez pas à nous suivre sur les réseaux sociaux et à partager nos articles avec votre entourage.",
    author: "L'équipe",
    category: "Actualités",
    tags: ["Bienvenue", "Introduction"],
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    date: new Date(),
    isPublished: true
  },
  {
    title: "Comment choisir les meilleurs produits pour votre intérieur",
    content: "Choisir les bons produits pour votre intérieur peut être un défi. Dans cet article, nous vous guidons à travers les étapes essentielles pour faire les meilleurs choix selon votre style et votre budget.\n\nTout d'abord, définissez votre style. Êtes-vous plutôt minimaliste, traditionnel, industriel ou bohème ? Une fois votre style défini, établissez un budget clair.\n\nEnsuite, recherchez des pièces de qualité qui dureront dans le temps. Privilégiez les matériaux durables et les finitions soignées.\n\nN'oubliez pas que l'éclairage joue un rôle crucial dans l'ambiance d'une pièce. Investissez dans des sources de lumière variées pour créer différentes atmosphères.\n\nEnfin, intégrez progressivement vos achats. Ne vous précipitez pas pour tout acheter d'un coup. Prenez le temps de trouver les pièces qui vous plaisent vraiment.",
    author: "Sophie Martin",
    category: "Design",
    tags: ["Décoration", "Intérieur", "Conseils"],
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
    date: new Date(Date.now() - 86400000 * 3), // 3 jours avant
    isPublished: true
  },
  {
    title: "Les tendances technologiques à surveiller cette année",
    content: "Le monde de la technologie évolue rapidement. Voici les principales tendances que nous avons identifiées pour cette année.\n\nL'intelligence artificielle continue de transformer de nombreux secteurs. Des assistants virtuels aux systèmes de recommandation, l'IA s'intègre de plus en plus dans notre quotidien.\n\nLa réalité augmentée et virtuelle gagne du terrain, notamment dans le commerce en ligne où elle permet aux clients d'essayer virtuellement des produits.\n\nLes objets connectés se multiplient, créant un écosystème toujours plus interconnecté.\n\nEnfin, la cybersécurité devient une préoccupation majeure pour les entreprises et les particuliers face à la multiplication des cyberattaques.\n\nRester informé de ces tendances vous permettra de mieux comprendre les innovations qui façonneront notre futur proche.",
    author: "Thomas Dubois",
    category: "Technologie",
    tags: ["IA", "Innovations", "Tendances"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    date: new Date(Date.now() - 86400000 * 7), // 7 jours avant
    isPublished: true
  }
];

const createInitialBlogs = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    // Importer le modèle Blog
    const Blog = require('../models/Blog');
    
    // Vérifier si des blogs existent déjà
    const existingCount = await Blog.countDocuments();
    
    if (existingCount > 0) {
      console.log(`La base de données contient déjà ${existingCount} blogs. Aucun blog initial n'a été créé.`);
    } else {
      // Créer les blogs initiaux
      const createdBlogs = await Blog.insertMany(initialBlogs);
      console.log(`${createdBlogs.length} blogs initiaux ont été créés avec succès !`);
    }
    
    // Déconnexion de MongoDB
    await mongoose.connection.close();
    console.log('Déconnecté de MongoDB');
    
  } catch (error) {
    console.error('Erreur lors de la création des blogs initiaux:', error);
  }
};

// Exécuter la fonction
createInitialBlogs();
