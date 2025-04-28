import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const subTitle = "Choisissez parmi nos produits";
const title = "Achetez tout avec nous";
const btnText = "Commencer maintenant";

const fallbackImg = "/assets/images/category/01.jpg";

const HomeCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
                        <div className="text-center">Chargement des catégories...</div>
                      ) : categories.length === 0 ? (
                        <div className="text-center">Aucune catégorie trouvée.</div>
                      ) : (
                        categories.map((cat, i) => (
                          <div className="col" key={cat._id || i}>
                            <Link href={`/shop/${cat.slug}`} className="category-item">
                              <div 
                                className="category-inner" 
                                style={{
                                  transition: 'box-shadow 0.18s, transform 0.14s',
                                  cursor: 'pointer',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                                tabIndex={0} 
                                role="button" 
                                aria-label="Voir la catégorie"
                                onClick={() => {
                                  router.push(`/shop?category=${cat.slug}`);
                                }}
                              >
                                <div className="category-thumb">
                                  <img src={cat.imageUrl || fallbackImg} alt={cat.name} />
                                </div>
                                <div className="category-content">
                                  <div className="cate-icon">
                                    <i className="icofont-brand-windows"></i>
                                  </div>
                                  <h6>{cat.name}</h6>
                                </div>
                              </div>
                            </Link>
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
}

export default HomeCategory
