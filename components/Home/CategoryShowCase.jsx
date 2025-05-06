import React, { useState, useEffect } from "react";
import Rating from "../../components/Sidebar/Rating";
import { useRouter } from "next/router";

// Catégories par défaut à utiliser en cas d'erreur
const DEFAULT_CATEGORIES = [
  {
    _id: "default1",
    name: "Électronique",
    slug: "electronique",
    description: "Appareils électroniques et gadgets",
    imageUrl: "/assets/images/category/01.jpg",
    isActive: true
  },
  {
    _id: "default2",
    name: "Mode",
    slug: "mode",
    description: "Vêtements et accessoires",
    imageUrl: "/assets/images/category/02.jpg",
    isActive: true
  },
  {
    _id: "default3",
    name: "Maison",
    slug: "maison",
    description: "Articles pour la maison",
    imageUrl: "/assets/images/category/03.jpg",
    isActive: true
  }
];

const CategoryShowCase = () => {
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      console.log('🔍 [CategoryShowCase] Début de la récupération des catégories');
      setLoading(true);
      
      try {
        // Tentative de récupération des catégories avec timeout
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 5000);
        
        console.log('🔍 [CategoryShowCase] Appel de /api/categories');
        const catsRes = await fetch("/api/categories", {
          signal: abortController.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        console.log(`🔍 [CategoryShowCase] Réponse reçue: status=${catsRes.status}`);
        
        // Traitement de la réponse
        if (!catsRes.ok) {
          console.error(`❌ [CategoryShowCase] Erreur HTTP: ${catsRes.status}`);
          throw new Error(`Erreur HTTP ${catsRes.status}`);
        }
        
        // Récupération des catégories
        const cats = await catsRes.json();
        console.log(`🔍 [CategoryShowCase] ${cats.length} catégories reçues`);
        
        // Si aucune catégorie n'est trouvée, utiliser les catégories par défaut
        if (!cats || cats.length === 0) {
          console.log('🔍 [CategoryShowCase] Aucune catégorie trouvée, utilisation des catégories par défaut');
          const sectionsData = DEFAULT_CATEGORIES.map(cat => ({ ...cat, products: [] }));
          setSections(sectionsData);
          return;
        }
        
        // Récupération des produits pour chaque catégorie
        console.log('🔍 [CategoryShowCase] Récupération des produits par catégorie');
        const sectionsData = await Promise.all(
          cats.map(async (cat) => {
            try {
              console.log(`🔍 [CategoryShowCase] Récupération des produits pour ${cat.name} (${cat._id})`);
              const prodsRes = await fetch(`/api/products?category=${cat._id || cat.slug}&limit=10`, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-cache'
                }
              });
              
              if (!prodsRes.ok) {
                console.warn(`⚠️ [CategoryShowCase] Impossible de récupérer les produits pour ${cat.name}: ${prodsRes.status}`);
                return { ...cat, products: [] };
              }
              
              const prods = await prodsRes.json();
              console.log(`🔍 [CategoryShowCase] ${prods.length} produits récupérés pour ${cat.name}`);
              return { ...cat, products: prods };
            } catch (err) {
              console.error(`❌ [CategoryShowCase] Erreur pour les produits de ${cat.name}:`, err);
              return { ...cat, products: [] };
            }
          })
        );
        
        console.log('🔍 [CategoryShowCase] Toutes les données de sections récupérées');
        setSections(sectionsData);
      } catch (err) {
        console.error('❌ [CategoryShowCase] Erreur globale:', err);
        setError(err.message);
        
        // En cas d'erreur, utiliser les catégories par défaut
        console.log('🔍 [CategoryShowCase] Utilisation des catégories par défaut suite à l\'erreur');
        setSections(DEFAULT_CATEGORIES.map(cat => ({ ...cat, products: [] })));
      } finally {
        setLoading(false);
        console.log('🔍 [CategoryShowCase] Fin de la récupération des catégories');
      }
    };
    
    fetchSections();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  // Filtrage des catégories et produits valides
  const filteredSections = sections
    .map((section) => {
      console.log(`Section: ${section.name} (${section._id}) - produits initiaux:`, section.products);
      const validProducts = (section.products || []).filter((prod) => {
        const img = prod && prod.img;
        const isImageNotBroken = !failedImages[prod?.id];
        const isValidImg =
          !!img &&
          typeof img === "string" &&
          img.trim() !== "" &&
          img !== "/images/placeholder.png" &&
          img !== "/assets/images/placeholder.jpg";
        const isValid = prod && isValidImg && isImageNotBroken && prod.description && prod.name;

        if (!isValid) {
          console.log("Produit rejeté:", {
            id: prod?.id,
            hasImg: !!img,
            isValidImgUrl: isValidImg,
            imageBroken: failedImages[prod?.id],
            hasDesc: !!prod?.description,
            hasName: !!prod?.name,
          });
        }
        return isValid;
      });
      console.log(`Section: ${section.name} - produits valides:`, validProducts);
      return { ...section, products: validProducts };
    })
    .filter((section) => section.products.length > 0);
  console.log("Sections finales affichées:", filteredSections);

  // Créer la liste des catégories pour la barre de navigation à partir des sections filtrées
  const navCategories = [
    { name: "Tous", slug: "" }, // Entrée "Tous" pointant vers /shop sans filtre
    ...filteredSections.map((section) => ({
      name: section.name,
      slug: section.slug,
    })),
  ];

  // Déterminer les sections à afficher selon la catégorie active
  const sectionsToDisplay = activeCategory
    ? filteredSections.filter((section) => section.slug === activeCategory)
    : filteredSections;

  // Formatage du prix avec virgule
  const formatPrice = (price) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  return (
    <div className="course-section style-3 padding-tb">
      <div className="container">
        {/* En-tête avec barre de navigation */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-6">Nos Produits</h2>
          <nav className="border-b border-gray-200 pb-1">
            <div className="flex flex-nowrap overflow-x-auto gap-1 hide-scrollbar">
              {navCategories.map((cat, index) => (
                <button
                  key={cat.slug || "tous"}
                  type="button"
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeCategory === cat.slug ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"
                  }`}
                  onClick={() => setActiveCategory(cat.slug || "")}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;  /* Chrome, Safari, Opera */
          }
        `}</style>

        {/* Grille de produits */}
        {sectionsToDisplay.map((section) => (
          <div key={section._id} className="mb-5">
            <h3 className="title">{section.name}</h3>
            <div className="row g-4 justify-content-center row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1">
              {section.products.map((prod) => (
                <div key={prod.id} className="col">
                  <div className="course-item style-4 bg-white border rounded-lg shadow-sm">
                    <div className="course-inner">
                      {/* Image du produit */}
                      <div className="course-thumb">
                        <img
                          src={prod.img || "/assets/images/placeholder.jpg"}
                          alt={prod.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            console.log(`Erreur chargement d'image (id:${prod.id}):`, prod.img);
                            setFailedImages((prev) => ({
                              ...prev,
                              [prod.id]: true,
                            }));
                            e.target.onerror = null;
                            e.target.src = "/assets/images/placeholder.jpg";
                          }}
                        />
                        <div className="course-category flex justify-between items-center bg-yellow-300 px-2 py-1 rounded-t-md">
                          <div className="course-cate">
                            <span className="text-black">{section.name}</span>
                          </div>
                          <div className="course-reiew">
                            <Rating />
                          </div>
                        </div>
                      </div>
                      {/* Contenu du produit */}
                      <div className="course-content p-4">
                        <div className="text-lg font-medium hover:text-blue-600">{prod.name}</div>
                        <div className="course-footer flex justify-between items-center mt-2">
                          <div className="course-author">
                            <span className="ca-name text-gray-600">{prod.brand}</span>
                          </div>
                          <div className="course-price text-black font-bold">{formatPrice(prod.price)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-3">
              <button
                type="button"
                className="lab-btn"
                onClick={() => router.push(`/shop/${section.slug}`)}
              >
                Voir plus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowCase;