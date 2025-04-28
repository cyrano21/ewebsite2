import React, { useState, useEffect } from "react";
import Link from "next/link";
import Rating from "../../components/Sidebar/Rating";

const CategoryShowCase = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="course-section style-3 padding-tb">
      <div className="container">
        {sections.map((section) => (
          <div key={section._id} className="mb-5">
            <h3 className="title">{section.name}</h3>
            <div className="row g-4 justify-content-center row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1">
              {section.products.map((prod) => (
                <div key={prod.id} className="col">
                  <div className="course-item style-4">
                    <div className="course-inner">
                      <div className="course-thumb">
                        <img src={prod.img || '/assets/images/placeholder.jpg'} alt={prod.name} />
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