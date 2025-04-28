import React, { useState, useEffect } from "react";
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
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catsRes, prodsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/products'),
                ]);
                if (!catsRes.ok || !prodsRes.ok) throw new Error('Erreur HTTP');
                const cats = await catsRes.json();
                const data = await prodsRes.json();
                setCategories(Array.isArray(cats) ? cats : []);
                setAllProducts(Array.isArray(data) ? data : []);
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filterItem = (slug) => {
        if (slug === 'all') {
            setItems(allProducts);
        } else {
            setItems(allProducts.filter((product) => product.category === slug));
        }
    };

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
                            <li onClick={() => filterItem('all')}>Tous</li>
                            {categories.map((cat) => (
                                <li key={cat._id} onClick={() => filterItem(cat.slug)}>
                                    {cat.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* section body */}
                <div className="section-wrapper">
                    <div className="row g-4 justify-content-center row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 course-filter">
                        {items.map((prod) => {
                            const { _id, id, img, name, brand, price } = prod;
                            return (
                                <div className="col" key={id}>
                                    <div className="course-item style-4">
                                        <div className="course-inner">
                                            <div className="course-thumb">
                                                <img src={img} alt={name} />
                                                <div className="course-category">
                                                    <div className="course-cate">
                                                        <span>{prod.category}</span>
                                                    </div>
                                                    <div className="course-reiew">
                                                        <Rating />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* content  */}
                                            <div className="course-content">
                                                <Link href={`/shop/${_id || id}`}>
                                                    <h5>{name}</h5>
                                                </Link>
                                                <div className="course-footer">
                                                    <div className="course-author">
                                                        <span className="ca-name">{brand}</span>
                                                    </div>
                                                    <div className="course-price">{price}€</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryShowCase;
