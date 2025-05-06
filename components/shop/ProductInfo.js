// components/shop/ProductInfo.js
import React from 'react';
import { Col, Badge, Form, InputGroup, Button, Row } from 'react-bootstrap';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';

// --- Internal helper component for Ratings ---
const ProductRating = ({ rating, count }) => (
  <div className="d-flex align-items-center mb-2 rating-section">
    {[...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`icofont-star ${
          typeof rating === 'number' && i < Math.round(rating) ? 'text-warning' : 'text-muted'
        }`}
        style={{ fontSize: '1.1em' }}
      />
    ))}
    {/* Texte en français */}
    <span className="ms-2 text-muted small">({count || 0} avis)</span>
  </div>
);

// --- Internal helper component for Price ---
const ProductPrice = ({ price, salePrice, discount }) => {
    const displayPrice = typeof price === 'number' ? price.toFixed(2) : 'N/A';
    const displaySalePrice = typeof salePrice === 'number' ? salePrice.toFixed(2) : null;

    return (
        <div className="price-section mb-3">
            <span className="h3 fw-bold text-primary me-2">
            {/* Symbole monétaire changé */}
            {displaySalePrice ? `$${displaySalePrice}` : `$${displayPrice}`}
            </span>
            {displaySalePrice && (
            <span className="text-decoration-line-through text-muted me-2">
                 {/* Symbole monétaire changé */}
                ${displayPrice}
            </span>
            )}
            {typeof discount === 'number' && discount > 0 && (
            <Badge bg="danger" pill>
                {discount}% off
            </Badge>
            )}
        </div>
    );
};


// --- Internal helper component for Stock Status ---
const ProductStockStatus = ({ stock }) => (
  <div className="stock-info mb-3 small">
    {typeof stock === 'number' && stock > 0 ? (
      <span className="text-success fw-bold">
        <i className="icofont-check-circled me-1" />
        In stock {stock > 0 ? `(${stock} available)` : ''}
      </span>
    ) : (
      <span className="text-danger fw-bold">
        <i className="icofont-close-circled me-1" />
        Out of stock
      </span>
    )}
  </div>
);

// --- Internal helper component for Options (Color/Size/Quantity) ---
const ProductOptions = ({
    colors, selectedColor, onColorSelect,
    sizes, selectedSize, onSizeSelect,
    quantity, onQuantityChange, maxQuantity
}) => {
    const availableStock = typeof maxQuantity === 'number' ? maxQuantity : 0;

    return (
        <>
            {/* Colors */}
            {colors?.length > 0 && (
                <div className="mb-3 options-section">
                 {/* Label ajouté */}
                <Form.Label className="fw-bold small mb-1">
                    Color : <span className="text-muted fw-normal">{selectedColor?.name || 'N/A'}</span>
                </Form.Label>
                <div className="d-flex flex-wrap gap-2">
                    {colors.map((c) => (
                    <div
                        key={c.name}
                        title={c.name}
                        className={`color-swatch pointer ${
                        selectedColor?.name === c.name ? 'selected' : ''
                        }`}
                        style={{ backgroundColor: c.hex || '#ccc' }}
                        onClick={() => onColorSelect(c)}
                        role="button"
                        aria-label={`Select color ${c.name}`}
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onColorSelect(c)}
                    />
                    ))}
                </div>
                </div>
            )}

            {/* Size & Quantity Row */}
            <Row className="align-items-end mb-4 gx-2">
                {/* Size */}
                {sizes?.length > 0 && (
                <Col xs={6} sm={5} md={5} lg={4}>
                     {/* Label ajouté */}
                    <Form.Label className="fw-bold small mb-1">Size :</Form.Label>
                    <Form.Select
                    size="sm"
                    value={selectedSize || ''}
                    onChange={(e) => onSizeSelect(e.target.value)}
                    aria-label="Select size"
                    disabled={!sizes || sizes.length === 0}
                    >
                    {sizes.map((s) => (
                        <option key={s} value={s}>
                        {s}
                        </option>
                    ))}
                    </Form.Select>
                     {/* TODO: Ajouter lien Size chart si nécessaire */}
                     {/* <Link href="/size-chart"><a className="small text-decoration-none d-block mt-1">Size chart</a></Link> */}
                </Col>
                )}

                {/* Quantity */}
                <Col xs={6} sm={7} md={7} lg={5}>
                     {/* Label ajouté */}
                    <Form.Label className="fw-bold small mb-1">Quantity :</Form.Label>
                    <InputGroup size="sm" style={{ maxWidth: '130px' }}>
                    <Button
                        variant="outline-secondary"
                        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                    >
                        −
                    </Button>
                    <Form.Control
                        readOnly
                        value={quantity}
                        className="text-center quantity-input"
                        aria-label="Current quantity"
                        style={{ flex: '1 1 auto' }}
                    />
                    <Button
                        variant="outline-secondary"
                        onClick={() => onQuantityChange(Math.min(availableStock, quantity + 1))}
                        disabled={quantity >= availableStock || availableStock <= 0}
                        aria-label="Increase quantity"
                    >
                        +
                    </Button>
                    </InputGroup>
                </Col>
            </Row>
        </>
    );
};


// --- Main ProductInfo Component ---
const ProductInfo = ({
  product,
  selectedColor, onColorSelect,
  selectedSize, onSizeSelect,
  quantity, onQuantityChange,
  discount
}) => {
  if (!product) {
    return <Col md={5}><p>Loading product details...</p></Col>;
  }

  return (
      <Col md={5} className="product-info-column">
          <ProductRating rating={product.rating || product.ratings || 0} count={product.ratingsCount || product.numReviews || 0} />
          <h1 className="product-title h4 mb-2">{product.name || 'Product Name Unavailable'}</h1>
          {product.badges?.length > 0 && (
            <div className="badges-section mb-3">
              {product.badges.map((b, i) => (
                // Ajustement style badge pour mieux correspondre
                (<Badge key={i} bg="success" className="me-1 small fw-semibold">
                    {b}
                </Badge>)
              ))}
            </div>
          )}
          <ProductPrice price={product.price} salePrice={product.salePrice} discount={discount} />
          <ProductStockStatus stock={product.stock} />
          {product.deliveryEstimate && (
             <p className="small mb-2 delivery-info">
                 {/* Texte ajusté pour se rapprocher de l'exemple */}
                Do you want it on <strong>{product.deliveryEstimate}</strong>? Choose Saturday Delivery at checkout if you want your order delivered within 12 hours 43 minutes,{' '}
                <Link href="/delivery-details" passHref legacyBehavior>
                    <a className="text-decoration-none">Details</a>
                </Link>
                . Gift wrapping is available. {/* Texte ajouté */}
             </p>
          )}
          {product.specialOfferEndDate && (
             <p className="small text-danger fw-bold mb-3 offer-countdown">
                <i className="icofont-stopwatch me-1" />
                Special offer ends in{' '}
                <CountdownTimer endDate={product.specialOfferEndDate} />
                {' '}hours {/* Texte ajouté */}
             </p>
          )}
          <ProductOptions
            colors={product.colors}
            selectedColor={selectedColor}
            onColorSelect={onColorSelect}
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSizeSelect={onSizeSelect}
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            maxQuantity={product.stock}
          />
      </Col>
  );
};

export default ProductInfo;