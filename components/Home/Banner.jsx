// components/Home/Banner.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SelectCategory from "../shop/SelectCategory.jsx";

const title = (
  <h2>
    Trouvez Votre Produit Parmi <span>Des Milliers</span> D&apos;articles
  </h2>
);
const desc = "Nous Avons La Plus Grande Collection de produits";

const bannerList = [
  {
    iconName: "icofont-users-alt-4",
    text: "1.5 Million Customers",
  },
  {
    iconName: "icofont-notification",
    text: "More then 2000 Marchent",
  },
  {
    iconName: "icofont-globe",
    text: "Buy Anything Online",
  },
];

const Banner = () => {
  // product search funtionality
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);

    // Filter products based on the search term
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="banner-section style-4">
      <div className="container">
        <div className="banner-content">
          <div className="banner-title-wrapper stagger-fade-in">
            {title}
            <div className="banner-highlight-bar"></div>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()} className="modern-search-form">
            <div className="search-container">
              <SelectCategory select={"all"} />
              <div className="search-input-wrapper">
                <input
                  type="text"
                  name="search"
                  placeholder="Recherchez votre produit"
                  value={searchInput}
                  onChange={handleSearch}
                  className="modern-search-input"
                />
                <button type="submit" className="modern-search-button">
                  <i className="icofont-search"></i>
                </button>
              </div>
            </div>
            
            {/* Résultats de recherche */}
            {searchInput && filteredProducts.length > 0 && (
              <ul className="lab-ul search-results">
                {filteredProducts.map((product) => (
                  <li key={product.id} className="search-result-item">
                    <Link href={`/shop/product/${product.id}`} legacyBehavior>
                      <div className="search-result-item-inner">
                        {product.img && (
                          <div className="search-result-thumbnail">
                            <img src={product.img} alt={product.name} className="result-thumb" />
                          </div>
                        )}
                        <div className="search-result-content">
                          <span className="result-name">{product.name}</span>
                          <span className="result-price">${parseFloat(product.price).toFixed(2)}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
                <li className="search-result-footer">
                  <Link href={`/shop?query=${encodeURIComponent(searchInput)}`} className="see-all-results">
                    Voir tous les résultats
                  </Link>
                </li>
              </ul>
            )}
            
            {searchInput && filteredProducts.length === 0 && (
              <ul className="lab-ul search-results">
                <li className="no-results">
                  <span>Aucun résultat trouvé pour "{searchInput}"</span>
                </li>
              </ul>
            )}
          </form>
          
          <p className="banner-description">{desc}</p>

          {/* Affichage de la bannerList */}
          <ul className="lab-ul banner-list">
            {bannerList.map((item, index) => (
              <li key={index} className="banner-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="banner-icon-wrapper">
                  <i className={item.iconName}></i>
                </div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Banner;
