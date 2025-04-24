/* eslint-disable react/prop-types */
import Link from 'next/link';        // ← ici
import Rating from '../../components/Sidebar/Rating';

const ProductCards = ({ products, GridList }) => (
  <div
    className={`shop-product-wrap row justify-content-center ${
      GridList ? 'grid' : 'list'
    }`}
  >
    {products.map((product, i) => (
      <div className="col-lg-4 col-md-6 col-12" key={i}>
        {/* Version grille */}
        {GridList && (
          <div className="product-item">
            <div className="product-thumb">
              <div className="pro-thumb">
                <img src={product.img} alt={product.name} />
              </div>
              <div className="product-action-link">
                <Link href={`/Shop/${product.id}`}><a><i className="icofont-eye" /></a></Link>
                <a href="#"><i className="icofont-heart" /></a>
                <Link href="/cart-page"><a><i className="icofont-cart-alt" /></a></Link>
              </div>
            </div>
            <div className="product-content">
              <h5>
                <Link href={`/Shop/${product.id}`}><a>{product.name}</a></Link>
              </h5>
              <p className="productRating"><Rating /></p>
              <h6>${product.price}</h6>
            </div>
          </div>
        )}

        {/* Version liste */}
        {!GridList && (
          <div className="product-list-item">
            <div className="product-thumb">
              <div className="pro-thumb">
                <img src={product.img} alt={product.name} />
              </div>
              <div className="product-action-link">
                <Link href={`/shop/${product.id}`}><a><i className="icofont-eye" /></a></Link>
                <a href="#"><i className="icofont-heart" /></a>
                <Link href="/cart-page"><a><i className="icofont-cart-alt" /></a></Link>
              </div>
            </div>
            <div className="product-content">
              <Link href={`/shop/${product.id}`}><a>{product.name}</a></Link>
              <p className="productRating"><Rating /></p>
              <h6>${product.price}</h6>
              {product.seller && <p>{product.seller}</p>}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default ProductCards;
