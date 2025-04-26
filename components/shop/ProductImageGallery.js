// components/shop/ProductImageGallery.js
import React from 'react';
import { Col, Image as BootstrapImage, Badge } from 'react-bootstrap';

const ProductImageGallery = ({
  thumbnails,        // Expects an array of image URLs (like product.thumbnails)
  selectedImage,     // Expects the URL of the currently selected image
  onThumbnailSelect, // Expects a function to call when a thumbnail is clicked
  productName,       // Expects the product name for alt text
  discount,          // Expects the discount percentage (number)
  stock,             // Expects the stock count (number)
}) => {
  // Use a default placeholder if selectedImage is initially null or undefined
  const currentImage = selectedImage || "https://via.placeholder.com/450?text=Loading...";
  // Provide a default empty array for thumbnails if none are passed
  const imageThumbnails = thumbnails || [];

  return (
    <>
      {/* Thumbnails (Desktop) */}
      <Col md={1} className="d-none d-md-block thumbnail-column">
        {imageThumbnails.map((t, i) => (
          <BootstrapImage
            key={i}
            src={t || "https://via.placeholder.com/60?text=Err"} // Add fallback for thumbnail src
            alt={`${productName || 'Product'} thumbnail ${i + 1}`}
            width={60}
            height={60}
            className={`img-thumbnail mb-2 pointer ${
              currentImage === t ? 'active-thumbnail' : ''
            }`}
            onClick={() => t && onThumbnailSelect(t)} // Only call if thumbnail exists
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/60?text=Err";
            }}
            style={{ objectFit: 'contain' }} // Ensure image fits within bounds
          />
        ))}
      </Col>

      {/* Main Image */}
      <Col xs={12} md={6} className="main-image-column">
        <div className="position-relative main-image-card text-center"> {/* Added text-center */}
          <BootstrapImage
            src={currentImage}
            alt={productName || 'Product Image'}
            className="main-product-image img-fluid"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/450?text=Image+Not+Found";
            }}
            style={{ maxHeight: '450px', objectFit: 'contain' }} // Ensure image fits
          />
          {discount > 0 && (
            <Badge
              bg="danger"
              className="position-absolute top-0 end-0 m-2 discount-badge"
            >
              {discount}% OFF
            </Badge>
          )}
          {/* Ensure stock is a number before comparing */}
          {typeof stock === 'number' && stock <= 0 && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </div>
         {/* Thumbnails (Mobile) */}
         <div className="d-flex d-md-none overflow-auto mt-2 mobile-thumbnails pb-2"> {/* Added pb-2 for spacing */}
           {imageThumbnails.map((t, i) => (
             <BootstrapImage
               key={i}
               src={t || "https://via.placeholder.com/50?text=Err"} // Add fallback
               alt={`${productName || 'Product'} thumbnail ${i + 1}`}
               width={50}
               height={50}
               className={`img-thumbnail me-2 pointer flex-shrink-0 ${
                 currentImage === t ? 'active-thumbnail' : ''
               }`}
               onClick={() => t && onThumbnailSelect(t)} // Only call if thumbnail exists
               onError={(e) => {
                   e.target.onerror = null;
                   e.target.src = "https://via.placeholder.com/50?text=Err";
               }}
                style={{ objectFit: 'contain' }} // Ensure image fits
             />
           ))}
         </div>
      </Col>
    </>
  );
};

export default ProductImageGallery;