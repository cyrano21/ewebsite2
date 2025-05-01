/* eslint-disable react/prop-types */

import Link from "next/link";
import Rating from "../../components/Sidebar/Rating";

const ProductCards = ({ products, GridList }) => {
  // console.log(products.map(val => console.log(val.id)))
  return (
    <div
      className={`shop-product-wrap row justify-content-center ${
        GridList ? "grid" : "list"
      }`}
    >
      {products.map((product, i) => (
        <div className="col-lg-4 col-md-6 col-12" key={i}>
          <div className="product-item">
            <div className="product-thumb">
              <div className="pro-thumb">
                <img src={`${product.img}`} alt={`${product.img}`} />
              </div>
              <div className="product-action-link">
                <Link href={`/shop/${product._id || product.id}`} legacyBehavior>
                  <i className="icofont-eye"></i>
                </Link>
                <a href="#">
                  <i className="icofont-heart"></i>
                </a>
                <Link href="/panier" legacyBehavior>
                  <i className="icofont-cart-alt"></i>
                </Link>
              </div>
            </div>
            <div className="product-content">
              <h5>
                <Link
                  href={`/shop/${product._id || product.id}`}
                  className="product-name"
                  legacyBehavior>{product.name}</Link>
              </h5>
              <p className="productRating">
                <Rating />
              </p>
              <h6>${product.price}</h6>
            </div>
          </div>
          <div className="product-list-item">
            <div className="product-thumb">
              <div className="pro-thumb">
                <img src={`${product.img}`} alt={`${product.imgAlt}`} />
              </div>
              <div className="product-action-link">
                <Link href={`/shop/${product._id || product.id}`} legacyBehavior>
                  <i className="icofont-eye"></i>
                </Link>
                <Link href="#" legacyBehavior>
                  <i className="icofont-heart"></i>
                </Link>
                <Link href="/panier" legacyBehavior>
                  <i className="icofont-cart-alt"></i>
                </Link>
              </div>
            </div>
            <div className="product-content">
            <Link href={`/shop/${product._id || product.id}`} legacyBehavior>{product.name}</Link>
              <p className="productRating">
                <Rating />
              </p>
              <h6>${product.price}</h6>
              <p>{product.seller}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
