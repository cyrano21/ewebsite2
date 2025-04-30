import React, { useState, useEffect } from "react";
import Rating from "../../components/Sidebar/Rating";
import { useRouter } from "next/router";

const CategoryShowCase = () => {
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const catsRes = await fetch("/api/categories");
        if (!catsRes.ok) throw new Error("Erreur lors du chargement des catégories");
        const cats = await catsRes.json();
        const sectionsData = await Promise.all(
          cats.map(async (cat) => {
            const prodsRes = await fetch(`/api/products?category=${cat._id}&limit=10`);
            const prods = prodsRes.ok ? await prodsRes.json() : [];
            return { ...cat, products: prods };
          })
        );
        setSections(sectionsData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
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