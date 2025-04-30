import React, { useState, useEffect } from "react";
import Link from "next/link";
import Rating from "../../components/Sidebar/Rating";

const CategoryShowCase = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const catsRes = await fetch("/api/categories");
        if (!catsRes.ok) throw new Error("Erreur chargement catégories");
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
  if (error) return <p>Erreur: {error}</p>;

  // Filtrage des catégories et produits valides
  const filteredSections = sections
    .map((section) => {
      // Log tous les produits de la section
      console.log(`Section: ${section.name} (${section._id}) - produits initiaux:`, section.products);
      // Filtrage strict : image valide      // Un produit est valide s'il a une image fonctionnelle, une description et un nom
      const validProducts = (section.products || []).filter((prod) => {
        const img = prod && prod.img;
        // Vérifie si l'image est fonctionnelle (pas cassée/404)
        const isImageNotBroken = !failedImages[prod?.id];
        // Vérifie que l'URL semble valide
        const isValidImg = !!img && typeof img === 'string' && img.trim() !== '' && 
                         img !== '/images/placeholder.png' && 
                         img !== '/assets/images/placeholder.jpg';
        
        const isValid = prod && isValidImg && isImageNotBroken && prod.description && prod.name;
        
        if (!isValid) {
          console.log('Produit rejeté:', {
            id: prod?.id,
            hasImg: !!img,
            isValidImgUrl: isValidImg,
            imageBroken: failedImages[prod?.id],
            hasDesc: !!prod?.description,
            hasName: !!prod?.name
          });
        }
        return isValid;
      });
      console.log(`Section: ${section.name} - produits valides:`, validProducts);
      return { ...section, products: validProducts };
    })
    .filter((section) => section.products.length > 0);
  console.log('Sections finales affichées:', filteredSections);

  return (
    <div className="course-section style-3 padding-tb">
      <div className="container">
        {filteredSections.map((section) => (
          <div key={section._id} className="mb-5">
            <h3 className="title">{section.name}</h3>
            <div className="row g-4 justify-content-center row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1">
              {section.products.map((prod) => (
                <div key={prod.id} className="col">
                  <div className="course-item style-4">
                    <div className="course-inner">
                      <div className="course-thumb">
                        <img 
                          src={prod.img || '/assets/images/placeholder.jpg'} 
                          alt={prod.name} 
                          onError={(e) => {
                            console.log(`Erreur chargement d'image (id:${prod.id}):`, prod.img);
                            // Marquer comme image échouée
                            setFailedImages(prev => ({
                              ...prev,
                              [prod.id]: true
                            }));
                            e.target.onerror = null;
                            e.target.src = '/assets/images/placeholder.jpg';
                          }}
                        />
                        <div className="course-category">
                          <div className="course-cate">
                            <span>{section.name}</span>
                          </div>
                          <div className="course-reiew">
                            <Rating />
                          </div>
                        </div>
                      </div>
                      <div className="course-content">
                        <Link href={`/shop/product/${prod.id}`}>
                          <h5>{prod.name}</h5>
                        </Link>
                        <div className="course-footer">
                          <div className="course-author">
                            <span className="ca-name">{prod.brand}</span>
                          </div>
                          <div className="course-price">{prod.price}€</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-3">
              <Link href={`/shop?category=${section.slug}`} className="lab-btn">
                Voir plus
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowCase;