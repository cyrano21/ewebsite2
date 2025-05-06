import React, { useState } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { useRouter } from 'next/router';

const PRICE_RANGES = [
  { id: 'price-0-50', label: 'Moins de 50€', min: 0, max: 50 },
  { id: 'price-50-100', label: '50€ - 100€', min: 50, max: 100 },
  { id: 'price-100-200', label: '100€ - 200€', min: 100, max: 200 },
  { id: 'price-200-500', label: '200€ - 500€', min: 200, max: 500 },
  { id: 'price-500-plus', label: 'Plus de 500€', min: 500, max: null }
];

const ProductFilterItems = ({ 
  categories = [], 
  brands = [], 
  colors = [],
  sizes = [],
  tags = [],
  ratings = [5, 4, 3, 2, 1],
  availabilityOptions = ['En stock', 'Sur commande'],
  onFilter,
  initialFilters = {}
}) => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    brands: initialFilters.brands || [],
    priceRange: initialFilters.priceRange || null,
    colors: initialFilters.colors || [],
    sizes: initialFilters.sizes || [],
    tags: initialFilters.tags || [],
    rating: initialFilters.rating || null,
    availability: initialFilters.availability || [],
    ...initialFilters
  });

  // Gérer les changements de filtres
  const handleCategoryChange = (categoryId, checked) => {
    const updatedCategories = checked 
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    
    updateFilters('categories', updatedCategories);
  };

  const handleBrandChange = (brandId, checked) => {
    const updatedBrands = checked 
      ? [...filters.brands, brandId]
      : filters.brands.filter(id => id !== brandId);
    
    updateFilters('brands', updatedBrands);
  };

  const handlePriceRangeChange = (range, checked) => {
    updateFilters('priceRange', checked ? range : null);
  };

  const handleColorChange = (colorId, checked) => {
    const updatedColors = checked 
      ? [...filters.colors, colorId]
      : filters.colors.filter(id => id !== colorId);
    
    updateFilters('colors', updatedColors);
  };

  const handleSizeChange = (sizeId, checked) => {
    const updatedSizes = checked 
      ? [...filters.sizes, sizeId]
      : filters.sizes.filter(id => id !== sizeId);
    
    updateFilters('sizes', updatedSizes);
  };

  const handleTagChange = (tagId, checked) => {
    const updatedTags = checked 
      ? [...filters.tags, tagId]
      : filters.tags.filter(id => id !== tagId);
    
    updateFilters('tags', updatedTags);
  };

  const handleRatingChange = (rating, checked) => {
    updateFilters('rating', checked ? rating : null);
  };

  const handleAvailabilityChange = (availability, checked) => {
    const updatedAvailability = checked 
      ? [...filters.availability, availability]
      : filters.availability.filter(a => a !== availability);
    
    updateFilters('availability', updatedAvailability);
  };

  // Mettre à jour les filtres et appeler le callback
  const updateFilters = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    
    if (onFilter) {
      onFilter(updatedFilters);
    }
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    const resetState = {
      categories: [],
      brands: [],
      priceRange: null,
      colors: [],
      sizes: [],
      tags: [],
      rating: null,
      availability: []
    };
    
    setFilters(resetState);
    
    if (onFilter) {
      onFilter(resetState);
    }
  };

  // Appliquer les filtres (pour les appareils mobiles)
  const applyFilters = () => {
    if (onFilter) {
      onFilter(filters);
    }
  };

  return (
    <div className="product-filters">
      {/* Bouton de réinitialisation */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filtres</h5>
        <Button 
          variant="link" 
          size="sm" 
          className="p-0 text-decoration-none" 
          onClick={resetFilters}
        >
          Réinitialiser
        </Button>
      </div>

      {/* Accordion des filtres */}
      <Accordion defaultActiveKey={['0', '1']} alwaysOpen className="mb-3">
        {/* Catégories */}
        {categories.length > 0 && (
          <Accordion.Item eventKey="0">
            <Accordion.Header>Catégories</Accordion.Header>
            <Accordion.Body>
              <Form>
                {categories.map(category => (
                  <Form.Check 
                    key={category.id}
                    type="checkbox"
                    id={`category-${category.id}`}
                    label={`${category.name} (${category.count || 0})`}
                    checked={filters.categories.includes(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                    className="mb-2"
                  />
                ))}
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Marques */}
        {brands.length > 0 && (
          <Accordion.Item eventKey="1">
            <Accordion.Header>Marques</Accordion.Header>
            <Accordion.Body>
              <Form>
                {brands.map(brand => (
                  <Form.Check 
                    key={brand.id}
                    type="checkbox"
                    id={`brand-${brand.id}`}
                    label={`${brand.name} (${brand.count || 0})`}
                    checked={filters.brands.includes(brand.id)}
                    onChange={(e) => handleBrandChange(brand.id, e.target.checked)}
                    className="mb-2"
                  />
                ))}
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Gamme de prix */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Prix</Accordion.Header>
          <Accordion.Body>
            <Form>
              {PRICE_RANGES.map(range => (
                <Form.Check 
                  key={range.id}
                  type="radio"
                  id={range.id}
                  name="priceRange"
                  label={range.label}
                  checked={filters.priceRange && 
                    filters.priceRange.min === range.min && 
                    filters.priceRange.max === range.max}
                  onChange={(e) => handlePriceRangeChange(
                    { min: range.min, max: range.max }, 
                    e.target.checked
                  )}
                  className="mb-2"
                />
              ))}
            </Form>
          </Accordion.Body>
        </Accordion.Item>

        {/* Couleurs */}
        {colors.length > 0 && (
          <Accordion.Item eventKey="3">
            <Accordion.Header>Couleurs</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-wrap gap-2">
                {colors.map(color => (
                  <div
                    key={color.id}
                    className={`color-swatch ${filters.colors.includes(color.id) ? 'selected' : ''}`}
                    style={{ 
                      backgroundColor: color.hex || color.name, 
                      width: '30px', 
                      height: '30px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: '1px solid #dee2e6',
                      boxShadow: filters.colors.includes(color.id) 
                        ? '0 0 0 2px #0d6efd'
                        : 'none'
                    }}
                    onClick={() => handleColorChange(
                      color.id, 
                      !filters.colors.includes(color.id)
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Tailles */}
        {sizes.length > 0 && (
          <Accordion.Item eventKey="4">
            <Accordion.Header>Tailles</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-wrap gap-2">
                {sizes.map(size => (
                  <Button
                    key={size.id}
                    variant={filters.sizes.includes(size.id) ? 'primary' : 'outline-secondary'}
                    className="size-btn"
                    onClick={() => handleSizeChange(
                      size.id, 
                      !filters.sizes.includes(size.id)
                    )}
                    style={{
                      minWidth: '40px',
                      height: '40px',
                      padding: '0.375rem'
                    }}
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <Accordion.Item eventKey="5">
            <Accordion.Header>Tags</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Button
                    key={tag.id}
                    variant={filters.tags.includes(tag.id) ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => handleTagChange(
                      tag.id, 
                      !filters.tags.includes(tag.id)
                    )}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Évaluations */}
        <Accordion.Item eventKey="6">
          <Accordion.Header>Évaluations</Accordion.Header>
          <Accordion.Body>
            <Form>
              {ratings.map(rating => (
                <Form.Check 
                  key={`rating-${rating}`}
                  type="radio"
                  id={`rating-${rating}`}
                  name="rating"
                  label={
                    <div className="d-flex align-items-center">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`icofont-star ${i < rating ? 'text-warning' : 'text-muted'}`}
                          style={{ fontSize: '0.8rem' }}
                        ></i>
                      ))}
                      <span className="ms-2">
                        {rating} {rating > 1 ? 'étoiles' : 'étoile'} et plus
                      </span>
                    </div>
                  }
                  checked={filters.rating === rating}
                  onChange={(e) => handleRatingChange(rating, e.target.checked)}
                  className="mb-2"
                />
              ))}
            </Form>
          </Accordion.Body>
        </Accordion.Item>

        {/* Disponibilité */}
        <Accordion.Item eventKey="7">
          <Accordion.Header>Disponibilité</Accordion.Header>
          <Accordion.Body>
            <Form>
              {availabilityOptions.map(option => (
                <Form.Check 
                  key={`availability-${option}`}
                  type="checkbox"
                  id={`availability-${option}`}
                  label={option}
                  checked={filters.availability.includes(option)}
                  onChange={(e) => handleAvailabilityChange(option, e.target.checked)}
                  className="mb-2"
                />
              ))}
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Bouton d'application des filtres (mobile) */}
      <div className="d-lg-none">
        <Button 
          variant="primary" 
          className="w-100 mb-3"
          onClick={applyFilters}
        >
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};

export default ProductFilterItems;