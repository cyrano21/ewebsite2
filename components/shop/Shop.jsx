import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/PageHeader";
import Search from "../../src/pages/Shop/Search";
import Pagination from "../../src/pages/Shop/Pagination";
import ShopCategory from "../../src/pages/Shop/ShopCategory";
import PopularPost from "../../src/pages/Shop/PopularPost";
import Tags from "../../src/pages/Shop/Tags";
import ProductCards from "../../src/pages/Shop/ProductCards";
import axios from "axios";

const Shop = () => {
  const [GridList, setGridList] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Nombre de produits par page

  // category active colors
  const [selectedCategory, setSelectedCategory] = useState("All");
  const showResult = `Affichage de 01 - ${Math.min(productsPerPage, filteredProducts.length)} sur ${filteredProducts.length} résultats`;

  // Charger les produits depuis l'API Next.js
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
        
        if (response.status !== 200) {
          throw new Error('Erreur lors du chargement des produits');
        }
        
        const data = response.data;
        setProducts(data);
        setFilteredProducts(data);
        
        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Fonction pour changer la page courante
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll vers le haut de la page lorsqu'on change de page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtrage basé sur la catégorie
  const filterItem = async (curcat) => {
    setSelectedCategory(curcat);
    setCurrentPage(1); // Réinitialiser à la première page lors du changement de catégorie
    setLoading(true);
    
    try {
      // Si "All" est sélectionné, afficher tous les produits
      if (curcat === "All") {
        setFilteredProducts(products);
      } else {
        // Sinon, filtrer par catégorie
        const filtered = products.filter(product => product.category === curcat);
        setFilteredProducts(filtered);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de recherche
  const handleSearch = (searchTerm) => {
    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
    
    if (!searchTerm.trim()) {
      // Si la recherche est vide, réinitialiser au filtre de catégorie actuel
      filterItem(selectedCategory);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Filtrer d'abord par catégorie si une catégorie est sélectionnée
    let baseProducts = selectedCategory === "All" 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    // Puis filtrer par terme de recherche
    const results = baseProducts.filter(product => 
      product.name.toLowerCase().includes(term) || 
      (product.description && product.description.toLowerCase().includes(term))
    );
    
    setFilteredProducts(results);
  };

  return (
    <div>
      <PageHeader title={"Notre boutique"} curPage={"Boutique"} />

      {/* shop page */}
      <div className="shop-page padding-tb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <article>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-2">Chargement des produits...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : (
                  <>
                    <div className="shop-title d-flex flex-wrap justify-content-between">
                      <p>{showResult}</p>
                      <div
                        className={`product-view-mode ${
                          GridList ? "gridActive" : "listActive"
                        }`}
                      >
                        <a className="grid" onClick={() => setGridList(true)}>
                          <i className="icofont-ghost"></i>
                        </a>
                        <a className="list" onClick={() => setGridList(false)}>
                          <i className="icofont-listine-dots"></i>
                        </a>
                      </div>
                    </div>
                    
                    {currentProducts.length > 0 ? (
                      <div>
                        <ProductCards
                          products={currentProducts}
                          GridList={GridList}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="icofont-search-2" style={{ fontSize: '3rem', color: '#ddd' }}></i>
                        <h3 className="mt-3">Aucun produit trouvé</h3>
                        <p className="mb-4">Essayez de modifier vos critères de recherche ou de filtrage.</p>
                      </div>
                    )}
                    
                    <Pagination
                      productsPerPage={productsPerPage}
                      totalProducts={filteredProducts.length}
                      paginate={paginate}
                      activePage={currentPage}
                    />
                  </>
                )}
              </article>
            </div>
            <div className="col-lg-4 col-12">
              <aside>
                <Search 
                  onSearch={handleSearch}
                  disabled={loading} 
                />
                <ShopCategory
                  filterItem={filterItem}
                  menuItems={categories}
                  selectedCategory={selectedCategory}
                  disabled={loading}
                />
                <PopularPost />
                <Tags />
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
