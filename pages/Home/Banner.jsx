"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SelectCategory from "../../components/Shop/SelectCategory";
import "../../styles/banner.css"; // Import du fichier CSS personnalisé

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
          {title}
          <form onSubmit={(e) => e.preventDefault()}>
            <SelectCategory select={"all"} />
            <input
              type="text"
              name="search"
              placeholder="Recherchez votre produit"
              value={searchInput}
              onChange={handleSearch}
            />
            <button type="submit">
              <i className="icofont-search"></i>
            </button>
          </form>
          <p>{desc}</p>
          <ul className="lab-ul">
          {searchInput && filteredProducts.map((product, i) => (
              <li key={i}>
               <Link href={`/shop/${product.id}`} legacyBehavior> {product.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Banner;
