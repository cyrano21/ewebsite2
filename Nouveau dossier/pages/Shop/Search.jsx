/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Link from "next/link";

const Search = ({ products, GridList }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="widget widget-search">
      <form className="search-wrapper mb-3">
        <input
          type="text"
          name="s"
          placeholder="Search..."
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <i className="icofont-search-2"></i>
        </button>
      </form>
      <div>
        {searchTerm && filteredProducts.map((product) => (
          <Link key={product.id} href={`/shop/${product.id}`} legacyBehavior>
            <div className="d-flex gap-3 p-2">
            <div>
              <div className="pro-thumb h-25">
                <img src={`${product.img}`} alt={`${product.imgAlt}`} width={70} className="flex-{grow|shrink}-0"/>
              </div>
            </div>
            <div className="product-content">
              <p>
                <Link href={`/shop/${product.id}`} legacyBehavior>{product.name}</Link>
              </p>
              <h6>${product.price}</h6>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
