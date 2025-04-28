import React, { useEffect, useState } from "react";
import Link from "next/link";

const fallbackImg = "/assets/images/category/01.jpg";

const ShopIndex = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="container py-5">
      <h2 className="mb-4">Toutes les catégories</h2>
      <div className="row g-4">
        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : categories.length === 0 ? (
          <div className="text-center">Aucune catégorie trouvée.</div>
        ) : (
          categories.map((cat) => (
            <div className="col-md-3 col-6" key={cat._id}>
              <Link href={`/shop/${cat.slug}`}>
                <div className="card h-100">
                  <img src={cat.imageUrl || fallbackImg} className="card-img-top" alt={cat.name} />
                  <div className="card-body">
                    <h6 className="card-title">{cat.name}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopIndex;
