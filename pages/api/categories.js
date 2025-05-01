// pages/api/categories.js
import { connectToDatabase } from '../../utils/db';

// Catégories par défaut garanties pour l'application
const DEFAULT_CATEGORIES = [
  {
    name: "Men's Sneaker",
    slug: "mens-sneaker",
    imageUrl: `/assets/images/category/01.jpg`,
    iconName: "icofont-shoe-alt",
    description: "Sneakers et chaussures de sport pour hommes",
    featured: true
  },
  {
    name: "Men's Pants",
    slug: "mens-pants",
    imageUrl: `/assets/images/category/02.jpg`,
    iconName: "icofont-shopping-cart",
    description: "Pantalons et jeans pour hommes",
    featured: true
  },
  {
    name: "Men's Boot",
    slug: "mens-boot",
    imageUrl: `/assets/images/category/03.jpg`,
    iconName: "icofont-shoe-alt",
    description: "Bottes et chaussures de ville pour hommes",
    featured: true
  },
  {
    name: "Bag",
    slug: "bag",
    imageUrl: `/assets/images/category/04.jpg`,
    iconName: "icofont-shopping-cart",
    description: "Sacs, sacoches et accessoires",
    featured: true
  },
  {
    name: "Cap",
    slug: "cap",
    imageUrl: `/assets/images/category/05.jpg`,
    iconName: "icofont-hat",
    description: "Casquettes et chapeaux",
    featured: true
  },
  {
    name: "Bottle",
    slug: "bottle",
    imageUrl: `/assets/images/category/06.jpg`,
    iconName: "icofont-jar",
    description: "Bouteilles et contenants",
    featured: true
  },
  {
    name: "Earphones",
    slug: "earphones",
    imageUrl: `/assets/images/category/01.jpg`,
    iconName: "icofont-headphone-alt",
    description: "Écouteurs et accessoires audio",
    featured: true
  },
  {
    name: "Sacs colorés",
    slug: "sacs-colores",
    imageUrl: `/assets/images/category/02.jpg`,
    iconName: "icofont-bag",
    description: "Sacs et bagages colorés",
    featured: true
  },
  {
    name: "Déco maison",
    slug: "deco-maison",
    imageUrl: `/assets/images/category/03.jpg`,
    iconName: "icofont-home",
    description: "Articles de décoration pour la maison",
    featured: true
  }
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('API /api/categories appelée');
      
      // Connexion à la base de données (à adapter selon votre configuration)
      const { db } = await connectToDatabase();
      console.log('Connexion à la base de données établie');
      
      // Récupération des catégories depuis la collection 'categories'
      let categories = [];
      
      try {
        console.log('Tentative de récupération des catégories depuis la collection "categories"');
        categories = await db.collection('categories').find({}).toArray();
        console.log(`${categories.length} catégories trouvées dans la collection`);
      } catch (error) {
        console.log('Collection des catégories non disponible, génération depuis les produits', error);
        
        try {
          // Fallback: générer les catégories depuis les produits
          console.log('Tentative de récupération des produits');
          const products = await db.collection('products').find({}).toArray();
          console.log(`${products.length} produits trouvés`);
          
          // Si aucun produit n'est trouvé, utiliser les catégories par défaut
          if (!products || products.length === 0) {
            console.log('Aucun produit trouvé, utilisation des catégories par défaut');
            categories = DEFAULT_CATEGORIES;
          } else {
            // Extraire les catégories uniques des produits
            const categoryMap = {};
            products.forEach(product => {
              if (product.category) {
                // Utilisation d'une normalisation pour éviter les doublons dus à la casse/espaces
                const normalizedName = product.category.trim();
                if (!categoryMap[normalizedName]) {
                  categoryMap[normalizedName] = {
                    count: 1, 
                    // Utiliser le premier produit de cette catégorie pour l'image (si disponible)
                    imageUrl: product.imageUrl || product.imgUrl || `/assets/images/category/default.jpg`
                  };
                } else {
                  categoryMap[normalizedName].count++;
                }
              }
            });
            
            console.log('Catégories extraites des produits:', Object.keys(categoryMap));
            
            // Convertir en tableau de catégories formaté
            categories = Object.keys(categoryMap).map(categoryName => ({
              name: categoryName,
              // Valeurs par défaut ou dérivées des produits
              imageUrl: categoryMap[categoryName].imageUrl || `/assets/images/category/default.jpg`,
              slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
              iconName: getIconForCategory(categoryName),
              description: `Collection de produits ${categoryName} (${categoryMap[categoryName].count} articles)`,
              featured: categoryMap[categoryName].count > 2 // Les catégories avec plus de 2 produits sont mises en avant
            }));
          }
        } catch (productError) {
          console.error('Erreur lors de la récupération des produits:', productError);
          // En cas d'échec complet, utiliser les catégories par défaut
          categories = DEFAULT_CATEGORIES;
        }
      }
      
      // Si aucune catégorie n'a été trouvée ou générée, utiliser les catégories par défaut
      if (!categories || categories.length === 0) {
        console.log('Aucune catégorie trouvée ou générée, utilisation des catégories par défaut');
        categories = DEFAULT_CATEGORIES;
      }
      
      // S'assurer que chaque catégorie a un ID unique pour React
      categories = categories.map((cat, index) => ({
        ...cat,
        _id: cat._id || `category-${index}`
      }));
      
      console.log(`Envoi de ${categories.length} catégories à l'utilisateur`);
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      // En cas d'erreur grave, renvoyer les catégories par défaut au lieu d'une erreur
      // pour que l'application puisse quand même fonctionner
      return res.status(200).json(DEFAULT_CATEGORIES);
    }
  } else {
    // Méthode non autorisée
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Fonction utilitaire pour assigner une icône en fonction de la catégorie
function getIconForCategory(categoryName) {
  const name = categoryName.toLowerCase();
  
  if (name.includes('mode') || name.includes('vêtement') || name.includes('clothing')) {
    return 'icofont-shopping-cart';
  } else if (name.includes('électronique') || name.includes('electronic') || name.includes('tech')) {
    return 'icofont-laptop';
  } else if (name.includes('maison') || name.includes('home') || name.includes('deco')) {
    return 'icofont-home';
  } else if (name.includes('sport') || name.includes('fitness')) {
    return 'icofont-football';
  } else if (name.includes('beauté') || name.includes('beauty') || name.includes('cosmetic')) {
    return 'icofont-paint-brush';
  } else if (name.includes('livre') || name.includes('book')) {
    return 'icofont-book';
  } else if (name.includes('nourriture') || name.includes('food')) {
    return 'icofont-food';
  } else if (name.includes('santé') || name.includes('health')) {
    return 'icofont-heart-beat';
  }
  
  // Icône par défaut
  return 'icofont-shopping-cart';
}
