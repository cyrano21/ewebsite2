import Link from "next/link";
import Image from "next/image"; // ✅ Import du composant Image
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const subTitle = "Choisissez parmi nos produits";
const title = "Achetez tout avec nous";
const btnText = "Commencer maintenant";

// Définir des images de catégorie par défaut
const DEFAULT_IMAGE = "/assets/images/category/01.jpg";

// Tableau d'images de catégories existantes pour une rotation
const CATEGORY_IMAGES = [
  "/assets/images/category/01.jpg",
  "/assets/images/category/02.jpg",
  "/assets/images/category/03.jpg",
  "/assets/images/category/04.jpg",
  "/assets/images/category/05.jpg",
  "/assets/images/category/06.jpg"
];

// Fonction pour obtenir une image de catégorie par index
const getCategoryImage = (index) => {
  return CATEGORY_IMAGES[index % CATEGORY_IMAGES.length];
};

// Définir des catégories par défaut au cas où l'API ne retourne rien
const DEFAULT_CATEGORIES = [
  {
    name: "Électronique",
    slug: "electronique",
    imageUrl: getCategoryImage(0),
    iconName: "icofont-laptop"
  },
  {
    name: "Mode",
    slug: "mode",
    imageUrl: getCategoryImage(1),
    iconName: "icofont-shopping-cart"
  },
  {
    name: "Maison",
    slug: "maison",
    imageUrl: getCategoryImage(2),
    iconName: "icofont-home"
  },
  {
    name: "Sport",
    slug: "sport",
    imageUrl: getCategoryImage(3),
    iconName: "icofont-football"
  },
  {
    name: "Beauté",
    slug: "beaute",
    imageUrl: getCategoryImage(4),
    iconName: "icofont-paint-brush"
  },
  {
    name: "Livres",
    slug: "livres",
    imageUrl: getCategoryImage(5),
    iconName: "icofont-book"
  }
];

const HomeCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Récupération des catégories...');
        const response = await fetch("/api/categories");
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Catégories reçues:', data);
        
        // S'assurer que les données sont un tableau
        if (Array.isArray(data)) {
          // Vérifier si le tableau est vide
          if (data.length === 0) {
            console.log('Aucune catégorie trouvée, utilisation des catégories par défaut');
            setCategories(DEFAULT_CATEGORIES);
          } else {
            // S'assurer que chaque catégorie a un slug et une image
            const processedCategories = data.map(cat => ({
              ...cat,
              slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
              imageUrl: cat.imageUrl || DEFAULT_IMAGE
            }));
            setCategories(processedCategories);
          }
        } else {
          console.error('La réponse API n\'est pas un tableau:', data);
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des catégories:', err);
        // Utiliser les catégories par défaut en cas d'erreur
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <div className="category-section style-4 padding-tb">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">{subTitle}</span>
          <h2 className="title">{title}</h2>
        </div>
        <div className="section-wrapper">
          <div className="row g-4 justify-content-center row-cols-md-3 row-cols-sm-2 row-cols-1">
            {loading ? (
              <div className="col-12 text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement des catégories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="col-12 text-center p-5">
                <div className="alert alert-warning" role="alert">
                  Aucune catégorie trouvée. Veuillez réessayer ultérieurement.
                </div>
              </div>
            ) : (
              categories.map((cat, i) => (
                <div className="col" key={cat._id || `category-${i}`}>
                  <div className="category-item">
                    <div 
                      className="category-inner" 
                      style={{
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%'
                      }}
                      onClick={() => router.push(cat.slug ? `/shop/${cat.slug}` : `/shop?category=${encodeURIComponent(cat.name)}`)}
                    >
                      <div 
                        className="category-thumb" 
                        style={{ 
                          position: 'relative', 
                          height: '180px',
                          width: '100%',
                          overflow: 'hidden',
                          borderRadius: '8px 8px 0 0'
                        }}
                      >
                        {/* ✅ Utilisation de <Image /> avec height: "auto" pour préserver le ratio d'aspect */}
                        <Image 
                          src={`/assets/images/category/0${(i % 6) + 1}.jpg`}
                          alt={cat.name || 'Catégorie'}
                          width={300} 
                          height={180}
                          style={{
                            width: '100%',
                            height: 'auto', // ✅ Maintient le ratio d'aspect
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                      <div className="category-content" style={{ 
                        position: 'absolute',
                        left: '0',
                        bottom: '0',
                        width: '100%',
                        padding: '10px 15px', 
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(28, 61, 94, 0.8)'
                      }}>
                        <div className="cate-icon" style={{ 
                          marginRight: '10px',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: '#FFD700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="icofont-brand-windows" style={{ fontSize: '16px', color: '#333' }}></i>
                        </div>
                        <h6 style={{ 
                          margin: 0, 
                          fontWeight: 'normal', 
                          color: 'white',
                          fontSize: '16px'
                        }}>
                          {cat.name}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-5">
            <Link href="/shop" className="lab-btn"><span>{btnText}</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategory;
