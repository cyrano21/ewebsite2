/**
 * Script de migration des données de Firebase vers MongoDB
 * 
 * Ce script permet de migrer toutes les données de l'application
 * depuis Firebase vers MongoDB et de transférer les images vers Cloudinary.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Connexion à MongoDB
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

// Firebase Admin
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// Cloudinary
const cloudinary = require('../src/config/cloudinary');
const { uploadImage } = cloudinary;

// Initialisation de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

// Modèles MongoDB
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Blog = require('../src/models/Blog');
const Order = require('../src/models/Order');
const Category = require('../src/models/Category');
const Review = require('../src/models/Review');

// Firebase Admin est déjà initialisé plus haut

/**
 * Fonction principale de migration
 */
async function migrateData() {
  console.log('Démarrage de la migration des données...');
  
  try {
    // Connexion à MongoDB
    const conn = await connectDB();
    if (!conn) {
      console.error('Erreur de connexion à MongoDB. Migration annulée.');
      process.exit(1);
    }
    
    console.log('Connexion à MongoDB établie.');
    
    // Migrer les utilsateurs
    await migrateUsers();
    
    // Migrer les catégories
    await migrateCategories();
    
    // Migrer les produits
    await migrateProducts();
    
    // Migrer les blogs
    await migrateBlogs();
    
    // Migrer les commandes
    await migrateOrders();
    
    // Migrer les avis
    await migrateReviews();
    
    console.log('Migration terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
}

/**
 * Migrer les utilsateurs depuis Firebase Auth vers MongoDB
 */
async function migrateUsers() {
  console.log('Migration des utilsateurs...');
  
  try {
    // Récupérer les utilsateurs depuis Firebase
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('Aucun utilsateur à migrer.');
      return;
    }
    
    let migratedCount = 0;
    
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      
      // Vérifier si l'utilsateur existe déjà dans MongoDB
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`L'utilsateur ${userData.email} existe déjà dans MongoDB.`);
        continue;
      }
      
      // Migrer l'image de profil vers Cloudinary si elle existe
      let profileImage = '';
      let cloudinaryId = '';
      
      if (userData.photoURL) {
        try {
          // Télécharger l'image depuis Firebase Storage
          const fileName = userData.photoURL.split('/').pop();
          const tempFilePath = `/tmp/${fileName}`;
          
          await bucket.file(userData.photoURL).download({ destination: tempFilePath });
          
          // Uploader l'image vers Cloudinary
          const uploadResult = await uploadImage(tempFilePath);
          profileImage = uploadResult.secure_url;
          cloudinaryId = uploadResult.public_id;
          
          // Supprimer le fichier temporaire
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.error(`Erreur lors de la migration de l'image de profil pour ${userData.email}:`, error);
        }
      }
      
      // Créer l'utilsateur dans MongoDB
      const newUser = new User({
        name: userData.displayName || 'utilsateur',
        email: userData.email,
        password: userData.passwordHash || 'migrated_password_change_required',
        role: userData.isAdmin ? 'admin' : 'user',
        profileImage,
        cloudinaryId,
        isActive: true
      });
      
      await newUser.save();
      migratedCount++;
    }
    
    console.log(`${migratedCount} utilsateurs migrés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la migration des utilsateurs:', error);
    throw error;
  }
}

/**
 * Migrer les catégories
 */
async function migrateCategories() {
  console.log('Migration des catégories...');
  
  try {
    // Récupérer les catégories depuis Firebase
    const categoriesSnapshot = await db.collection('categories').get();
    
    if (categoriesSnapshot.empty) {
      console.log('Aucune catégorie à migrer.');
      return;
    }
    
    let migratedCount = 0;
    
    for (const doc of categoriesSnapshot.docs) {
      const categoryData = doc.data();
      
      // Vérifier si la catégorie existe déjà dans MongoDB
      const existingCategory = await Category.findOne({ name: categoryData.name });
      
      if (existingCategory) {
        console.log(`La catégorie ${categoryData.name} existe déjà dans MongoDB.`);
        continue;
      }
      
      // Migrer l'image vers Cloudinary si elle existe
      let imageUrl = '';
      let cloudinaryId = '';
      
      if (categoryData.imageUrl) {
        try {
          // Télécharger l'image depuis Firebase Storage
          const fileName = categoryData.imageUrl.split('/').pop();
          const tempFilePath = `/tmp/${fileName}`;
          
          await bucket.file(categoryData.imageUrl).download({ destination: tempFilePath });
          
          // Uploader l'image vers Cloudinary
          const uploadResult = await uploadImage(tempFilePath);
          imageUrl = uploadResult.secure_url;
          cloudinaryId = uploadResult.public_id;
          
          // Supprimer le fichier temporaire
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.error(`Erreur lors de la migration de l'image pour la catégorie ${categoryData.name}:`, error);
        }
      }
      
      // Créer la catégorie dans MongoDB
      const newCategory = new Category({
        name: categoryData.name,
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryData.description || '',
        imageUrl,
        cloudinaryId,
        isActive: categoryData.isActive !== false,
        order: categoryData.order || 0
      });
      
      await newCategory.save();
      migratedCount++;
    }
    
    console.log(`${migratedCount} catégories migrées avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la migration des catégories:', error);
    throw error;
  }
}

/**
 * Migrer les produits
 */
async function migrateProducts() {
  console.log('Migration des produits...');
  
  try {
    // Récupérer les produits depuis Firebase
    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      console.log('Aucun produit à migrer.');
      return;
    }
    
    let migratedCount = 0;
    
    for (const doc of productsSnapshot.docs) {
      const productData = doc.data();
      
      // Vérifier si le produit existe déjà dans MongoDB
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (existingProduct) {
        console.log(`Le produit ${productData.name} existe déjà dans MongoDB.`);
        continue;
      }
      
      // Migrer l'image vers Cloudinary si elle existe
      let imageUrl = '';
      let cloudinaryId = '';
      
      if (productData.img) {
        try {
          // Télécharger l'image depuis Firebase Storage
          const fileName = productData.img.split('/').pop();
          const tempFilePath = `/tmp/${fileName}`;
          
          await bucket.file(productData.img).download({ destination: tempFilePath });
          
          // Uploader l'image vers Cloudinary
          const uploadResult = await uploadImage(tempFilePath);
          imageUrl = uploadResult.secure_url;
          cloudinaryId = uploadResult.public_id;
          
          // Supprimer le fichier temporaire
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.error(`Erreur lors de la migration de l'image pour le produit ${productData.name}:`, error);
        }
      }
      
      // Créer le produit dans MongoDB
      const newProduct = new Product({
        name: productData.name,
        description: productData.desc || '',
        price: productData.price || 0,
        discountPrice: productData.discountPrice || 0,
        category: productData.category || 'Non classé',
        imageUrl,
        cloudinaryId,
        rating: productData.rating || 0,
        stock: productData.quantity || 0,
        isNew: productData.isNew || false,
        isFeatured: productData.isFeatured || false,
        tags: productData.tags || []
      });
      
      await newProduct.save();
      migratedCount++;
    }
    
    console.log(`${migratedCount} produits migrés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la migration des produits:', error);
    throw error;
  }
}

/**
 * Migrer les blogs
 */
async function migrateBlogs() {
  console.log('Migration des blogs...');
  
  try {
    // Récupérer les blogs depuis Firebase
    const blogsSnapshot = await db.collection('blogs').get();
    
    if (blogsSnapshot.empty) {
      console.log('Aucun blog à migrer.');
      return;
    }
    
    let migratedCount = 0;
    
    for (const doc of blogsSnapshot.docs) {
      const blogData = doc.data();
      
      // Vérifier si le blog existe déjà dans MongoDB
      const existingBlog = await Blog.findOne({ title: blogData.title });
      
      if (existingBlog) {
        console.log(`Le blog ${blogData.title} existe déjà dans MongoDB.`);
        continue;
      }
      
      // Migrer l'image vers Cloudinary si elle existe
      let imageUrl = '';
      let cloudinaryId = '';
      
      if (blogData.imgUrl) {
        try {
          // Télécharger l'image depuis Firebase Storage
          const fileName = blogData.imgUrl.split('/').pop();
          const tempFilePath = `/tmp/${fileName}`;
          
          await bucket.file(blogData.imgUrl).download({ destination: tempFilePath });
          
          // Uploader l'image vers Cloudinary
          const uploadResult = await uploadImage(tempFilePath);
          imageUrl = uploadResult.secure_url;
          cloudinaryId = uploadResult.public_id;
          
          // Supprimer le fichier temporaire
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.error(`Erreur lors de la migration de l'image pour le blog ${blogData.title}:`, error);
        }
      }
      
      // Extraire l'auteur et la date des métadonnées
      let author = 'Auteur inconnu';
      let date = new Date();
      
      if (blogData.metaList) {
        const authorMeta = blogData.metaList.find(meta => meta.iconName === 'icofont-ui-user');
        if (authorMeta) {
          author = authorMeta.text;
        }
        
        const dateMeta = blogData.metaList.find(meta => meta.iconName === 'icofont-calendar');
        if (dateMeta) {
          try {
            // Convertir la date française en format ISO
            const frMonths = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                             'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            
            const parts = dateMeta.text.split(' ');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const monthIndex = frMonths.findIndex(m => m === parts[1].toLowerCase());
              const year = parseInt(parts[2], 10);
              
              if (monthIndex !== -1) {
                date = new Date(year, monthIndex, day);
              }
            }
          } catch (error) {
            console.error(`Erreur lors de la conversion de la date pour le blog ${blogData.title}:`, error);
          }
        }
      }
      
      // Créer le blog dans MongoDB
      const newBlog = new Blog({
        title: blogData.title,
        content: blogData.content || blogData.desc || '',
        imageUrl,
        cloudinaryId,
        category: blogData.category || 'Non classé',
        author,
        date,
        tags: blogData.tags || [],
        isPublished: true
      });
      
      await newBlog.save();
      migratedCount++;
    }
    
    console.log(`${migratedCount} blogs migrés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la migration des blogs:', error);
    throw error;
  }
}

/**
 * Migrer les commandes
 */
async function migrateOrders() {
  console.log('Migration des commandes...');
  
  try {
    // Récupérer les commandes depuis Firebase
    const ordersSnapshot = await db.collection('orders').get();
    
    if (ordersSnapshot.empty) {
      console.log('Aucune commande à migrer.');
      return;
    }
    
    let migratedCount = 0;
    
    for (const doc of ordersSnapshot.docs) {
      const orderData = doc.data();
      
      // Récupérer l'utilsateur correspondant
      let user = null;
      if (orderData.userId) {
        user = await User.findOne({ email: orderData.userEmail });
      }
      
      if (!user) {
        console.log(`utilsateur non trouvé pour la commande ${doc.id}. Création d'un utilsateur anonyme.`);
        user = await User.findOne({ email: 'anonymous@example.com' });
        
        if (!user) {
          user = new User({
            name: 'utilsateur Anonyme',
            email: 'anonymous@example.com',
            password: 'anonymous_password',
            role: 'user',
            isActive: true
          });
          
          await user.save();
        }
      }
      
      // Préparer les éléments de commande
      const orderItems = [];
      
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          // Trouver le produit correspondant
          let product = null;
          if (item.productId) {
            product = await Product.findOne({ name: item.name });
          }
          
          orderItems.push({
            product: product ? product._id : null,
            name: item.name,
            quantity: item.quantity || 1,
            price: item.price || 0,
            imageUrl: item.imageUrl || ''
          });
        }
      }
      
      // Créer la commande dans MongoDB
      const newOrder = new Order({
        user: user._id,
        orderItems,
        shippingAddress: {
          fullName: orderData.shippingAddress?.fullName || user.name,
          address: orderData.shippingAddress?.address || '',
          city: orderData.shippingAddress?.city || '',
          postalCode: orderData.shippingAddress?.postalCode || '',
          country: orderData.shippingAddress?.country || 'France',
          phone: orderData.shippingAddress?.phone || ''
        },
        paymentMethod: orderData.paymentMethod || 'Carte de crédit',
        paymentResult: orderData.paymentResult || {},
        itemsPrice: orderData.itemsPrice || 0,
        shippingPrice: orderData.shippingPrice || 0,
        taxPrice: orderData.taxPrice || 0,
        totalPrice: orderData.totalPrice || 0,
        isPaid: orderData.isPaid || false,
        paidAt: orderData.paidAt ? new Date(orderData.paidAt) : null,
        isDelivered: orderData.isDelivered || false,
        deliveredAt: orderData.deliveredAt ? new Date(orderData.deliveredAt) : null,
        status: orderData.status || 'pending'
      });
      
      await newOrder.save();
      migratedCount++;
    }
    
    console.log(`${migratedCount} commandes migrées avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la migration des commandes:', error);
    throw error;
  }
}

/**
 * Migrer les avis
 */
async function migrateReviews() {
  console.log('Migration des avis...');
  
  try {
    // Récupérer les avis depuis Firebase
    const reviewsSnapshot = await db.collection('reviews').get();
    
    if (reviewsSnapshot.empty) {
      console.log('Aucun avis à migrer.');
      return;
    }
    
    let migratedCount = 0;
    
    for (const doc of reviewsSnapshot.docs) {
      const reviewData = doc.data();
      
      // Récupérer l'utilsateur correspondant
      let user = null;
      if (reviewData.userId) {
        user = await User.findOne({ email: reviewData.userEmail });
      }
      
      if (!user) {
        console.log(`utilsateur non trouvé pour l'avis ${doc.id}. Création d'un utilsateur anonyme.`);
        user = await User.findOne({ email: 'anonymous@example.com' });
        
        if (!user) {
          user = new User({
            name: 'utilsateur Anonyme',
            email: 'anonymous@example.com',
            password: 'anonymous_password',
            role: 'user',
            isActive: true
          });
          
          await user.save();
        }
      }
      
      // Récupérer le produit correspondant
      let product = null;
      if (reviewData.productId) {
        product = await Product.findOne({ _id: reviewData.productId });
      }
      
      if (!product && reviewData.productName) {
        product = await Product.findOne({ name: reviewData.productName });
      }
      
      if (!product) {
        console.log(`Produit non trouvé pour l'avis ${doc.id}. Cet avis sera ignoré.`);
        continue;
      }
      
      // Créer l'avis dans MongoDB
      const newReview = new Review({
        product: product._id,
        user: user._id,
        rating: reviewData.rating || 5,
        comment: reviewData.comment || '',
        isApproved: reviewData.isApproved !== false
      });
      
      await newReview.save();
      migratedCount++;
    }
    
    console.log(`${migratedCount} avis migrés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la migration des avis:', error);
    throw error;
  }
}

// Exécuter la migration
migrateData();
