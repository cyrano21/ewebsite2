// components/admin/ProductManagement/ProductManagement.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap'; // Removed unused Button import
import PageHeader from '../../components/PageHeader'; // Ajuster chemin
import { useRouter } from 'next/router';

// Importer les hooks personnalisés (vérifier les chemins)
import { useProductData } from './ProductManagement/hooks/useProductData';
import { useFilteredProducts } from './ProductManagement/hooks/useFilteredProducts';
import { usePagination } from './ProductManagement/hooks/usePagination';
import { useModalState } from './ProductManagement/hooks/useModalState';
import { useProductMutations } from './ProductManagement/hooks/useProductMutations';
import { useMostViewedProducts } from './ProductManagement/hooks/useMostViewedProducts';
import { useBestSellingProducts } from './ProductManagement/hooks/useBestSellingProducts';

// Importer les composants UI découpés (vérifier les chemins)
import StatsOverview from '../../components/admin/ProductManagement/StatsOverview';
// Removed unused CategoryDistribution import
import SalesTrendChart from '../../components/admin/ProductManagement/SalesTrendChart';
import MostViewedProducts from '../../components/admin/ProductManagement/MostViewedProducts';
import BestSellingProducts from '../../components/admin/ProductManagement/BestSellingProducts';
import FiltersBar from '../../components/admin/ProductManagement/FiltersBar';
import ProductsTable from '../../components/admin/ProductManagement/ProductsTable';
import ProductModal from '../../components/admin/ProductManagement/ProductModal';
import PreviewModal from '../../components/admin/ProductManagement/PreviewModal';
import CategoryModal from '../../components/admin/ProductManagement/CategoryModal';

// Importer les utils (vérifier le chemin)
import { calculateShopStats } from '../../components/admin/ProductManagement/utils/statsUtils';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Aper%C3%A7u';

