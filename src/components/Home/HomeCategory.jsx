import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Définir directement les chemins d'images existantes
const CATEGORY_IMAGES = [
  "/assets/images/category/01.jpg",
  "/assets/images/category/02.jpg",
  "/assets/images/category/03.jpg",
  "/assets/images/category/04.jpg",
  "/assets/images/category/05.jpg",
  "/assets/images/category/06.jpg"
];

const subTitle = "Choisissez parmi nos produits";
const title = "Achetez tout avec nous";
const btnText = "Commencer maintenant";

// Catégories de secours (fallback) si l'API échoue
const fallbackCategories = [
    {
        imageUrl: CATEGORY_IMAGES[0],
        imgAlt: 'Appareils photo',
        iconName: 'icofont-camera',
        name: 'Appareils photo',
    },
    {
        imageUrl: CATEGORY_IMAGES[1],
        imgAlt: 'Chaussures',
        iconName: 'icofont-shoe-alt',
        name: 'Chaussures',
    },
    {
        imageUrl: CATEGORY_IMAGES[2],
        imgAlt: 'Photographie',
        iconName: 'icofont-image',
        name: 'Photographie',
    },
    {
        imageUrl: CATEGORY_IMAGES[3],
        imgAlt: 'Tenues formelles',
        iconName: 'icofont-suit',
        name: 'Tenues formelles',
    },
    {
        imageUrl: CATEGORY_IMAGES[4],
        imgAlt: 'Sacs colorés',
        iconName: 'icofont-shopping-cart',
        name: 'Sacs colorés',
    },
    {
        imageUrl: CATEGORY_IMAGES[5],
        imgAlt: 'Déco maison',
        iconName: 'icofont-home',
        name: 'Déco maison',
    },
];

const HomeCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour charger les catégories depuis l'API
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement des catégories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Catégories reçues:", data);
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        // Utiliser les catégories de secours en cas d'échec
        setCategories(fallbackCategories);
        setError(error.message);
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
          {error && <p className="text-danger">Utilisation des catégories par défaut</p>}
        </div>
        <div className="section-wrapper">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4 justify-content-center row-cols-md-3 row-cols-sm-2 row-cols-1">
              {categories.map((category, i) => (
                <div className="col" key={i}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(category.name)}`}
                    className="category-item"
                    legacyBehavior>
                    <div className="category-inner">
                      <div className="category-thumb">
                        {/* Pour la compatibilité avec Next.js, utiliser Image au lieu de img */}
                        <Image 
                          src={category.imageUrl} 
                          alt={category.imgAlt || category.name}
                          width={300}
                          height={200}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="category-content">
                        <div className="cate-icon">
                          <i className={category.iconName || "icofont-brand-windows"}></i>
                        </div>
                        <h6>{category.name}</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link href="/shop" className="lab-btn" legacyBehavior>
              <span>{btnText}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCategory
