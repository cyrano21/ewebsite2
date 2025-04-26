import { useState, useEffect } from "react";
import Link from "next/link";
import Rating from "../../components/Sidebar/Rating";

const title = "Nos Produits";

const CategoryShowCase = () => {
    const [items, setItems] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Récupérer les produits depuis l'API
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/products');
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                setAllProducts(data);
                setItems(data);
                
                // Extraire les catégories uniques des produits
                const uniqueCategories = [...new Set(data.map(product => product.cate))];
                setCategories(uniqueCategories);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des produits:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filterItem = (categItem) => {
        if (categItem === 'Tous') {
            setItems(allProducts);
            return;
        }
        
        const updateItems = allProducts.filter((product) => {
            return product.cate === categItem;
        });
        
        setItems(updateItems);
    }
  return (
      <div className="course-section style-3 padding-tb">
          <div className="course-shape one">
            <img src="/assets/images/shape-img/icon/01.png" alt="education" />
          </div>
          <div className="course-shape two">
            <img src="/assets/images/shape-img/icon/02.png" alt="education" />
          </div>
          <div className="container">

              {/* section header */}
              <div className="section-header">
                  <h2 className="title">{title}</h2>
                  <div className="course-filter-group">
                      <ul className="lab-ul">
                          <li onClick={() => setItems(allProducts)}>Tous</li>
                          {categories.map((category, index) => (
                              <li key={index} onClick={() => filterItem(category)}>{category}</li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* section body */}
              <div className="section-wrapper">
                  <div className="row g-4 justify-content-center row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 course-filter">
                      { items.map((elem) => {
                          const { id, imgUrl, imgAlt, cate, title, brand, authorName, price } = elem;
                          return (
                              <div className="col" key={id}>
                                  <div className="course-item style-4">
                                      <div className="course-inner">
                                          <div className="course-thumb">
                                              <img src={imgUrl} alt="" />
                                              <div className="course-category">
                                                  <div className="course-cate">
                                                      <a href="#">{cate}</a>
                                                  </div>
                                                  <div className="course-reiew">
                                                      <Rating />
                                                  </div>
                                              </div>
                                          </div>

                                          {/* content  */}
                                          <div className="course-content">
                                              <Link href={`/shop/${id}`} legacyBehavior><h5>{title}</h5></Link>
                                              <div className="course-footer">
                                                  <div className="course-author">
                                                      <span className="ca-name">{brand}</span>
                                                  </div>
                                                  <div className="course-price">{price}</div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ); })
                      }
                  </div>
              </div>
          </div>
      </div>
  );
}

export default CategoryShowCase
