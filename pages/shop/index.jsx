import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import {
  Container,
  Button,
  Form,
  Accordion,
} from "react-bootstrap";
// Importation des composants wrappers au lieu des composants originaux
import Offcanvas from "../../components/wrappers/Offcanvas";
import { useRouter } from "next/router";
import Link from "next/link";
// Import du composant publicitaire
import { AdvertisementDisplay } from "../../components/Advertisement";

// Importation de l'utilitaire API avec getCategoriesWithFallback et fetchApi
import { getCategoriesWithFallback, fetchApi } from "../../utils/api";

// Composants
import Search from "../../components/shop/Search";
import Pagination from "../../components/shop/Pagination";
import ShopCategory from "../../components/shop/ShopCategory";
import PopularPost from "../../components/shop/PopularPost";
import Tags from "../../components/shop/Tags";
import ProductCards from "../../components/shop/ProductCards";
import FilterSidebar from "../../components/shop/FilterSidebar";

// Données
import Data from "../../products.json";

console.log("🧪 ProductCards:", ProductCards);
console.log("🧪 FilterSidebar:", FilterSidebar);
console.log("🧪 PageHeader:", PageHeader);

// --- Mini NavBar Shop ---
const ShopMiniNav = () => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Fonction pour gérer le changement de catégorie (version simplifiée)
  const handleCategoryChange = (categoryValue) => {
    console.log(`Catégorie sélectionnée: ${categoryValue}`);
    setShowCategoryDropdown(false);
  };
  
  return (
    <nav
      className="shop-mini-nav w-100 border-bottom"
      style={{
        fontSize: "0.96em",
        background: "linear-gradient(90deg, #f8fafc 0%, #e9ecef 100%)",
        boxShadow: "0 2px 8px 0 rgba(80,80,120,0.07)",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        zIndex: 10,
        position: "relative",
      }}
    >
      <div
        className="container-fluid px-4 d-flex align-items-center justify-content-between"
        style={{ minHeight: 26 }}
      >
        <div className="custom-dropdown position-relative">
          <button 
            className="d-flex align-items-center px-2 py-1 rounded-3 border-0 bg-transparent" 
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            style={{
              cursor: "pointer",
              transition: "box-shadow 0.18s, background 0.18s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#e3e6f1";
              e.currentTarget.style.boxShadow = "0 2px 6px 0 rgba(80,80,120,0.08)";
            }}
            onMouseOut={(e) => {
              if (!showCategoryDropdown) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            <i
              className="icofont-navigation-menu me-2 text-primary"
              style={{ fontSize: "1.15em" }}
            ></i>
            <span className="fw-semibold text-primary">Catégorie</span>
            <i className="icofont-simple-down ms-2 small"></i>
          </button>
          {showCategoryDropdown && (
            <ul 
              className="position-absolute bg-white rounded shadow py-1 mt-1" 
              style={{ 
                minWidth: "200px", 
                zIndex: 1000, 
                listStyle: "none", 
                padding: 0,
                left: 0,
                border: "1px solid #dee2e6" 
              }}
            >
              <li>
                <a 
                  className="d-block px-3 py-2 text-decoration-none" 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("all");
                    setShowCategoryDropdown(false);
                  }}
                  style={{ color: "#212529" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Tous les produits
                </a>
              </li>
              <li>
                <a 
                  className="d-block px-3 py-2 text-decoration-none" 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("clothing");
                    setShowCategoryDropdown(false);
                  }}
                  style={{ color: "#212529" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Vêtements
                </a>
              </li>
              <li>
                <a 
                  className="d-block px-3 py-2 text-decoration-none" 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("electronics");
                    setShowCategoryDropdown(false);
                  }}
                  style={{ color: "#212529" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Électronique
                </a>
              </li>
              <li>
                <a 
                  className="d-block px-3 py-2 text-decoration-none" 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("shoes");
                    setShowCategoryDropdown(false);
                  }}
                  style={{ color: "#212529" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Chaussures
                </a>
              </li>
              <li>
                <a 
                  className="d-block px-3 py-2 text-decoration-none" 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("accessories");
                    setShowCategoryDropdown(false);
                  }}
                  style={{ color: "#212529" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Accessoires
                </a>
              </li>
              <li><div className="dropdown-divider my-1" style={{ borderTop: "1px solid #e9ecef" }}></div></li>
              <li>
                <a 
                  className="d-block px-3 py-2 text-decoration-none" 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange("promotions");
                    setShowCategoryDropdown(false);
                  }}
                  style={{ color: "#212529" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Promotions
                </a>
              </li>
            </ul>
          )}
        </div>
        <div className="d-none d-md-flex align-items-center" style={{ gap: 0 }}>
          {/* BARRE DE RECHERCHE NAVBAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.elements["shopnav-search"].value;
              if (query.trim()) alert("Recherche : " + query);
            }}
            style={{ marginRight: 24, display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              name="shopnav-search"
              placeholder="Rechercher..."
              style={{
                border: "1px solid #ced4da",
                borderRadius: 20,
                padding: "3px 12px 3px 32px",
                fontSize: "0.95em",
                height: 28,
                background: "#fff",
                outline: "none",
                boxShadow: "none",
                marginRight: 6,
                minWidth: 140,
              }}
            />
            <button
              type="submit"
              style={{
                border: "none",
                background: "transparent",
                marginLeft: -32,
                color: "#0d6efd",
                cursor: "pointer",
                fontSize: 18,
                padding: 0,
              }}
              aria-label="Rechercher"
            >
              <i className="icofont-search"></i>
            </button>
          </form>
          {[
            { href: "/", label: "Accueil" },
            { href: "/favorite-shops", label: "Mes Boutiques Préférées" },
            { href: "/products", label: "Produits" },
            { href: "/wishlist", label: "Liste de souhaits" },
            { href: "/shipping-info", label: "Infos de livraison" },
            { href: "/become-seller", label: "Devenir vendeur" },
            { href: "/order-tracking", label: "Suivi de commande" },
            { href: "/checkout", label: "Paiement" },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.label}>
              <Link
                href={item.href}
                className="px-3 nav-link-mini"
                style={{
                  color: "#2a3c5c",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color 0.18s, border 0.18s",
                  borderRight:
                    idx < arr.length - 1 ? "1px solid #e1e4ea" : "none",
                  borderRadius: 0,
                  paddingTop: 7,
                  paddingBottom: 7,
                  position: "relative",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#0d6efd";
                  e.currentTarget.style.textDecoration = "underline";
                  e.currentTarget.style.background = "rgba(13,110,253,0.06)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#2a3c5c";
                  e.currentTarget.style.textDecoration = "none";
                  e.currentTarget.style.background = "transparent";
                }}
                legacyBehavior>
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Options de filtrage inspirées du thème Phoenix
const FILTER_OPTIONS = {
  availability: [
    { name: "availability", label: "In stock", value: "in_stock" },
    { name: "availability", label: "Pre-book", value: "pre_book" },
    { name: "availability", label: "Out of stock", value: "out_of_stock" },
  ],
  colorFamily: [
    { name: "color", label: "Black", value: "black", hex: "#000000" },
    { name: "color", label: "White", value: "white", hex: "#FFFFFF" },
    { name: "color", label: "Blue", value: "blue", hex: "#0000FF" },
    { name: "color", label: "Red", value: "red", hex: "#FF0000" },
    { name: "color", label: "Green", value: "green", hex: "#008000" },
    { name: "color", label: "Yellow", value: "yellow", hex: "#FFFF00" },
    { name: "color", label: "Gray", value: "gray", hex: "#808080" },
    { name: "color", label: "Purple", value: "purple", hex: "#800080" },
  ],
  brands: [
    { name: "brands", label: "Blackberry", value: "blackberry" },
    { name: "brands", label: "Apple", value: "apple" },
    { name: "brands", label: "Nokia", value: "nokia" },
    { name: "brands", label: "Sony", value: "sony" },
    { name: "brands", label: "LG", value: "lg" },
    { name: "brands", label: "Addidas", value: "addidas" },
  ],
  displayType: [
    { name: "displayType", label: "LCD", value: "lcd" },
    { name: "displayType", label: "IPS", value: "ips" },
    { name: "displayType", label: "OLED", value: "oled" },
    { name: "displayType", label: "AMOLED", value: "amoled" },
    { name: "displayType", label: "Retina", value: "retina" },
  ],
  delivery: [
    { name: "delivery", label: "Free Shipping", value: "free_shipping" },
    { name: "delivery", label: "One-day Shipping", value: "one-day_shipping" },
    { name: "delivery", label: "Cash on Delivery", value: "cash_on_delivery" },
  ],
  campaign: [
    { name: "campaign", label: "Summer Sale", value: "summer_sale" },
    { name: "campaign", label: "March Madness", value: "march_madness" },
    { name: "campaign", label: "Flash Sale", value: "flash_sale" },
    { name: "campaign", label: "BOGO Blast", value: "bogo_blast" },
  ],
  warranty: [
    { name: "warranty", label: "3 months", value: "3_months" },
    { name: "warranty", label: "6 months", value: "6_months" },
    { name: "warranty", label: "1 year", value: "1_year" },
    { name: "warranty", label: "2 years", value: "2_years" },
    { name: "warranty", label: "3 years", value: "3_years" },
    { name: "warranty", label: "5 years", value: "5_years" },
  ],
  warrantyType: [
    { name: "warrantyType", label: "Replacement", value: "replacement" },
    { name: "warrantyType", label: "Service", value: "service" },
    {
      name: "warrantyType",
      label: "Partial Coverage",
      value: "partial_coverage",
    },
    { name: "warrantyType", label: "Apple Care", value: "apple_care" },
    { name: "warrantyType", label: "Money back", value: "money_back" },
    { name: "warrantyType", label: "Extendable", value: "extendable" },
  ],
  certification: [
    { name: "certification", label: "RoHS", value: "rohs" },
    { name: "certification", label: "FCC", value: "fcc" },
    { name: "certification", label: "Conflict Free", value: "conflict_free" },
    { name: "certification", label: "ISO 9001:2015", value: "iso_9001:2015" },
    { name: "certification", label: "ISO 27001:2013", value: "iso_27001:2013" },
    { name: "certification", label: "IEC 61000-4-2", value: "iec_61000-4-2" },
  ],
  sizes: [
    { name: "size", label: "XS", value: "xs" },
    { name: "size", label: "S", value: "s" },
    { name: "size", label: "M", value: "m" },
    { name: "size", label: "L", value: "l" },
    { name: "size", label: "XL", value: "xl" },
    { name: "size", label: "XXL", value: "xxl" },
    { name: "size", label: "36", value: "36" },
    { name: "size", label: "37", value: "37" },
    { name: "size", label: "38", value: "38" },
    { name: "size", label: "39", value: "39" },
    { name: "size", label: "40", value: "40" },
    { name: "size", label: "41", value: "41" },
    { name: "size", label: "42", value: "42" },
    { name: "size", label: "43", value: "43" },
    { name: "size", label: "44", value: "44" },
    { name: "size", label: "45", value: "45" },
  ],
};

// Enrichir les données produits avec des attributs supplémentaires pour les filtres
// Cette partie serait remplacée par vos vraies données venant de l'API
const enrichedData = Data.map((product) => {
  // Déterminer si le produit est un vêtement ou une chaussure basé sur sa catégorie
  const isClothing = ["Men's Sneaker", "Men's Pants", "Men's Boot"].includes(
    product.category
  );
  const isShoe = ["Men's Boot", "Men's Sneaker"].includes(product.category);

  // Générer des tailles pour ce produit
  let sizes = [];
  if (isClothing) {
    // Pour les vêtements
    sizes = ["s", "m", "l", "xl"].filter(() => Math.random() > 0.3);
  } else if (isShoe) {
    // Pour les chaussures
    const shoeSizes = ["39", "40", "41", "42", "43", "44"];
    sizes = shoeSizes.filter(() => Math.random() > 0.4);
  }

  // Générer des couleurs
  const nameLower = product.name.toLowerCase();
  let colors = [];

  if (nameLower.includes("black")) colors.push("black");
  if (nameLower.includes("white")) colors.push("white");
  if (nameLower.includes("red")) colors.push("red");
  if (nameLower.includes("blue")) colors.push("blue");
  if (nameLower.includes("green")) colors.push("green");
  if (nameLower.includes("yellow")) colors.push("yellow");
  if (nameLower.includes("grey") || nameLower.includes("gray"))
    colors.push("gray");
  if (nameLower.includes("purple")) colors.push("purple");

  // Si aucune couleur trouvée, en assigner aléatoirement
  if (colors.length === 0) {
    const randomColors = FILTER_OPTIONS.colorFamily
      .filter(() => Math.random() > 0.7)
      .map((c) => c.value);
    colors = randomColors.length > 0 ? randomColors : ["black"];
  }

  // Déterminer la disponibilité
  const availability =
    product.stock > 0
      ? "in_stock"
      : Math.random() > 0.5
      ? "pre_book"
      : "out_of_stock";

  // Assigner une marque si ce n'est pas déjà défini
  const brand =
    product.seller ||
    FILTER_OPTIONS.brands[
      Math.floor(Math.random() * FILTER_OPTIONS.brands.length)
    ].value;

  // Assigner un type d'affichage pour les produits électroniques
  const displayType = ["Cap", "Bag", "Bottle"].includes(product.category)
    ? null
    : FILTER_OPTIONS.displayType[
        Math.floor(Math.random() * FILTER_OPTIONS.displayType.length)
      ].value;

  // Livraison
  const delivery = [];
  if (product.shipping < 10) delivery.push("free_shipping");
  if (product.shipping > 30) delivery.push("one-day_shipping");
  if (Math.random() > 0.7) delivery.push("cash_on_delivery");

  // Campagne
  const campaign =
    Math.random() > 0.7
      ? [
          FILTER_OPTIONS.campaign[
            Math.floor(Math.random() * FILTER_OPTIONS.campaign.length)
          ].value,
        ]
      : [];

  // Garantie
  const warranty =
    product.price > 100
      ? FILTER_OPTIONS.warranty[
          Math.floor(Math.random() * FILTER_OPTIONS.warranty.length)
        ].value
      : null;

  // Type de garantie
  const warrantyType = warranty
    ? [
        FILTER_OPTIONS.warrantyType[
          Math.floor(Math.random() * FILTER_OPTIONS.warrantyType.length)
        ].value,
      ]
    : [];

  // Certification
  const certification =
    Math.random() > 0.8
      ? [
          FILTER_OPTIONS.certification[
            Math.floor(Math.random() * FILTER_OPTIONS.certification.length)
          ].value,
        ]
      : [];

  return {
    ...product,
    colors,
    sizes,
    availability,
    brand,
    displayType,
    delivery,
    campaign,
    warranty,
    warrantyType,
    certification,
  };
});

const initialProductsData = Array.isArray(enrichedData) ? enrichedData : [];

// --- CONSTANTES ---
const PRODUCTS_PER_PAGE = 12; // <<< DÉCLARATION ICI (en dehors du composant)

function ShopPage(props) {
  // ...états et hooks

  const router = useRouter();
  const {
    category,
    tag,
    search,
    page,
    sort,
    minp,
    maxp,
    color,
    size,
    availability,
    brand,
    displayType,
    delivery,
    campaign,
    warranty,
    warrantyType,
    certification,
    rating,
  } = router.query;

  // --- ÉTATS ---
  const [products, _setProducts] = useState(initialProductsData); // eslint-disable-line no-unused-vars
  const [filteredProducts, setFilteredProducts] = useState(initialProductsData);
  const [isLoading, _setIsLoading] = useState(false); // eslint-disable-line no-unused-vars
  const [error, setError] = useState(null);
  const [GridList, setGridList] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || "All");
  const [selectedTag, setSelectedTag] = useState(tag || null);
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [sortOption, setSortOption] = useState(sort || "default");

  // Nouveaux états pour tous les filtres
  const [selectedColor, setSelectedColor] = useState(color || null);
  const [selectedSize, setSelectedSize] = useState(size || null);
  const [selectedAvailability, setSelectedAvailability] = useState(
    availability || null
  );
  const [selectedBrand, setSelectedBrand] = useState(brand || null);
  const [selectedDisplayType, setSelectedDisplayType] = useState(
    displayType || null
  );
  const [selectedDelivery, setSelectedDelivery] = useState(
    delivery ? delivery.split(",") : []
  );
  const [selectedCampaign, setSelectedCampaign] = useState(campaign || null);
  const [selectedWarranty, setSelectedWarranty] = useState(warranty || null);
  const [selectedWarrantyType, setSelectedWarrantyType] = useState(
    warrantyType || null
  );
  const [selectedCertification, setSelectedCertification] = useState(
    certification || null
  );
  const [selectedRating, setSelectedRating] = useState(
    rating ? parseInt(rating, 10) : null
  );

  // État pour l'offcanvas sur mobile
  
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // Utiliser notre nouvelle fonction pour récupérer les catégories
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      // Utiliser la fonction de notre utilitaire qui gère les erreurs et les fallbacks
      const categoriesData = await getCategoriesWithFallback();
      setCategories(categoriesData);
      setIsLoadingCategories(false);
    };
    
    loadCategories();
  }, []);

  const initialMaxPrice = useMemo(() => {
    if (!products || products.length === 0) return 1000;
    const max = products.reduce((max, p) => Math.max(max, p.price || 0), 0);
    return Math.ceil(max / 100) * 100 || 1000;
  }, [products]);

  const [priceRange, setPriceRange] = useState({
    min: parseInt(minp || "0", 10),
    max: parseInt(maxp || initialMaxPrice.toString(), 10) || initialMaxPrice,
  });

  const [currentPage, setCurrentPage] = useState(parseInt(page || "1", 10));

  // --- EFFETS ---
  useEffect(() => {
    setSelectedCategory(category || "All");
    setSelectedTag(tag || null);
    setSearchTerm(search || "");
    setCurrentPage(parseInt(page || "1", 10));
    setSortOption(sort || "default");
    setSelectedColor(color || null);
    setSelectedSize(size || null);
    setSelectedAvailability(availability || null);
    setSelectedBrand(brand || null);
    setSelectedDisplayType(displayType || null);
    setSelectedDelivery(delivery ? delivery.split(",") : []);
    setSelectedCampaign(campaign || null);
    setSelectedWarranty(warranty || null);
    setSelectedWarrantyType(warrantyType || null);
    setSelectedCertification(certification || null);
    setSelectedRating(rating ? parseInt(rating, 10) : null);
    setPriceRange({
      min: parseInt(minp || "0", 10),
      max: parseInt(maxp || initialMaxPrice.toString(), 10) || initialMaxPrice,
    });
  }, [
    category,
    tag,
    search,
    page,
    sort,
    minp,
    maxp,
    color,
    size,
    availability,
    brand,
    displayType,
    delivery,
    campaign,
    warranty,
    warrantyType,
    certification,
    rating,
    initialMaxPrice,
  ]);

  useEffect(() => {
    setError(null);
    try {
      let result = [...products];

      // Filtrage par catégorie
      if (selectedCategory && selectedCategory !== "All") {
        result = result.filter((p) => p.category === selectedCategory);
      }

      // Filtrage par tag
      if (selectedTag) {
        result = result.filter((p) => p.tags && p.tags.includes(selectedTag));
      }

      // Filtrage par couleur
      if (selectedColor) {
        result = result.filter(
          (p) => p.colors && p.colors.includes(selectedColor)
        );
      }

      // Filtrage par taille
      if (selectedSize) {
        result = result.filter(
          (p) => p.sizes && p.sizes.includes(selectedSize)
        );
      }

      // Filtrage par disponibilité
      if (selectedAvailability) {
        result = result.filter((p) => p.availability === selectedAvailability);
      }

      // Filtrage par marque
      if (selectedBrand) {
        result = result.filter(
          (p) => p.brand === selectedBrand || p.seller === selectedBrand
        );
      }

      // Filtrage par type d'affichage
      if (selectedDisplayType) {
        result = result.filter((p) => p.displayType === selectedDisplayType);
      }

      // Filtrage par livraison
      if (selectedDelivery && selectedDelivery.length > 0) {
        result = result.filter(
          (p) =>
            p.delivery &&
            selectedDelivery.every((option) => p.delivery.includes(option))
        );
      }

      // Filtrage par campagne
      if (selectedCampaign) {
        result = result.filter(
          (p) => p.campaign && p.campaign.includes(selectedCampaign)
        );
      }

      // Filtrage par garantie
      if (selectedWarranty) {
        result = result.filter((p) => p.warranty === selectedWarranty);
      }

      // Filtrage par type de garantie
      if (selectedWarrantyType) {
        result = result.filter(
          (p) => p.warrantyType && p.warrantyType.includes(selectedWarrantyType)
        );
      }

      // Filtrage par certification
      if (selectedCertification) {
        result = result.filter(
          (p) =>
            p.certification && p.certification.includes(selectedCertification)
        );
      }

      // Filtrage par évaluation
      if (selectedRating) {
        result = result.filter(
          (p) => Math.round(p.ratings || 0) >= selectedRating
        );
      }

      // Recherche textuelle
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerSearch) ||
            (p.description &&
              p.description.toLowerCase().includes(lowerSearch)) ||
            (p.category && p.category.toLowerCase().includes(lowerSearch)) ||
            (p.tags &&
              p.tags.some((t) => t.toLowerCase().includes(lowerSearch)))
        );
      }

      // Filtrage par prix
      const minPrice = Number(priceRange.min) || 0;
      const maxPrice = Number(priceRange.max) || initialMaxPrice;
      result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

      // Tri des résultats
      const sortByPrice = (a, b) =>
        (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      switch (sortOption) {
        case "price-asc":
          result.sort(sortByPrice);
          break;
        case "price-desc":
          result.sort((a, b) => sortByPrice(b, a));
          break;
        case "popularity":
          result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          break;
        case "rating":
          result.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
          break;
        case "newest":
          if (
            result.length > 0 &&
            result[0].createdAt &&
            !isNaN(new Date(result[0].createdAt).getTime())
          ) {
            result.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - 
                new Date(a.createdAt).getTime()
            );
          } else {
            /* Pas de tri fallback si default le gère */
          }
          break;
        case "default":
        default:
          /* Pas de tri additionnel */ break;
      }
      setFilteredProducts(result);
    } catch (e) {
      console.error("Erreur filtre/tri:", e);
      setError("Erreur filtre/tri.");
      setFilteredProducts([]);
    }
  }, [
    products,
    selectedCategory,
    selectedTag,
    searchTerm,
    priceRange,
    sortOption,
    selectedColor,
    selectedSize,
    selectedAvailability,
    selectedBrand,
    selectedDisplayType,
    selectedDelivery,
    selectedCampaign,
    selectedWarranty,
    selectedWarrantyType,
    selectedCertification,
    selectedRating,
    initialMaxPrice,
  ]);

  // --- DONNÉES DÉRIVÉES ---
  const allTags = useMemo(
    () => {
      // eslint-disable-next-line no-undef
      return Array.from(new Set(products.flatMap((p) => p.tags || []))).filter(Boolean);
    },
    [products]
  );

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = useMemo(
    () => filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct),
    [filteredProducts, indexOfFirstProduct, indexOfLastProduct]
  );

  const showResultText = useMemo(() => {
    if (isLoading) return "Chargement...";
    if (error) return "Erreur";
    const start = filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0;
    const end = Math.min(indexOfLastProduct, filteredProducts.length);
    return `Affichage de ${start} - ${end} sur ${filteredProducts.length} résultats`;
  }, [
    filteredProducts,
    indexOfFirstProduct,
    indexOfLastProduct,
    isLoading,
    error,
  ]);

  // --- HANDLERS ---
  const buildNextQuery = (updates) => {
    const currentQuery = { ...router.query };
    const nextQuery = { ...currentQuery, ...updates };

    // Nettoyer les valeurs vides ou par défaut
    if (nextQuery.category === "All" || !nextQuery.category)
      delete nextQuery.category;
    if (!nextQuery.tag) delete nextQuery.tag;
    if (!nextQuery.search) delete nextQuery.search;
    if (!nextQuery.color) delete nextQuery.color;
    if (!nextQuery.size) delete nextQuery.size;
    if (!nextQuery.availability) delete nextQuery.availability;
    if (!nextQuery.brand) delete nextQuery.brand;
    if (!nextQuery.displayType) delete nextQuery.displayType;
    if (!nextQuery.delivery || nextQuery.delivery.length === 0)
      delete nextQuery.delivery;
    if (!nextQuery.campaign) delete nextQuery.campaign;
    if (!nextQuery.warranty) delete nextQuery.warranty;
    if (!nextQuery.warrantyType) delete nextQuery.warrantyType;
    if (!nextQuery.certification) delete nextQuery.certification;
    if (!nextQuery.rating) delete nextQuery.rating;
    if (nextQuery.sort === "default" || !nextQuery.sort) delete nextQuery.sort;
    if (parseInt(nextQuery.page || "1", 10) === 1) delete nextQuery.page;
    if (parseInt(nextQuery.minp || "0", 10) === 0) delete nextQuery.minp;
    if (
      parseInt(nextQuery.maxp || initialMaxPrice.toString(), 10) ===
      initialMaxPrice
    )
      delete nextQuery.maxp;

    // Réinitialiser la pagination si un filtre change
    if (Object.keys(updates).some((key) => key !== "page")) {
      delete nextQuery.page;
    }

    return nextQuery;
  };

  const updateQuery = (newQuery) =>
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
      scroll: false,
    });

  const handleCategoryFilter = (category) => {
    updateQuery(buildNextQuery({ category: category }));
    setShowFilters(false);
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery(buildNextQuery({ search: searchTerm || undefined }));
    setShowFilters(false);
  };

  const handleTagFilter = (tag) => {
    const newTag = tag === selectedTag ? null : tag;
    updateQuery(buildNextQuery({ tag: newTag }));
    setShowFilters(false);
  };

  const handleColorFilter = (colorId) => {
    const newColor = colorId === selectedColor ? null : colorId;
    updateQuery(buildNextQuery({ color: newColor }));
    setShowFilters(false);
  };

  const handleSizeFilter = (sizeId) => {
    const newSize = sizeId === selectedSize ? null : sizeId;
    updateQuery(buildNextQuery({ size: newSize }));
    setShowFilters(false);
  };

  const handleAvailabilityFilter = (value) => {
    const newAvailability = value === selectedAvailability ? null : value;
    updateQuery(buildNextQuery({ availability: newAvailability }));
    setShowFilters(false);
  };

  const handleBrandFilter = (value) => {
    const newBrand = value === selectedBrand ? null : value;
    updateQuery(buildNextQuery({ brand: newBrand }));
    setShowFilters(false);
  };

  const handleDisplayTypeFilter = (value) => {
    const newDisplayType = value === selectedDisplayType ? null : value;
    updateQuery(buildNextQuery({ displayType: newDisplayType }));
    setShowFilters(false);
  };

  const handleDeliveryFilter = (value) => {
    let newDelivery = [...selectedDelivery];
    if (newDelivery.includes(value)) {
      newDelivery = newDelivery.filter((item) => item !== value);
    } else {
      newDelivery.push(value);
    }
    updateQuery(buildNextQuery({ delivery: newDelivery.join(",") }));
    setShowFilters(false);
  };

  const handleCampaignFilter = (value) => {
    const newCampaign = value === selectedCampaign ? null : value;
    updateQuery(buildNextQuery({ campaign: newCampaign }));
    setShowFilters(false);
  };

  const handleWarrantyFilter = (value) => {
    const newWarranty = value === selectedWarranty ? null : value;
    updateQuery(buildNextQuery({ warranty: newWarranty }));
    setShowFilters(false);
  };

  const handleWarrantyTypeFilter = (value) => {
    const newWarrantyType = value === selectedWarrantyType ? null : value;
    updateQuery(buildNextQuery({ warrantyType: newWarrantyType }));
    setShowFilters(false);
  };

  const handleCertificationFilter = (value) => {
    const newCertification = value === selectedCertification ? null : value;
    updateQuery(buildNextQuery({ certification: newCertification }));
    setShowFilters(false);
  };

  const handleRatingFilter = (value) => {
    const newRating = value === selectedRating ? null : value;
    updateQuery(buildNextQuery({ rating: newRating }));
    setShowFilters(false);
  };

  const handlePriceChange = (min, max) => {
    const vMin = Math.max(0, Math.min(min, max));
    const vMax = Math.max(vMin, max);
    setPriceRange({ min: vMin, max: vMax });
  };

  const applyPriceFilter = () => {
    updateQuery(buildNextQuery({ minp: priceRange.min, maxp: priceRange.max }));
    setShowFilters(false);
  };

  const resetPriceFilter = () => {
    setPriceRange({ min: 0, max: initialMaxPrice });
    updateQuery(buildNextQuery({ minp: undefined, maxp: undefined }));
  };

  const handleSortChange = (e) =>
    updateQuery(buildNextQuery({ sort: e.target.value }));

  const handlePaginate = (pageNumber) => {
    updateQuery(buildNextQuery({ page: pageNumber }));
    window.scrollTo(0, 0);
  };

  // Fonction de réinitialisation des filtres
  const resetAllFilters = () => {
    updateQuery({});
    setShowFilters(false);
  };

  // Rendu d'un élément checkbox pour les filtres
  const CheckboxItem = ({
    name,
    value,
    label,
    checked,
    onChange,
    type = "checkbox",
  }) => (
    <Form.Check
      type={type}
      className="mb-2"
      id={`${name}-${value}`}
      name={name}
      value={value}
      label={label}
      checked={checked}
      onChange={() => onChange(value)}
    />
  );

  // Rendu d'un élément de filtre avec titre et contenu
  const FilterSection = ({ title, children, defaultOpen = false }) => (
    <div className="widget my-4">
      <Accordion defaultActiveKey={defaultOpen ? "0" : null}>
        <Accordion.Item eventKey="0" className="border-0">
          <Accordion.Header className="py-2 px-0 bg-transparent">
            <h4 className="widget-title m-0">{title}</h4>
          </Accordion.Header>
          <Accordion.Body className="pt-0 pb-2 px-0">{children}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );

  // Composant pour afficher les étoiles de notation
  const StarRating = ({ value, readonly = true, onChange = () => {} }) => {
    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => !readonly && onChange(star)}
            style={{
              cursor: readonly ? "default" : "pointer",
              color: star <= value ? "#ffc107" : "#e4e5e9",
            }}
            className="fs-5 me-1"
          >
            ★
          </span>
        ))}
        {value < 5 && <span className="ms-1 small">&amp; above</span>}
      </div>
    );
  };

  // Composant pour les filtres (utilisé à la fois dans l'offcanvas et la sidebar)
  const FilterComponents = () => ( // eslint-disable-line no-unused-vars
    (<>
      <Search
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <FilterSection title="Catégories" defaultOpen={true}>
        <ShopCategory
          filterItem={handleCategoryFilter}
          menuItems={categories}
          selectedCategory={selectedCategory}
        />
      </FilterSection>
      <FilterSection title="Disponibilité">
        {FILTER_OPTIONS.availability.map((item) => (
          <CheckboxItem
            key={item.value}
            name={item.name}
            value={item.value}
            label={item.label}
            checked={selectedAvailability === item.value}
            onChange={handleAvailabilityFilter}
          />
        ))}
      </FilterSection>
      <FilterSection title="Couleurs">
        <div className="widget-color d-flex flex-wrap gap-2 mt-3">
          {FILTER_OPTIONS.colorFamily.map((color) => (
            <Button
              key={color.value}
              className={`color-selector p-0 border ${
                selectedColor === color.value ? "selected" : ""
              }`}
              style={{
                backgroundColor: color.hex,
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border:
                  selectedColor === color.value
                    ? "2px solid #000"
                    : "1px solid #ddd",
                boxShadow:
                  selectedColor === color.value
                    ? "0 0 0 2px #fff inset"
                    : "none",
                cursor: "pointer",
              }}
              onClick={() => handleColorFilter(color.value)}
              title={color.label}
              aria-label={`Couleur ${color.label}`}
            />
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Marques">
        {FILTER_OPTIONS.brands.map((item) => (
          <CheckboxItem
            key={item.value}
            name={item.name}
            value={item.value}
            label={item.label}
            checked={selectedBrand === item.value}
            onChange={handleBrandFilter}
          />
        ))}
      </FilterSection>
      <FilterSection title="Fourchette de prix">
        <div className="d-flex flex-column gap-2">
          <div className="mb-2 text-center fw-bold">
            {priceRange.min}€ - {priceRange.max}€
          </div>
          <Form.Label htmlFor="sidebarMinPriceRange" className="small">
            Min: {priceRange.min}€
          </Form.Label>
          <Form.Range
            id="sidebarMinPriceRange"
            min={0}
            max={initialMaxPrice}
            step={10}
            value={priceRange.min}
            onChange={(e) =>
              handlePriceChange(parseInt(e.target.value, 10), priceRange.max)
            }
            className="mb-2"
          />
          <Form.Label htmlFor="sidebarMaxPriceRange" className="small">
            Max: {priceRange.max}€
          </Form.Label>
          <Form.Range
            id="sidebarMaxPriceRange"
            min={0}
            max={initialMaxPrice}
            step={10}
            value={priceRange.max}
            onChange={(e) =>
              handlePriceChange(priceRange.min, parseInt(e.target.value, 10))
            }
            className="mb-2"
          />
          <div className="d-flex gap-2 mt-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-grow-1"
              onClick={applyPriceFilter}
            >
              Appliquer
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="flex-grow-1"
              onClick={resetPriceFilter}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </FilterSection>
      <FilterSection title="Évaluation">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="mb-2">
            <CheckboxItem
              type="radio"
              name="rating"
              value={rating}
              label={<StarRating value={rating} />}
              checked={selectedRating === rating}
              onChange={handleRatingFilter}
            />
          </div>
        ))}
      </FilterSection>
      <FilterSection title="Type d'affichage">
        {FILTER_OPTIONS.displayType.map((item) => (
          <CheckboxItem
            key={item.value}
            name={item.name}
            value={item.value}
            label={item.label}
            checked={selectedDisplayType === item.value}
            onChange={handleDisplayTypeFilter}
          />
        ))}
      </FilterSection>
      <FilterSection title="Livraison">
        {FILTER_OPTIONS.delivery.map((item) => (
          <CheckboxItem
            key={item.value}
            name={item.name}
            value={item.value}
            label={item.label}
            checked={selectedDelivery.includes(item.value)}
            onChange={handleDeliveryFilter}
          />
        ))}
      </FilterSection>
      <FilterSection title="Tailles">
        <div className="widget-size d-flex flex-wrap gap-2 mt-3">
          {FILTER_OPTIONS.sizes.map((size) => (
            <Button
              key={size.value}
              variant={
                selectedSize === size.value ? "primary" : "outline-secondary"
              }
              className="size-selector py-1 px-2"
              style={{
                minWidth: "40px",
                fontSize: "0.875rem",
              }}
              onClick={() => handleSizeFilter(size.value)}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Campagne">
        {FILTER_OPTIONS.campaign.map((item) => (
          <CheckboxItem
            key={item.value}
            name={item.name}
            value={item.value}
            label={item.label}
            checked={selectedCampaign === item.value}
            onChange={handleCampaignFilter}
          />
        ))}
      </FilterSection>
      <FilterSection title="Garantie">
        {FILTER_OPTIONS.warranty.map((item) => (
          <CheckboxItem
            key={item.value}
            name={item.name}
            value={item.value}
            label={item.label}
            checked={selectedWarranty === item.value}
            onChange={handleWarrantyFilter}
          />
        ))}
      </FilterSection>
      <FilterSection title="Type de garantie">
        {FILTER_OPTIONS.warrantyType.map((item) => (
          <CheckboxItem
            key={item.value}
            name={item.name}
            value={item.value}
            label={item.label}
            checked={selectedWarrantyType === item.value}
            onChange={handleWarrantyTypeFilter}
          />
        ))}
      </FilterSection>
      <FilterSection title="Certification">
        {FILTER_OPTIONS.certification.map((item) => (
          <CheckboxItem
            key={item.value}
            name={item.name}
            value={item.value}
            label={item.label}
            checked={selectedCertification === item.value}
            onChange={handleCertificationFilter}
          />
        ))}
      </FilterSection>
      <FilterSection title="Tags">
        <Tags
          tags={allTags}
          selectedTag={selectedTag}
          onTagClick={handleTagFilter}
        />
      </FilterSection>
      <FilterSection title="Produits populaires">
        <PopularPost products={products} />
      </FilterSection>
      {/* Bouton de réinitialisation de tous les filtres */}
      {(selectedCategory !== "All" ||
        selectedTag ||
        selectedColor ||
        selectedSize ||
        selectedAvailability ||
        selectedBrand ||
        selectedDisplayType ||
        selectedDelivery.length > 0 ||
        selectedCampaign ||
        selectedWarranty ||
        selectedWarrantyType ||
        selectedCertification ||
        selectedRating ||
        searchTerm ||
        priceRange.min > 0 ||
        priceRange.max < initialMaxPrice) && (
        <Button
          variant="danger"
          size="sm"
          className="w-100 my-3"
          onClick={resetAllFilters}
        >
          <i className="icofont-close-circled me-2"></i>
          Réinitialiser tous les filtres
        </Button>
      )}
    </>)
  );

  // Composant pour afficher les filtres actifs
  const ActiveFilters = () => {
    const hasActiveFilters =
      selectedCategory !== "All" ||
      selectedTag ||
      selectedColor ||
      selectedSize ||
      selectedAvailability ||
      selectedBrand ||
      selectedDisplayType ||
      selectedDelivery.length > 0 ||
      selectedCampaign ||
      selectedWarranty ||
      selectedWarrantyType ||
      selectedCertification ||
      selectedRating ||
      priceRange.min > 0 ||
      priceRange.max < initialMaxPrice;

    if (!hasActiveFilters) return null;

    return (
      <div className="active-filters d-flex flex-wrap gap-2 mb-4 p-3 bg-light rounded">
        <span className="fw-bold me-2">Filtres actifs:</span>

        {selectedCategory !== "All" && (
          <span className="badge bg-primary">
            Catégorie: {selectedCategory}
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleCategoryFilter("All")}
              aria-label="Supprimer le filtre catégorie"
            ></button>
          </span>
        )}

        {selectedAvailability && (
          <span className="badge bg-primary">
            Disponibilité:{" "}
            {
              FILTER_OPTIONS.availability.find(
                (o) => o.value === selectedAvailability
              )?.label
            }
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleAvailabilityFilter(selectedAvailability)}
              aria-label="Supprimer le filtre disponibilité"
            ></button>
          </span>
        )}

        {selectedTag && (
          <span className="badge bg-info">
            Tag: {selectedTag}
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleTagFilter(selectedTag)}
              aria-label="Supprimer le filtre tag"
            ></button>
          </span>
        )}

        {selectedColor && (
          <span className="badge bg-success d-flex align-items-center">
            <span
              className="color-dot me-1"
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor:
                  FILTER_OPTIONS.colorFamily.find(
                    (c) => c.value === selectedColor
                  )?.hex || "#000",
              }}
            ></span>
            Couleur:{" "}
            {
              FILTER_OPTIONS.colorFamily.find((c) => c.value === selectedColor)
                ?.label
            }
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleColorFilter(selectedColor)}
              aria-label="Supprimer le filtre couleur"
            ></button>
          </span>
        )}

        {selectedSize && (
          <span className="badge bg-warning text-dark">
            Taille:{" "}
            {FILTER_OPTIONS.sizes.find((s) => s.value === selectedSize)?.label}
            <button
              className="ms-1 btn-close"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleSizeFilter(selectedSize)}
              aria-label="Supprimer le filtre taille"
            ></button>
          </span>
        )}

        {selectedBrand && (
          <span className="badge bg-secondary">
            Marque:{" "}
            {FILTER_OPTIONS.brands.find((b) => b.value === selectedBrand)
              ?.label || selectedBrand}
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleBrandFilter(selectedBrand)}
              aria-label="Supprimer le filtre marque"
            ></button>
          </span>
        )}

        {selectedDisplayType && (
          <span className="badge bg-secondary">
            Écran:{" "}
            {
              FILTER_OPTIONS.displayType.find(
                (d) => d.value === selectedDisplayType
              )?.label
            }
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleDisplayTypeFilter(selectedDisplayType)}
              aria-label="Supprimer le filtre type d'écran"
            ></button>
          </span>
        )}

        {selectedDelivery.length > 0 &&
          selectedDelivery.map((delivery) => (
            <span key={delivery} className="badge bg-info">
              Livraison:{" "}
              {FILTER_OPTIONS.delivery.find((d) => d.value === delivery)?.label}
              <button
                className="ms-1 btn-close btn-close-white"
                style={{ fontSize: "0.5rem" }}
                onClick={() => handleDeliveryFilter(delivery)}
                aria-label="Supprimer le filtre livraison"
              ></button>
            </span>
          ))}

        {selectedCampaign && (
          <span className="badge bg-danger">
            Campagne:{" "}
            {
              FILTER_OPTIONS.campaign.find((c) => c.value === selectedCampaign)
                ?.label
            }
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleCampaignFilter(selectedCampaign)}
              aria-label="Supprimer le filtre campagne"
            ></button>
          </span>
        )}

        {selectedWarranty && (
          <span className="badge bg-dark">
            Garantie:{" "}
            {
              FILTER_OPTIONS.warranty.find((w) => w.value === selectedWarranty)
                ?.label
            }
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleWarrantyFilter(selectedWarranty)}
              aria-label="Supprimer le filtre garantie"
            ></button>
          </span>
        )}

        {selectedWarrantyType && (
          <span className="badge bg-secondary">
            Type garantie:{" "}
            {
              FILTER_OPTIONS.warrantyType.find(
                (w) => w.value === selectedWarrantyType
              )?.label
            }
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleWarrantyTypeFilter(selectedWarrantyType)}
              aria-label="Supprimer le filtre type de garantie"
            ></button>
          </span>
        )}

        {selectedCertification && (
          <span className="badge bg-secondary">
            Certification:{" "}
            {
              FILTER_OPTIONS.certification.find(
                (c) => c.value === selectedCertification
              )?.label
            }
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleCertificationFilter(selectedCertification)}
              aria-label="Supprimer le filtre certification"
            ></button>
          </span>
        )}

        {selectedRating && (
          <span className="badge bg-warning text-dark d-flex align-items-center">
            Évaluation:
            <StarRating value={selectedRating} />
            <button
              className="ms-1 btn-close"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleRatingFilter(selectedRating)}
              aria-label="Supprimer le filtre évaluation"
            ></button>
          </span>
        )}

        {(priceRange.min > 0 || priceRange.max < initialMaxPrice) && (
          <span className="badge bg-secondary">
            Prix: {priceRange.min}€ - {priceRange.max}€
            <button
              className="ms-1 btn-close btn-close-white"
              style={{ fontSize: "0.5rem" }}
              onClick={resetPriceFilter}
              aria-label="Supprimer le filtre prix"
            ></button>
          </span>
        )}

        <button
          className="btn btn-sm btn-outline-danger ms-auto"
          onClick={resetAllFilters}
        >
          Effacer tous les filtres
        </button>
      </div>
    );
  };

  // --- RENDU JSX ---
  return (
    <div className="shop-page" style={{ marginTop: 0, paddingTop: 0 }}>
      <PageHeader
        title={"Notre boutique"}
        curPage={"Boutique"}
        style={{ marginTop: 110, paddingTop: 2 }}
      />
      <ShopMiniNav />

      {/* Offcanvas pour les filtres sur mobile */}
      <Offcanvas
        show={showFilters}
        onHide={() => setShowFilters(false)}
        placement="start"
        className="shop-filters-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filtres</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="py-1">
          <div className="overflow-auto h-100">
            <FilterSidebar
              menuItems={categories}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              handleCategoryFilter={handleCategoryFilter}
              handleTagFilter={handleTagFilter}
              allTags={allTags}
              FILTER_OPTIONS={FILTER_OPTIONS}
              selectedAvailability={selectedAvailability}
              handleAvailabilityFilter={handleAvailabilityFilter}
              selectedColor={selectedColor}
              handleColorFilter={handleColorFilter}
              selectedSize={selectedSize}
              handleSizeFilter={handleSizeFilter}
              selectedBrand={selectedBrand}
              handleBrandFilter={handleBrandFilter}
              selectedDisplayType={selectedDisplayType}
              handleDisplayTypeFilter={handleDisplayTypeFilter}
              selectedDelivery={selectedDelivery}
              handleDeliveryFilter={handleDeliveryFilter}
              selectedCampaign={selectedCampaign}
              handleCampaignFilter={handleCampaignFilter}
              selectedWarranty={selectedWarranty}
              handleWarrantyFilter={handleWarrantyFilter}
              selectedWarrantyType={selectedWarrantyType}
              handleWarrantyTypeFilter={handleWarrantyTypeFilter}
              selectedCertification={selectedCertification}
              handleCertificationFilter={handleCertificationFilter}
              selectedRating={selectedRating}
              handleRatingFilter={handleRatingFilter}
              priceRange={priceRange}
              initialMaxPrice={initialMaxPrice}
              handlePriceChange={handlePriceChange}
              applyPriceFilter={applyPriceFilter}
              resetPriceFilter={resetPriceFilter}
              resetAllFilters={resetAllFilters}
              products={products}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="shop-page padding-tb small">
        <Container fluid className="px-2">
          <div className="row g-1 justify-content-center">
            {/* Bouton pour afficher les filtres sur mobile */}
            <div className="col-12 d-block d-lg-none mb-4">
              <Button
                variant="outline-primary"
                className="w-100"
                onClick={() => setShowFilters(true)}
              >
                <i className="icofont-filter me-2"></i>
                Afficher les filtres
              </Button>
            </div>

            {/* --- Contenu Principal --- */}
            <div className="col-lg-9 col-12">
              <article>
                {/* Toolbar */}
                <div className="shop-title d-flex flex-wrap justify-content-between align-items-center mb-4">
                  <p className="mb-0">{showResultText}</p>
                  <div className="d-flex align-items-center">
                    <Form.Select
                      value={sortOption}
                      onChange={handleSortChange}
                      size="sm"
                      className="me-3"
                      style={{ maxWidth: "180px" }}
                      aria-label="Trier par"
                      disabled={isLoading}
                    >
                      <option value="default">Tri par défaut</option>
                      <option value="newest">Plus récents</option>
                      <option value="popularity">Popularité</option>
                      <option value="rating">Avis</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </Form.Select>
                    <div
                      className={`product-view-mode ${
                        GridList ? "gridActive" : "listActive"
                      }`}
                    >
                      <Button
                        variant="link"
                        className="grid p-1 me-1"
                        onClick={() => setGridList(true)}
                        aria-pressed={GridList}
                        title="Affichage Grille"
                      >
                        <i className="icofont-ghost"></i>
                      </Button>
                      <Button
                        variant="link"
                        className="list p-1"
                        onClick={() => setGridList(false)}
                        aria-pressed={!GridList}
                        title="Affichage Liste"
                      >
                        <i className="icofont-listine-dots"></i>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Filtres actifs */}
                <ActiveFilters />
                
                {/* Publicité en haut de la liste des produits */}
                <div className="mb-4">
                  <AdvertisementDisplay position="shop" type="banner" />
                </div>

                {/* Affichage Produits */}
                <div>
                  {error ? (
                    <div className="alert alert-danger">Erreur: {error}</div>
                  ) : isLoading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                    </div>
                  ) : currentProducts.length > 0 ? (
                    <ProductCards
                      products={currentProducts}
                      GridList={GridList}
                    />
                  ) : (
                    <div className="text-center py-5 my-4 bg-light rounded shadow-sm">
                      <i className="icofont-not-found display-1 text-muted mb-3"></i>
                      <h3 className="mt-3">Aucun produit trouvé</h3>
                      <p className="text-muted mb-4">
                        Essayez d&apos;ajuster vos filtres.
                      </p>
                      <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={resetAllFilters}
                      >
                        {" "}
                        <i className="icofont-refresh me-1"></i> Réinitialiser
                        les filtres
                      </Button>
                    </div>
                  )}
                </div>
                {/* Pagination */}
                {!isLoading &&
                  !error &&
                  filteredProducts.length > PRODUCTS_PER_PAGE && (
                    <Pagination
                      productsPerPage={PRODUCTS_PER_PAGE}
                      totalProducts={filteredProducts.length}
                      paginate={handlePaginate}
                      activePage={currentPage}
                    />
                  )}
                  
                {/* Publicité après la liste des produits */}
                <div className="my-4">
                  <AdvertisementDisplay position="shop" type="featured" />
                </div>
              </article>
            </div>
            {/* --- Barre Latérale --- */}
            <div className="col-lg-3 col-12 d-none d-lg-block">
              <aside className="shop-sidebar">
                <FilterSidebar
                  menuItems={categories}
                  selectedCategory={selectedCategory}
                  selectedTag={selectedTag}
                  handleCategoryFilter={handleCategoryFilter}
                  handleTagFilter={handleTagFilter}
                  allTags={allTags}
                  FILTER_OPTIONS={FILTER_OPTIONS}
                  selectedAvailability={selectedAvailability}
                  handleAvailabilityFilter={handleAvailabilityFilter}
                  selectedColor={selectedColor}
                  handleColorFilter={handleColorFilter}
                  selectedSize={selectedSize}
                  handleSizeFilter={handleSizeFilter}
                  selectedBrand={selectedBrand}
                  handleBrandFilter={handleBrandFilter}
                  selectedDisplayType={selectedDisplayType}
                  handleDisplayTypeFilter={handleDisplayTypeFilter}
                  selectedDelivery={selectedDelivery}
                  handleDeliveryFilter={handleDeliveryFilter}
                  selectedCampaign={selectedCampaign}
                  handleCampaignFilter={handleCampaignFilter}
                  selectedWarranty={selectedWarranty}
                  handleWarrantyFilter={handleWarrantyFilter}
                  selectedWarrantyType={selectedWarrantyType}
                  handleWarrantyTypeFilter={handleWarrantyTypeFilter}
                  selectedCertification={selectedCertification}
                  handleCertificationFilter={handleCertificationFilter}
                  selectedRating={selectedRating}
                  handleRatingFilter={handleRatingFilter}
                  priceRange={priceRange}
                  initialMaxPrice={initialMaxPrice}
                  handlePriceChange={handlePriceChange}
                  applyPriceFilter={applyPriceFilter}
                  resetPriceFilter={resetPriceFilter}
                  resetAllFilters={resetAllFilters}
                  products={products}
                />
              </aside>
            </div>
          </div>
        </Container>
      </div>
      <style jsx>{`
        .shop-filters-offcanvas {
          max-width: 300px;
        }
        .shop-sidebar {
          position: sticky;
          top: 2rem;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
          scrollbar-width: thin;
          padding-right: 10px;
        }
        .shop-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .shop-sidebar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .widget {
          background-color: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          margin-bottom: 1rem;
        }
        .widget-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .accordion-button {
          padding: 0.5rem 0;
          box-shadow: none !important;
        }
        .accordion-button:not(.collapsed) {
          background-color: transparent;
          color: inherit;
        }
        .accordion-button:focus {
          border-color: transparent;
          box-shadow: none;
        }
        .widget input[type="range"] {
          cursor: pointer;
        }
        .color-selector.selected {
          transform: scale(1.15);
          transition: transform 0.2s ease;
        }
        .active-filters {
          border-left: 3px solid #0d6efd;
        }
        .star-rating {
          color: #ffc107;
        }
      `}</style>
    </div>
  );
};

// Remplacer complètement getStaticProps par une version simplifiée et robuste
export async function getStaticProps() {
  return {
    props: {
      serverCategories: [],
      serverProducts: [], // On laisse le composant utiliser Data importé directement
    },
    // Revalider toutes les 10 minutes
    revalidate: 600,
  };
}

export default ShopPage;