const ProductManagement = () => {
    const router = useRouter();
    const editProductId = router.query.edit;

    // --- Hooks ---
    const { products, productHistory, productStats, shopStats, setShopStats, isLoading: isLoadingData, error: dataError, updateSingleProductState, addSingleProductState, removeSingleProductState, updateHistoryAndStats } = useProductData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [sortOption, setSortOption] = useState('default');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const { isOpen: isProductModalOpen, openModal: openProductModal, closeModal: closeProductModal, modalData: currentProductData, setModalData: setCurrentProductData } = useModalState(null);
    const { isOpen: isPreviewModalOpen, openModal: openPreviewModal, closeModal: closePreviewModal, modalData: previewProductData } = useModalState(null);
    const { isOpen: isCategoryModalOpen, openModal: openCategoryModal, closeModal: closeCategoryModal } = useModalState(false);
    const { addProduct, updateProduct, deleteProduct, isMutating, mutationError } = useProductMutations({ addSingleProductState, updateSingleProductState, removeSingleProductState, updateHistoryAndStats });
    const { products: mostViewed, loading: loadingMostViewed } = useMostViewedProducts(5);
    const { products: bestSelling, loading: loadingBestSelling } = useBestSellingProducts(5);

    // --- Ajustement Max Price Range ---
     useEffect(() => { if(products && products.length > 0) { const max = products.reduce((maxPrice, p) => Math.max(maxPrice, p.price || 0), 0); const initialMax = Math.ceil(max / 100) * 100 || 1000; setPriceRange(prev => ({ ...prev, max: prev.max === 10000 ? initialMax : prev.max })); } }, [products]);

    // --- Filtrage/Tri ---
    const filteredProducts = useFilteredProducts(products, { searchTerm, selectedCategory, priceRange, sortOption });

    // --- Pagination ---
    const { currentPage, setCurrentPage, totalPages, indexOfFirstItem, indexOfLastItem, } = usePagination(filteredProducts.length, 1, 10);

    // --- Items Paginés ---
    const currentItems = useMemo(() => filteredProducts.slice(indexOfFirstItem, indexOfLastItem), [filteredProducts, indexOfFirstItem, indexOfLastItem]);

    // --- Catégories Disponibles ---
    const availableCategories = useMemo(() => { 
        // Using the JavaScript built-in Set constructor
        const categorySet = new Set(products.map(p => p.category || 'Non classé')); 
        const cats = [...categorySet]; 
        if (!cats.includes('Non classé') && products.some(p => !p.category)) { 
            cats.push('Non classé'); 
        } 
        return ['Tous', ...cats.sort()]; 
    }, [products]);


    // --- Handlers ---

    // Helper pour màj URL (à définir ou importer)
    const buildNextQuery = (updates) => {
        const currentQuery = { ...router.query }; const nextQuery = { ...currentQuery, ...updates };
        if (nextQuery.category === "Tous" || !nextQuery.category) delete nextQuery.category; if (!nextQuery.tag) delete nextQuery.tag; if (!nextQuery.search) delete nextQuery.search; if (nextQuery.sort === "default" || !nextQuery.sort) delete nextQuery.sort; if (parseInt(nextQuery.page || "1", 10) === 1) delete nextQuery.page; if (parseInt(nextQuery.minp || "0", 10) === 0) delete nextQuery.minp;
        const max = products.reduce((maxPrice, p) => Math.max(maxPrice, p.price || 0), 0); const initialMax = Math.ceil(max / 100) * 100 || 1000; // Recalculer ici aussi pour être sûr
        if (parseInt(nextQuery.maxp || initialMax.toString(), 10) === initialMax) delete nextQuery.maxp; if (Object.keys(updates).some(key => key !== 'page')) { delete nextQuery.page; } return nextQuery;
    };
    const updateQuery = (newQuery) => router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true, scroll: false });

    // Handlers pour FiltersBar
    const handleSearchChange = (e) => { setSearchTerm(e.target.value); /* Reset page est géré par useEffect ou submit */ };
    const handleCategoryChange = (e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }; // Reset page ici
    const handleSortChange = (e) => { setSortOption(e.target.value); /* La page sera reset par effet sur filteredProducts */ };
    // Removed unused handlers for price filters as they're commented out in the FiltersBar props

    // --- AJOUT DE handleSearchSubmit ---
    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Empêche le rechargement de la page
        // Met à jour l'URL avec le terme de recherche, ce qui déclenchera le useFilteredProducts
        updateQuery(buildNextQuery({ search: searchTerm || undefined }));
        // setCurrentPage(1) est implicitement géré par buildNextQuery qui enlève 'page'
    };
    // ------------------------------------

    // Handlers pour Modals
    const handleShowAddModal = () => { openProductModal({ imgPreview: PLACEHOLDER_IMAGE }); };
    const handleShowEditModal = useCallback((product) => { openProductModal(product); }, [openProductModal]);
    const handleShowPreviewModal = (product) => { openPreviewModal(product); };

    // Handler pour soumission ProductModal
    const handleSubmitProductModal = async (event) => {
        event.preventDefault();
        const formData = currentProductData;
        if (!formData.name || !formData.category || formData.price === '' || formData.stock === '') { alert('Champs obligatoires (*)'); return; }

        let finalImageUrl = formData.img || '';
        if (formData.imgFile) {
            console.log("Simul Upload:", formData.imgFile.name); finalImageUrl = formData.imgPreview;
             // finalImageUrl = await uploadImageApi(formData.imgFile); // Appel API réel
        }

        const productDataToSave = { /* ... construire l'objet ... */ img: finalImageUrl };
        if (!productDataToSave.id) delete productDataToSave.id;

        try {
            let savedProduct;
            if (formData.id) { savedProduct = await updateProduct(formData.id, productDataToSave); alert('Produit mis à jour!'); }
            else { savedProduct = await addProduct(productDataToSave); alert('Produit ajouté!'); }

            // Mieux recalculer les stats APRES la mise à jour de l'état products
             const currentProductList = formData.id
                ? products.map(p => (p.id || p._id) === (savedProduct.id || savedProduct._id) ? savedProduct : p)
                : [...products, savedProduct];
             setShopStats(calculateShopStats(currentProductList)); // Recalcul direct

            closeProductModal();
        } catch (error) { console.error("Erreur sauvegarde:", error); alert(`Erreur: ${error?.message || 'Sauvegarde échouée'}`); }
    };

    // Handler pour suppression
    const handleDeleteProductClick = async (productId, productName) => {
        if (window.confirm(`Supprimer "${productName}" ?`)) {
            try {
                await deleteProduct(productId, productName);
                alert('Produit supprimé!');
                 // Recalculer les stats globales après suppression
                setShopStats(calculateShopStats(products.filter(p => (p.id || p._id) !== productId)));
            } catch (error) { console.error("Erreur suppression:", error); alert(`Erreur: ${error?.message || 'Suppression échouée'}`); }
        }
    };

    // --- Handlers pour CategoryModal (Placeholders) ---
    const handleAddCategory = (newCategoryName) => { console.log("TODO: Ajouter catégorie:", newCategoryName); };
    const handleUpdateCategory = (oldName, newName) => { console.log("TODO: Modifier catégorie:", oldName, "->", newName); };
    const handleDeleteCategory = (categoryName) => { console.log("TODO: Supprimer catégorie:", categoryName); };
    // --------------------------------------------------

    // Handlers passés à ProductModal
    const handleInputChange = (e) => { const { name, value } = e.target; let pValue = value; if (['price', 'stock', 'ratings', 'ratingsCount'].includes(name)) { pValue = value === '' ? '' : Number(value); } setCurrentProductData(prev => prev ? ({ ...prev, [name]: pValue }) : null ); };
    const handleImageUpload = (e) => { const file = e.target.files[0]; if (!file) return; /* ... validation ... */ const reader = new FileReader(); reader.onloadend = () => { setCurrentProductData(prev => prev ? ({ ...prev, imgPreview: reader.result, imgFile: file, img: '' }) : null); }; reader.readAsDataURL(file); };
    const handleImageRemove = () => { setCurrentProductData(prev => prev ? ({ ...prev, imgPreview: PLACEHOLDER_IMAGE, imgFile: null, img: '' }) : null); };
    const handleViewOnShop = (productId) => { window.open(`/shop/${productId}`, '_blank'); };
    const updateProductStatsWrapper = (productId) => { const product = products.find(p => (p.id || p._id) === productId); if(product) { updateHistoryAndStats(productId, 'Stats Refresh', 'Mise à jour manuelle stats', product); } };


    // Effet pour ouvrir le modal d'édition
    useEffect(() => { if (products.length > 0 && editProductId && !isProductModalOpen) { const productToEdit = products.find(p => (p.id || p._id)?.toString() === editProductId.toString()); if (productToEdit) { handleShowEditModal(productToEdit); } else { console.warn(`Produit ${editProductId} non trouvé`); router.push('/admin/products', undefined, { shallow: true }); } } }, [editProductId, products, handleShowEditModal, router, isProductModalOpen]);


    // --- Rendu JSX ---
    return (
        <div>
            <PageHeader title="Gestion des Produits" curPage="Admin / Produits" />

            {/* Section Statistiques */}
            <Container fluid className="py-4">
                <Row>
                     {/* ... Col et composants Stats ... */}
                      <Col xl={8} className="mb-4">
                          <Row>
                              <Col lg={12} className="mb-4"> <StatsOverview stats={shopStats} isLoading={isLoadingData || isMutating} /> </Col>
                              <Col lg={12} className="mb-4 mb-xl-0"> <SalesTrendChart salesTrend={shopStats?.salesTrend} isLoading={isLoadingData || isMutating} /> </Col>
                          </Row>
                      </Col>
                      <Col xl={4}>
                          <Row>
                              <Col lg={12} md={6} className="mb-4"> <MostViewedProducts products={mostViewed} isLoading={loadingMostViewed} /> </Col>
                              <Col lg={12} md={12} className="mb-4 mb-xl-0"> <BestSellingProducts products={bestSelling} isLoading={loadingBestSelling} /> </Col>
                          </Row>
                      </Col>
                </Row>
            </Container>

            {/* Section Principale : Filtres et Tableau */}
            <Container fluid className="pt-0 pb-4">
                <Card className="shadow-sm mb-4">
                    <Card.Body>
                        <FiltersBar
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            onSearchSubmit={handleSearchSubmit} // <<< Passer le handler défini
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                            availableCategories={availableCategories}
                            sortOption={sortOption}
                            onSortChange={handleSortChange}
                            // Props Prix optionnelles si gérées dans FiltersBar
                            // priceRange={priceRange}
                            // onPriceRangeChange={handlePriceRangeChange}
                            // onApplyPriceFilter={applyPriceFilter}
                            // onResetPriceFilter={resetPriceFilter}
                            onAddProduct={handleShowAddModal}
                            onManageCategories={openCategoryModal}
                        />
                    </Card.Body>
                </Card>

                <ProductsTable
                    products={currentItems}
                    isLoading={isLoadingData || isMutating}
                    error={dataError || mutationError}
                    indexOfFirstItem={indexOfFirstItem}
                    onEdit={handleShowEditModal}
                    onDelete={handleDeleteProductClick}
                    onPreview={handleShowPreviewModal}
                    onViewOnShop={handleViewOnShop}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </Container>

            {/* Modals */}
            {isProductModalOpen && (
                <ProductModal
                    key={currentProductData?.id || 'new'}
                    show={isProductModalOpen} onHide={closeProductModal} modalTitle={currentProductData?.id ? 'Modifier produit' : 'Ajouter produit'}
                    productData={currentProductData} onFormChange={handleInputChange} onSubmit={handleSubmitProductModal}
                    onImageUpload={handleImageUpload} onImageRemove={handleImageRemove}
                    availableCategories={availableCategories.filter(c => c !== 'Tous')}
                    productHistory={currentProductData?.id ? productHistory[currentProductData.id] : []}
                    productStats={currentProductData?.id ? productStats[currentProductData.id] : null}
                    lastModified={currentProductData?.lastModified}
                    onViewOnShop={handleViewOnShop}
                    onRefreshStats={() => updateProductStatsWrapper(currentProductData?.id)}
                    isSubmitting={isMutating} // Passer état mutation
                />
            )}
            {isCategoryModalOpen && ( <CategoryModal show={isCategoryModalOpen} onHide={closeCategoryModal} availableCategories={availableCategories.filter(c => c !== 'Tous')} onAddCategory={handleAddCategory} onUpdateCategory={handleUpdateCategory} onDeleteCategory={handleDeleteCategory} products={products} /* ... autres props si besoin ... */ /> )}
            {isPreviewModalOpen && ( <PreviewModal show={isPreviewModalOpen} onHide={closePreviewModal} product={previewProductData} onEdit={() => { closePreviewModal(); handleShowEditModal(previewProductData); }} /> )}

        </div>
    );
};

export default ProductManagement;