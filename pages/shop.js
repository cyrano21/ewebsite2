import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
// import styles from "./shop.module.css"; // Utilisation classes globales

// Composants
import Search from "../components/shop/Search";
import Pagination from "../components/shop/Pagination";
import ShopCategory from "../components/shop/ShopCategory";
import PopularPost from "../components/shop/PopularPost";
import Tags from "../components/shop/Tags";
import ProductCards from "../components/shop/ProductCards";

// Données
import Data from "/src/products.json"; // Ajuster chemin si nécessaire
const initialProductsData = Array.isArray(Data) ? Data : [];

// --- CONSTANTES ---
const PRODUCTS_PER_PAGE = 12; // <<< DÉCLARATION ICI (en dehors du composant)

const Shop = () => {
  const router = useRouter();
  const { category, tag, search, page, sort, minp, maxp } = router.query;

  // --- ÉTATS ---
  const [products, setProducts] = useState(initialProductsData);
  const [filteredProducts, setFilteredProducts] = useState(initialProductsData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [GridList, setGridList] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || "All");
  const [selectedTag, setSelectedTag] = useState(tag || null);
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [sortOption, setSortOption] = useState(sort || "default");

  const initialMaxPrice = useMemo(() => {
      if (!products || products.length === 0) return 1000;
      const max = products.reduce((max, p) => Math.max(max, p.price || 0), 0);
      return Math.ceil(max / 100) * 100 || 1000;
  }, [products]);
  const [priceRange, setPriceRange] = useState({
      min: parseInt(minp || "0", 10),
      max: parseInt(maxp || initialMaxPrice.toString(), 10) || initialMaxPrice
  });
  const [currentPage, setCurrentPage] = useState(parseInt(page || "1", 10));
  // const productsPerPage = 12; // <<< SUPPRIMÉ D'ICI

  // --- EFFETS ---
  useEffect(() => {
    setSelectedCategory(category || "All");
    setSelectedTag(tag || null);
    setSearchTerm(search || "");
    setCurrentPage(parseInt(page || "1", 10));
    setSortOption(sort || "default");
    setPriceRange(prevRange => ({
        min: parseInt(minp || "0", 10),
        max: parseInt(maxp || initialMaxPrice.toString(), 10) || initialMaxPrice
    }));
  }, [category, tag, search, page, sort, minp, maxp, initialMaxPrice]);

  useEffect(() => {
    setError(null);
    try {
      let result = [...products];
      if (selectedCategory && selectedCategory !== "All") { result = result.filter(p => p.category === selectedCategory); }
      if (selectedTag) { result = result.filter(p => p.tags && p.tags.includes(selectedTag)); }
      if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          result = result.filter(p => p.name.toLowerCase().includes(lowerSearch) || (p.description && p.description.toLowerCase().includes(lowerSearch)) || (p.category && p.category.toLowerCase().includes(lowerSearch)) || (p.tags && p.tags.some(t => t.toLowerCase().includes(lowerSearch))));
      }
       const minPrice = Number(priceRange.min) || 0;
       const maxPrice = Number(priceRange.max) || initialMaxPrice;
       result = result.filter(p => (p.price >= minPrice && p.price <= maxPrice));

      const sortByPrice = (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      switch (sortOption) {
        case "price-asc": result.sort(sortByPrice); break;
        case "price-desc": result.sort((a, b) => sortByPrice(b, a)); break;
        case "popularity": result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); break;
        case "rating": result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
        case "newest":
            if (result.length > 0 && result[0].createdAt && !isNaN(new Date(result[0].createdAt).getTime())) { result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
             else { /* Pas de tri fallback si default le gère */ } break;
        case "default": default: /* Pas de tri additionnel */ break;
      }
      setFilteredProducts(result);
    } catch (e) { console.error("Erreur filtre/tri:", e); setError("Erreur filtre/tri."); setFilteredProducts([]); }
  }, [products, selectedCategory, selectedTag, searchTerm, priceRange, sortOption, initialMaxPrice]);

  // --- DONNÉES DÉRIVÉES ---
  const menuItems = useMemo(() => ["All", ...new Set(products.map(p => p.category))].filter(Boolean), [products]);
  const allTags = useMemo(() => [...new Set(products.flatMap(p => p.tags || []))].filter(Boolean), [products]);
  // Utilisation de la constante PRODUCTS_PER_PAGE définie plus haut
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = useMemo(() => filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct), [filteredProducts, indexOfFirstProduct, indexOfLastProduct]);
  const showResultText = useMemo(() => {
      if (isLoading) return "Chargement..."; if (error) return "Erreur";
      const start = filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0;
      const end = Math.min(indexOfLastProduct, filteredProducts.length);
      return `Affichage de ${start} - ${end} sur ${filteredProducts.length} résultats`;
  }, [filteredProducts, indexOfFirstProduct, indexOfLastProduct, isLoading, error]);

  // --- HANDLERS ---
   const buildNextQuery = (updates) => {
       const currentQuery = { ...router.query }; const nextQuery = { ...currentQuery, ...updates };
       if (nextQuery.category === "All" || !nextQuery.category) delete nextQuery.category; if (!nextQuery.tag) delete nextQuery.tag; if (!nextQuery.search) delete nextQuery.search; if (nextQuery.sort === "default" || !nextQuery.sort) delete nextQuery.sort; if (parseInt(nextQuery.page || "1", 10) === 1) delete nextQuery.page; if (parseInt(nextQuery.minp || "0", 10) === 0) delete nextQuery.minp; if (parseInt(nextQuery.maxp || initialMaxPrice.toString(), 10) === initialMaxPrice) delete nextQuery.maxp; if (Object.keys(updates).some(key => key !== 'page')) { delete nextQuery.page; } return nextQuery;
   };
   const updateQuery = (newQuery) => router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true, scroll: false });
   const handleCategoryFilter = (category) => updateQuery(buildNextQuery({ category: category }));
   const handleSearchChange = (event) => setSearchTerm(event.target.value);
   const handleSearchSubmit = (e) => { e.preventDefault(); updateQuery(buildNextQuery({ search: searchTerm || undefined })); };
   const handleTagFilter = (tag) => { const newTag = tag === selectedTag ? null : tag; updateQuery(buildNextQuery({ tag: newTag })); };
   const handlePriceChange = (min, max) => { const vMin = Math.max(0, Math.min(min, max)); const vMax = Math.max(vMin, max); setPriceRange({ min: vMin, max: vMax }); };
   const applyPriceFilter = () => updateQuery(buildNextQuery({ minp: priceRange.min, maxp: priceRange.max }));
   const resetPriceFilter = () => { setPriceRange({ min: 0, max: initialMaxPrice }); updateQuery(buildNextQuery({ minp: undefined, maxp: undefined })); }
   const handleSortChange = (e) => updateQuery(buildNextQuery({ sort: e.target.value }));
   const handlePaginate = (pageNumber) => { updateQuery(buildNextQuery({ page: pageNumber })); window.scrollTo(0, 0); };

  // --- RENDU JSX ---
  return (
    <div>
      <PageHeader title={"Notre boutique"} curPage={"Boutique"} />
      <div className="shop-page padding-tb">
        <div className="container">
          <div className="row justify-content-center">
            {/* --- Contenu Principal --- */}
            <div className="col-lg-8 col-12">
              <article>
                {/* Toolbar */}
                <div className="shop-title d-flex flex-wrap justify-content-between align-items-center mb-4">
                    <p className="mb-0">{showResultText}</p>
                    <div className="d-flex align-items-center">
                        <Form.Select value={sortOption} onChange={handleSortChange} size="sm" className="me-3" style={{ maxWidth: '180px' }} aria-label="Trier par" disabled={isLoading}>
                            <option value="default">Tri par défaut</option><option value="newest">Plus récents</option><option value="popularity">Popularité</option><option value="rating">Avis</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option>
                        </Form.Select>
                        <div className={`product-view-mode ${ GridList ? "gridActive" : "listActive" }`}>
                            <Button variant="link" className="grid p-1 me-1" onClick={() => setGridList(true)} aria-pressed={GridList} title="Affichage Grille"><i className="icofont-ghost"></i></Button>
                            <Button variant="link" className="list p-1" onClick={() => setGridList(false)} aria-pressed={!GridList} title="Affichage Liste"><i className="icofont-listine-dots"></i></Button>
                        </div>
                    </div>
                </div>
                {/* Affichage Produits */}
                <div>
                  {error ? (<div className="alert alert-danger">Erreur: {error}</div>
                  ) : isLoading ? (<div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Chargement...</span></div></div>
                  ) : currentProducts.length > 0 ? (<ProductCards products={currentProducts} GridList={GridList}/>
                  ) : (
                       <div className="text-center py-5 my-4 bg-light rounded shadow-sm">
                           <i className="icofont-not-found display-1 text-muted mb-3"></i><h3 className="mt-3">Aucun produit trouvé</h3><p className="text-muted mb-4">Essayez d'ajuster vos filtres.</p><Button variant="primary" className="rounded-pill" onClick={() => updateQuery({})}> <i className="icofont-refresh me-1"></i> Réinitialiser les filtres</Button>
                       </div>
                  )}
                </div>
                {/* Pagination */}
                 {/* Utilisation de la constante PRODUCTS_PER_PAGE */}
                 {!isLoading && !error && filteredProducts.length > PRODUCTS_PER_PAGE && (
                    <Pagination
                        productsPerPage={PRODUCTS_PER_PAGE}
                        totalProducts={filteredProducts.length}
                        paginate={handlePaginate}
                        activePage={currentPage}
                    />
                 )}
              </article>
            </div>
            {/* --- Barre Latérale --- */}
            <div className="col-lg-4 col-12">
              <aside>
                <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} onSearchSubmit={handleSearchSubmit}/>
                <ShopCategory filterItem={handleCategoryFilter} menuItems={menuItems} selectedCategory={selectedCategory}/>
                <div className="widget widget-filter-price my-4">
                    <h4 className="widget-title">Filtrer par prix</h4>
                    <div className="widget-content">
                         <div className="price-range mb-3"><div className="mb-2 text-center fw-bold">{priceRange.min}€ - {priceRange.max}€</div><Form.Label htmlFor="sidebarMinPriceRange" className="small">Min: {priceRange.min}€</Form.Label><Form.Range id="sidebarMinPriceRange" min={0} max={initialMaxPrice} step={10} value={priceRange.min} onChange={(e) => handlePriceChange(parseInt(e.target.value, 10), priceRange.max)} className="mb-2"/><Form.Label htmlFor="sidebarMaxPriceRange" className="small">Max: {priceRange.max}€</Form.Label><Form.Range id="sidebarMaxPriceRange" min={0} max={initialMaxPrice} step={10} value={priceRange.max} onChange={(e) => handlePriceChange(priceRange.min, parseInt(e.target.value, 10))} /></div>
                         <Button variant="secondary" size="sm" className="w-100 mb-2" onClick={applyPriceFilter}>Appliquer Prix</Button>
                         <Button variant="outline-secondary" size="sm" className="w-100" onClick={resetPriceFilter}>Réinitialiser Prix</Button>
                    </div>
                     <style jsx>{`.widget-filter-price { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); } .widget-filter-price .widget-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; } .widget-filter-price input[type=range] { cursor: pointer; } `}</style>
                </div>
                <Tags tags={allTags} selectedTag={selectedTag} onTagClick={handleTagFilter}/>
                <PopularPost products={products}/>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;