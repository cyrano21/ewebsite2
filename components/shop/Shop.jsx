import React, { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import Search from "./Search";
import Pagination from "./Pagination";
import ShopCategory from "./ShopCategory";
import PopularPost from "./PopularPost";
import Tags from "./Tags";
import ProductCards from "./ProductCards";
import axios from "axios";

import { useRouter } from 'next/router';

const Shop = ({ initialCategory }) => {
  const router = useRouter();
  // slug dynamique depuis l'URL ou fallback
  const categorySlug = (router.query.slug || initialCategory || "all").toLowerCase();
  const [GridList, setGridList] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // Nombre de produits par page

  // category active colors
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const showResult = `Affichage de 01 - ${Math.min(
    productsPerPage,
    filteredProducts.length
  )} sur ${filteredProducts.length} résultats`;
  
  // Mettre à jour la catégorie sélectionnée lorsque l'URL change
  useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug]);

  // Charger les produits depuis l'API Next.js
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = categorySlug && categorySlug !== "all"
          ? `/api/products?category=${categorySlug}`
          : "/api/products";
        const response = await axios.get(url);

        if (response.status !== 200) {
          throw new Error("Erreur lors du chargement des produits");
        }

        const data = response.data;
        setProducts(data);

        // données déjà filtrées côté serveur
        setFilteredProducts(data);

        // Charger la vraie liste des catégories
        const fetchCategories = async () => {
          const res = await axios.get('/api/categories');
          let cats = res.data;
          // Vérification du format et adaptation si besoin
          if (Array.isArray(cats) && typeof cats[0] === 'string') {
            cats = cats.map(name => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-') }));
          }
          console.log('Catégories récupérées:', cats);
          setCategories(cats); // [{ name, slug }]
        };
        fetchCategories();

        setLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtrage basé sur la catégorie
  // Fonction utilitaire pour slugifier
const slugify = str => str && str.toLowerCase().replace(/\s+/g, '-');

const filterItem = async (curcat) => {
    console.log('Catégorie sélectionnée:', curcat);
    console.log('Produits:', products);
    setSelectedCategory(curcat);
    setCurrentPage(1); // Réinitialiser à la première page lors du changement de catégorie
    setLoading(true);

    try {
      if (curcat === "All") {
        setFilteredProducts(products);
      } else {
        // On tente de matcher sur product.category.slug OU product.category OU product.categorySlug
        const filtered = products.filter(
          (product) => {
            if (product.category && typeof product.category === 'object' && product.category.slug) {
              return product.category.slug === curcat;
            }
            if (product.categorySlug) {
              return product.categorySlug === curcat;
            }
            // Si product.category est un nom, on slugifie pour comparer
            if (typeof product.category === 'string') {
              return slugify(product.category) === curcat;
            }
            return false;
          }
        );
        console.log('Produits filtrés:', filtered);
        setFilteredProducts(filtered);
      }
    } catch (error) {
      console.error("Erreur:", error);
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
    let baseProducts =
      selectedCategory === "All"
        ? products
        : products.filter((product) => product.category === selectedCategory);

    // Puis filtrer par terme de recherche
    const results = baseProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        (product.description &&
          product.description.toLowerCase().includes(term))
    );

    setFilteredProducts(results);
  };

  return (
    <div>
      {/* Ajout d'une marge supérieure pour éviter que le titre soit caché par la navbar */}
<PageHeader title={"Notre boutique"} curPage={"Boutique"} style={{ marginTop: 200 }} />

      {/* shop page */}
      <div className="shop-page padding-tb">
        <div style={{ width: '100%', maxWidth: '100vw', padding: '0 20px', margin: 0 }}>
          <div className="row">
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
                        <i
                          className="icofont-search-2"
                          style={{ fontSize: "3rem", color: "#ddd" }}
                        ></i>
                        <h3 className="mt-3">Aucun produit trouvé</h3>
                        <p className="mb-4">
                          Essayez de modifier vos critères de recherche ou de
                          filtrage.
                        </p>
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
                <Search onSearch={handleSearch} disabled={loading} />
                {console.log('Catégories envoyées à ShopCategory:', categories)}
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
