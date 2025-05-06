
import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import ProductsTable from './ProductsTable';
import FiltersBar from './FiltersBar';
import ProductModal from './ProductModal';
import PreviewModal from './PreviewModal';
import CategoryModal from './CategoryModal';
import StatsOverview from './StatsOverview';
import BestSellingProducts from './BestSellingProducts';
import MostViewedProducts from './MostViewedProducts';
import CategoryDistribution from './CategoryDistribution';
import { useRouter } from 'next/router';
import usePagination from './hooks/usePagination';
import useModalState from './hooks/useModalState';
import useFilteredProducts from './hooks/useFilteredProducts';
import useProductData from './hooks/useProductData';
import useProductMutations from './hooks/useProductMutations';
import useCategoryModal from './hooks/useCategoryModal';
import usePreviewModal from './hooks/usePreviewModal';
import useProductModal from './hooks/useProductModal';
import useBestSellingProducts from './hooks/useBestSellingProducts';
import useMostViewedProducts from './hooks/useMostViewedProducts';

const ProductManagement = () => {
    const router = useRouter();
    const { id: productId, edit } = router.query;
    
    // Chargement des produits
    const { 
        products, 
        categories,
        loading, 
        error, 
        refreshProducts,
        productStats,
        categoryStats 
    } = useProductData();
    
    // Gestion des filtres et recherche
    const { 
        filteredProducts, 
        searchTerm, 
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        sortOption,
        setSortOption,
        stockFilter,
        setStockFilter,
        resetFilters
    } = useFilteredProducts(products);
    
    // Pagination
    const { 
        currentItems, 
        currentPage, 
        setCurrentPage,
        totalPages,
        indexOfFirstItem 
    } = usePagination(filteredProducts, 10);
    
    // Gestion des modales
    const { 
        showAddModal, 
        setShowAddModal,
        showDeleteModal,
        setShowDeleteModal,
        deleteProductId,
        setDeleteProductId,
        showImportModal,
        setShowImportModal,
        showExportModal,
        setShowExportModal
    } = useModalState();
    
    const {
        showCategoryModal,
        setShowCategoryModal,
        categoryModalMode,
        setCategoryModalMode,
        editCategoryId,
        setEditCategoryId,
        handleAddCategory,
        handleEditCategory
    } = useCategoryModal();
    
    const {
        showPreviewModal,
        setShowPreviewModal,
        previewProduct,
        setPreviewProduct,
        handleShowPreviewModal
    } = usePreviewModal();
    
    const {
        productData,
        setProductData,
        showProductModal,
        setShowProductModal,
        modalTitle,
        setModalTitle,
        modalAction,
        setModalAction,
        handleAddProduct,
        handleShowEditModal,
        handleProductFormSubmit,
        productHistory
    } = useProductModal({ refreshProducts });
    
    const { deleteProduct } = useProductMutations({ refreshProducts });
    
    // Widgets de données
    const { bestSellingProducts, bestSellingLoading, bestSellingError } = useBestSellingProducts();
    const { mostViewedProducts, mostViewedLoading, mostViewedError } = useMostViewedProducts();
    
    // Initialiser l'édition si l'URL contient un ID de produit
    useEffect(() => {
        if (productId && edit === 'true') {
            const storedProductData = sessionStorage.getItem('editProductData');
            if (storedProductData) {
                const parsedData = JSON.parse(storedProductData);
                handleShowEditModal(parsedData);
                sessionStorage.removeItem('editProductData');
            } else if (products && products.length > 0) {
                const productToEdit = products.find(p => p.id === productId || p._id === productId);
                if (productToEdit) {
                    handleShowEditModal(productToEdit);
                }
            }
        }
    }, [productId, edit, products]);
    
    // Gestionnaires d'événements
    const handleDeleteProductClick = (id) => {
        setDeleteProductId(id);
        setShowDeleteModal(true);
    };
    
    const confirmDeleteProduct = async () => {
        try {
            await deleteProduct(deleteProductId);
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        }
    };
    
    const handleViewOnShop = (id) => {
        router.push(`/shop/product/${id}`);
    };
    
    return (
        <div className="product-management p-3">
            {/* Modales */}
            <ProductModal
                show={showProductModal}
                onHide={() => setShowProductModal(false)}
                productData={productData}
                onSubmit={handleProductFormSubmit}
                categories={categories}
                modalTitle={modalTitle}
                modalAction={modalAction}
                productHistory={productHistory}
            />
            
            <PreviewModal
                show={showPreviewModal}
                onHide={() => setShowPreviewModal(false)}
                product={previewProduct}
            />
            
            <CategoryModal
                show={showCategoryModal}
                onHide={() => setShowCategoryModal(false)}
                mode={categoryModalMode}
                categoryId={editCategoryId}
                categories={categories}
                onSubmit={categoryModalMode === 'add' ? handleAddCategory : handleEditCategory}
            />
            
            {/* Confirmation de suppression */}
            {showDeleteModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmer la suppression</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                    Annuler
                                </Button>
                                <Button variant="danger" onClick={confirmDeleteProduct}>
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Gestion des Produits</h2>
                        <div>
                            <Button 
                                variant="primary" 
                                className="me-2" 
                                onClick={() => {
                                    setProductData(null);
                                    setModalTitle("Ajouter un produit");
                                    setModalAction("add");
                                    setShowProductModal(true);
                                }}
                            >
                                <i className="icofont-plus"></i> Ajouter un produit
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                className="me-2"
                                onClick={() => {
                                    setCategoryModalMode('add');
                                    setEditCategoryId(null);
                                    setShowCategoryModal(true);
                                }}
                            >
                                <i className="icofont-plus"></i> Nouvelle catégorie
                            </Button>
                        </div>
                    </div>
                    
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}
                    
                    <Row className="mb-4">
                        <Col lg={12}>
                            <StatsOverview stats={productStats} />
                        </Col>
                    </Row>
                    
                    <Row className="mb-4">
                        <Col md={4}>
                            <BestSellingProducts 
                                products={bestSellingProducts} 
                                loading={bestSellingLoading} 
                                error={bestSellingError} 
                            />
                        </Col>
                        <Col md={4}>
                            <MostViewedProducts 
                                products={mostViewedProducts} 
                                loading={mostViewedLoading} 
                                error={mostViewedError} 
                            />
                        </Col>
                        <Col md={4}>
                            <CategoryDistribution 
                                categoryStats={categoryStats}
                                loading={loading}
                                error={error}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            <Row>
                <Col lg={12}>
                    <FiltersBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        stockFilter={stockFilter}
                        setStockFilter={setStockFilter}
                        resetFilters={resetFilters}
                    />
                </Col>
            </Row>
            
            <Row className="mt-3">
                <Col lg={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="py-3 bg-white d-flex align-items-center justify-content-between">
                            <h5 className="mb-0">Liste des Produits</h5>
                            <div>
                                <span className="badge bg-primary me-2">
                                    {filteredProducts.length} produits
                                </span>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Chargement...</span>
                                    </div>
                                </div>
                            ) : (
                                <ProductsTable 
                                    products={currentItems}
                                    indexOfFirstItem={indexOfFirstItem}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    handlePageChange={setCurrentPage}
                                    handleViewOnShop={handleViewOnShop}
                                    handleShowPreviewModal={handleShowPreviewModal}
                                    handleShowEditModal={handleShowEditModal}
                                    handleDeleteProduct={handleDeleteProductClick}
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductManagement;
