"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert } from 'react-bootstrap';
import FiltersBar from './ProductManagement/FiltersBar';
import ProductsTable from './ProductManagement/ProductsTable';
import ProductModal from './ProductManagement/ProductModal';
import CategoryModal from './ProductManagement/CategoryModal';
import { useProductData } from './ProductManagement/hooks/useProductData';
import useFilteredProducts from './ProductManagement/hooks/useFilteredProducts';
import usePagination from './ProductManagement/hooks/usePagination';
import useModalState from './ProductManagement/hooks/useModalState';
import { useProductMutations } from './ProductManagement/hooks/useProductMutations';
import StatsOverview from './ProductManagement/StatsOverview';
import SalesTrendChart from './ProductManagement/SalesTrendChart';
import BestSellingProducts from './ProductManagement/BestSellingProducts';
import MostViewedProducts from './ProductManagement/MostViewedProducts';
import CategoryDistribution from './ProductManagement/CategoryDistribution';
import PreviewModal from './ProductManagement/PreviewModal';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Aperçu';

// Fonction pour calculer les stats globales du magasin
const calculateShopStats = (products) => {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((parseFloat(p.price) || 0) * (parseInt(p.stock) || 0)), 0);
  const lowStockCount = products.filter(p => parseInt(p.stock) <= 10 && parseInt(p.stock) > 0).length;
  const outOfStockCount = products.filter(p => parseInt(p.stock) <= 0).length;

  return {
    totalProducts,
    totalStock,
    totalValue: totalValue.toFixed(2),
    lowStockCount,
    outOfStockCount
  };
};

const ProductManagement = () => {
  // État du produit sélectionné pour prévisualisation
  const [previewProduct, setPreviewProduct] = useState(null);

  // État pour le modal d'édition de catégorie
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // État pour les filtres
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    stockStatus: 'all'
  });

  // Chargement des données produits
  const { products, categories, isLoading, error, refreshProducts } = useProductData({});

  // Logique de filtrage des produits
  const filteredProducts = useFilteredProducts(products, filters);

  // Pagination
  const { currentItems, currentPage, setCurrentPage, totalPages, indexOfFirstItem } = usePagination(filteredProducts, 10);

  // État et contrôle du modal produit
  const { isOpen: isProductModalOpen, modalData: productData, openModal: openProductModal, closeModal: closeProductModal } = useModalState();

  // Mutations produits (ajouter, modifier, supprimer)
  const { handleAddProduct, handleUpdateProduct, handleDeleteProduct, mutationStatus } = useProductMutations(refreshProducts);

  // Statistiques du magasin
  const shopStats = useMemo(() => {
    if (!products || products.length === 0) return null;
    return calculateShopStats(products);
  }, [products]);

  // Fonction pour ouvrir le modal d'ajout/édition de produit
  const handleOpenProductModal = (product = null) => {
    if (product) {
      // Mode édition
      openProductModal({
        ...product,
        isEditMode: true
      });
    } else {
      // Mode ajout
      openProductModal({
        name: '',
        description: '',
        price: '',
        salePrice: '',
        stock: '',
        category: '',
        image: '',
        isEditMode: false
      });
    }
  };

  // Fonction pour prévisualiser un produit
  const handlePreviewProduct = (product) => {
    setPreviewProduct(product);
  };

  // Fonction pour gérer la soumission du formulaire produit
  const handleProductSubmit = (productData) => {
    if (productData.isEditMode) {
      handleUpdateProduct(productData);
    } else {
      handleAddProduct(productData);
    }
    closeProductModal();
  };

  return (
    <Container fluid className="py-4">
      {/* Alerte en cas d'erreur de chargement */}
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {/* Statistiques globales */}
      <Row className="mb-4">
        <Col>
          <StatsOverview stats={shopStats} isLoading={isLoading} />
        </Col>
      </Row>

      {/* Graphiques et statistiques */}
      <Row className="mb-4">
        <Col lg={8}>
          <SalesTrendChart />
        </Col>
        <Col lg={4}>
          <CategoryDistribution products={products} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6}>
          <BestSellingProducts />
        </Col>
        <Col lg={6}>
          <MostViewedProducts />
        </Col>
      </Row>

      {/* Barre d'outils et filtres */}
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Gestion des produits</h5>
                <div>
                  <Button 
                    variant="outline-secondary"
                    className="me-2"
                    onClick={() => setShowCategoryModal(true)}
                  >
                    Gérer les catégories
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => handleOpenProductModal()}
                  >
                    <i className="fas fa-plus me-1"></i> Ajouter un produit
                  </Button>
                </div>
              </div>

              <FiltersBar 
                filters={filters}
                setFilters={setFilters}
                categories={categories}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tableau des produits */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <ProductsTable 
                products={currentItems}
                currentPage={currentPage}
                itemsPerPage={10}
                indexOfFirstItem={indexOfFirstItem}
                totalItems={filteredProducts.length}
                isLoading={isLoading}
                onEdit={handleOpenProductModal}
                onDelete={handleDeleteProduct}
                onPreview={handlePreviewProduct}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </button>
                    </li>

                    {[...Array(totalPages).keys()].map(number => (
                      <li 
                        key={number + 1} 
                        className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                      >
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(number + 1)}
                        >
                          {number + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal pour ajouter/éditer un produit */}
      <ProductModal 
        show={isProductModalOpen}
        onHide={closeProductModal}
        productData={productData}
        categories={categories}
        onSubmit={handleProductSubmit}
      />

      {/* Modal pour gérer les catégories */}
      <CategoryModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        categories={categories}
        onCategoriesUpdated={refreshProducts}
      />

      {/* Modal de prévisualisation */}
      <PreviewModal
        show={!!previewProduct}
        onHide={() => setPreviewProduct(null)}
        product={previewProduct}
      />
    </Container>
  );
};

export default ProductManagement;