import React from "react";
import Tags from "./Tags";
import ShopCategory from "./ShopCategory";
import PopularPost from "./PopularPost";
import PropTypes from "prop-types";
import { Accordion, Button, Form, InputGroup } from "react-bootstrap";
import { AdvertisementDisplay } from "../../components/Advertisement";

// Reusable checkbox item
const CheckboxItem = ({ name, value, label, checked, onChange }) => (
    <div className="d-flex align-items-center gap-2 mb-2">
    <input
      type="checkbox"
      id={`${name}-${value}`}
      checked={checked}
      onChange={() => onChange(value)}
      className="form-check-input m-0"
    />
    <label htmlFor={`${name}-${value}`} className="form-check-label">
      {label}
    </label>
  </div>
);
CheckboxItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

// Reusable accordion section
const FilterSection = ({ title, children, defaultOpen = false }) => (
  <Accordion flush defaultActiveKey={defaultOpen ? "0" : null} className="mb-4">
    <Accordion.Item eventKey="0">
      <Accordion.Header className="filter-section-title">
        <strong>{title}</strong>
      </Accordion.Header>
      <Accordion.Body className="filter-section-body">{children}</Accordion.Body>
    </Accordion.Item>
  </Accordion>
);

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};

const FilterSidebar = ({
  menuItems,
  selectedCategory,
  selectedTag,
  handleCategoryFilter,
  handleTagFilter,
  allTags,
  FILTER_OPTIONS,
  selectedAvailability,
  handleAvailabilityFilter,
  selectedColor,
  handleColorFilter,
  selectedSize,
  handleSizeFilter,
  selectedBrand,
  handleBrandFilter,
  selectedDisplayType,
  handleDisplayTypeFilter,
  selectedDelivery,
  handleDeliveryFilter,
  selectedCampaign,
  handleCampaignFilter,
  selectedWarranty,
  handleWarrantyFilter,
  selectedWarrantyType,
  handleWarrantyTypeFilter,
  selectedCertification,
  handleCertificationFilter,
  selectedRating,
  handleRatingFilter,
  priceRange,
  initialMaxPrice,
  handlePriceChange,
  applyPriceFilter,
  resetPriceFilter,
  resetAllFilters,
  products,
}) => (
  <aside className="filter-sidebar" aria-label="Filtres produits">
    {/* Publicité dans la barre latérale */}
    <div className="mb-4">
      <AdvertisementDisplay position="shop_sidebar" type="sidebar" />
    </div>
    
    <FilterSection title="Catégories" defaultOpen={true}>
      <ShopCategory
        menuItems={menuItems}
        selectedCategory={selectedCategory}
        filterItem={handleCategoryFilter}
      />
    </FilterSection>

    <FilterSection title="Disponibilité">
      {FILTER_OPTIONS.availability.map((opt) => (
        <CheckboxItem
          key={opt.value}
          name={opt.name}
          value={opt.value}
          label={opt.label}
          checked={selectedAvailability === opt.value}
          onChange={handleAvailabilityFilter}
        />
      ))}
    </FilterSection>

    <FilterSection title="Couleurs">
      <div className="d-flex flex-wrap gap-2">
        {FILTER_OPTIONS.colorFamily.map((color) => (
          <Button
            key={color.value}
            title={color.label}
            onClick={() => handleColorFilter(color.value)}
            className={`p-0 rounded-circle border ${
              selectedColor === color.value ? "border-dark" : "border-light"
            }`}
            style={{
              width: 30,
              height: 30,
              backgroundColor: color.hex,
            }}
          />
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Tailles">
      <div className="d-flex flex-wrap gap-2">
        {FILTER_OPTIONS.sizes.map((size) => (
          <Button
            key={size.value}
            variant={
              selectedSize === size.value ? "primary" : "outline-secondary"
            }
            onClick={() => handleSizeFilter(size.value)}
            size="sm"
          >
            {size.label}
          </Button>
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Marques">
      {FILTER_OPTIONS.brands.map((opt) => (
        <CheckboxItem
          key={opt.value}
          name={opt.name}
          value={opt.value}
          label={opt.label}
          checked={selectedBrand === opt.value}
          onChange={handleBrandFilter}
        />
      ))}
    </FilterSection>

    <FilterSection title="Type d'écran">
      {FILTER_OPTIONS.displayType.map((opt) => (
        <CheckboxItem
          key={opt.value}
          name={opt.name}
          value={opt.value}
          label={opt.label}
          checked={selectedDisplayType === opt.value}
          onChange={handleDisplayTypeFilter}
        />
      ))}
    </FilterSection>

    <FilterSection title="Livraison">
      {FILTER_OPTIONS.delivery.map((opt) => (
        <CheckboxItem
          key={opt.value}
          name={opt.name}
          value={opt.value}
          label={opt.label}
          checked={selectedDelivery.includes(opt.value)}
          onChange={handleDeliveryFilter}
        />
      ))}
    </FilterSection>

    <FilterSection title="Campagnes">
      {FILTER_OPTIONS.campaign.map((opt) => (
        <CheckboxItem
          key={opt.value}
          name={opt.name}
          value={opt.value}
          label={opt.label}
          checked={selectedCampaign === opt.value}
          onChange={handleCampaignFilter}
        />
      ))}
    </FilterSection>

    <FilterSection title="Garantie">
      {FILTER_OPTIONS.warranty.map((opt) => (
        <CheckboxItem
          key={opt.value}
          name={opt.name}
          value={opt.value}
          label={opt.label}
          checked={selectedWarranty === opt.value}
          onChange={handleWarrantyFilter}
        />
      ))}
    </FilterSection>

    <FilterSection title="Type de garantie">
      {FILTER_OPTIONS.warrantyType.map((opt) => (
        <CheckboxItem
          key={opt.value}
          name={opt.name}
          value={opt.value}
          label={opt.label}
          checked={selectedWarrantyType === opt.value}
          onChange={handleWarrantyTypeFilter}
        />
      ))}
    </FilterSection>

    <FilterSection title="Certifications">
      {FILTER_OPTIONS.certification.map((opt) => (
        <CheckboxItem
          key={opt.value}
          name={opt.name}
          value={opt.value}
          label={opt.label}
          checked={selectedCertification === opt.value}
          onChange={handleCertificationFilter}
        />
      ))}
    </FilterSection>

    <FilterSection title="Évaluation">
      {[5, 4, 3, 2, 1].map((rate) => (
        <div key={rate} className="d-flex align-items-center mb-2">
          <Form.Check
            inline
            type="radio"
            id={`rating-${rate}`}
            name="rating"
            checked={selectedRating === rate}
            onChange={() => handleRatingFilter(rate)}
            className="me-2"
          />
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={i < rate ? "bi bi-star-fill" : "bi bi-star"}
              style={{ color: "#ffc107", fontSize: "1rem" }}
            />
          ))}
          <small className="ms-1">&amp; above</small>
        </div>
      ))}
    </FilterSection>

    <FilterSection title="Prix">
      <InputGroup className="mb-2">
        <Form.Control
          placeholder="Min"
          value={priceRange.min}
          onChange={(e) =>
            handlePriceChange(Number(e.target.value), priceRange.max)
          }
        />
        <Form.Control
          placeholder="Max"
          value={priceRange.max}
          onChange={(e) =>
            handlePriceChange(priceRange.min, Number(e.target.value))
          }
        />
        <Button onClick={applyPriceFilter}>Go</Button>
      </InputGroup>
    </FilterSection>

    <FilterSection title="Tags">
      <Tags
        tags={allTags}
        selectedTag={selectedTag}
        onTagClick={handleTagFilter}
      />
    </FilterSection>

    <FilterSection title="Populaires">
      <PopularPost products={products} />
    </FilterSection>

    <Button
      variant="danger"
      className="w-100 mt-3"
      size="sm"
      onClick={resetAllFilters}
    >
      <i className="icofont-close-circled me-2"></i> Réinitialiser tous les
      filtres
    </Button>
    {/* Le style global DOIT être dans le return JSX, juste avant </aside> */}
    <style jsx global>{`
    .filter-section-title {
      border-bottom: 2px solid #b6d4fe !important;
      background: #e3f0ff !important;
      padding-top: 16px !important;
      padding-bottom: 14px !important;
      padding-left: 18px !important;
      font-size: 1.13em;
    }
    .filter-section-body {
      background: #f6faff;
      padding: 22px 20px 16px 20px;
      margin-bottom: 8px;
      border-radius: 0 0 10px 10px;
    }
    .filter-section-body .form-check {
      margin-bottom: 18px !important;
      padding-top: 4px;
      padding-bottom: 4px;
    }
    .filter-section-body .form-check:last-child {
      margin-bottom: 0 !important;
    }
    .filter-section-body .btn,
    .filter-section-body .btn-outline-secondary {
      margin-bottom: 10px;
    }
    .filter-section-body .btn:last-child {
      margin-bottom: 0;
    }
  `}</style>
</aside>
);

FilterSidebar.propTypes = {
  menuItems: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string,
  selectedTag: PropTypes.string,
  handleCategoryFilter: PropTypes.func.isRequired,
  handleTagFilter: PropTypes.func.isRequired,
  allTags: PropTypes.array.isRequired,
  FILTER_OPTIONS: PropTypes.shape({
    availability: PropTypes.array,
    colorFamily: PropTypes.array,
    brands: PropTypes.array,
    displayType: PropTypes.array,
    delivery: PropTypes.array,
    campaign: PropTypes.array,
    warranty: PropTypes.array,
    warrantyType: PropTypes.array,
    certification: PropTypes.array,
    sizes: PropTypes.array,
  }).isRequired,
  selectedAvailability: PropTypes.string,
  handleAvailabilityFilter: PropTypes.func.isRequired,
  selectedColor: PropTypes.string,
  handleColorFilter: PropTypes.func.isRequired,
  selectedSize: PropTypes.string,
  handleSizeFilter: PropTypes.func.isRequired,
  selectedBrand: PropTypes.string,
  handleBrandFilter: PropTypes.func.isRequired,
  selectedDisplayType: PropTypes.string,
  handleDisplayTypeFilter: PropTypes.func.isRequired,
  selectedDelivery: PropTypes.arrayOf(PropTypes.string),
  handleDeliveryFilter: PropTypes.func.isRequired,
  selectedCampaign: PropTypes.string,
  handleCampaignFilter: PropTypes.func.isRequired,
  selectedWarranty: PropTypes.string,
  handleWarrantyFilter: PropTypes.func.isRequired,
  selectedWarrantyType: PropTypes.string,
  handleWarrantyTypeFilter: PropTypes.func.isRequired,
  selectedCertification: PropTypes.string,
  handleCertificationFilter: PropTypes.func.isRequired,
  selectedRating: PropTypes.number,
  handleRatingFilter: PropTypes.func.isRequired,
  priceRange: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number })
    .isRequired,
  initialMaxPrice: PropTypes.number.isRequired,
  handlePriceChange: PropTypes.func.isRequired,
  applyPriceFilter: PropTypes.func.isRequired,
};
export default FilterSidebar;
