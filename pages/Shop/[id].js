import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import Link from "next/link";

import Layout from "../../components/Layout";
import { AuthContext } from "../../contexts/AuthProvider";

// --- IMPORT YOUR ACTUAL PRODUCT DATA ---
import {
    topDealsProducts,
    topElectronicProducts,
    bestOfferProducts,
    allProducts,
    suggestedProducts, // Importé pour l'exemple BoughtTogether
} from '../../data/e-commerce/products'; // <--- VÉRIFIEZ CE CHEMIN

// --- Import the new components ---
import ProductImageGallery from "../../components/shop/ProductImageGallery";
import ProductInfo from "../../components/shop/ProductInfo";
import ProductTabs from "../../components/shop/ProductTabs";
import BoughtTogether from "../../components/shop/BoughtTogether";
import SimilarProducts from "../../components/shop/SimilarProducts";

// --- UPDATED DATA FETCH FUNCTION ---
const fetchProductData = async (id) => {
    console.log(`Fetching data for product ID: ${id}`);

    // Combine all relevant product arrays into one master list
    const allProductData = [
        ...topDealsProducts,
        ...topElectronicProducts,
        ...bestOfferProducts,
        ...allProducts,
    ];

    // Find the product by ID (compare as strings)
    const foundProduct = allProductData.find(p => String(p.id) === String(id));

    if (foundProduct) {
        console.log("Found product in local data:", foundProduct);

        // --- EXEMPLE DONNÉES PLUS RICHES (Basé sur les données trouvées et des exemples) ---
        const exampleThumbnails = [
            foundProduct.image || '/assets/images/placeholder.jpg', // Image principale
            // Ajoutez d'autres chemins d'images réelles si disponibles pour ce produit
            // Sinon, laissez juste l'image principale ou ajoutez des placeholders
             '/assets/images/products/02.jpg', // Exemple statique - A remplacer par de vraies données si possible
             '/assets/images/products/03.jpg', // Exemple statique - A remplacer par de vraies données si possible
        ];

        // TODO: Implémenter une vraie logique pour les couleurs/tailles si elles existent
        const exampleColors = [
             { name: "Blue", hex: "#a0ced9", img: foundProduct.image }, // Adaptez si d'autres images existent
             { name: "Green", hex: "#a8e6cf" },
             // ... ajoutez d'autres couleurs si applicable pour ce produit
        ];
        const exampleSizes = ['44', '45', '46']; // Exemple statique - A remplacer par de vraies données

        // TODO: Implémenter une vraie logique pour les badges
        const exampleBadges = [
            '#1 Best seller', // Exemple statique
            foundProduct.offer ? `${foundProduct.offer} Off` : 'Popular Item', // Badge basé sur l'offre
        ];

        const exampleStock = 15; // TODO: Utiliser une vraie valeur de stock si disponible
        const exampleDelivery = "Saturday, July 29th"; // TODO: Calculer une vraie date
        const exampleOfferEnd = foundProduct.dealEndTime ? new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString() : null; // Exemple

        const exampleDescription = `Sample description for ${foundProduct.name}. Highlighting its key features and benefits. Replace with actual product description.`; // TODO: Utiliser une vraie description
        const exampleSpecs = ["Feature 1", "Specification 2", "Detail 3"]; // TODO: Utiliser de vraies specs
        const exampleReviews = [ // TODO: Utiliser de vrais avis
             { id: 1, user: "Jane D.", rating: 5, comment: "Amazing machine!", date: "2023-07-15" },
             { id: 2, user: "John S.", rating: 4, comment: "Very good, but expensive.", date: "2023-07-10" }
         ];

        // --- Logique d'exemple pour les produits liés/similaires ---
        // Bought Together: Prend les 3 premiers suggérés (sauf le produit courant)
        const relatedBoughtTogether = suggestedProducts
            .filter(p => String(p.id) !== String(foundProduct.id)) // Exclut le produit courant
            .slice(0, 3) // Prend les 3 premiers
            .map(p => ({ // S'assure que le format correspond à BoughtTogetherItem
                id: String(p.id),
                name: p.name,
                price: p.price,
                img: p.img // Le chemin doit être correct dans products.ts
            }));

        // Similar Products: Prend les 4 premiers top deals (sauf le produit courant)
        const relatedSimilarProducts = topDealsProducts
             .filter(p => String(p.id) !== String(foundProduct.id)) // Exclut le produit courant
             .slice(0, 4) // Prend les 4 premiers
             .map(p => ({ // S'assure que le format correspond à ProductCarouselCard
                id: String(p.id),
                name: p.name,
                price: p.price,
                salePrice: p.salePrice,
                img: p.image, // Le chemin doit être correct dans products.ts
                ratings: p.rating,
                ratingsCount: p.rated
             }));
        // --- FIN LOGIQUE D'EXEMPLE ---

        // Assemblage de l'objet final passé au composant
        const formattedProduct = {
            id: String(foundProduct.id),
            name: foundProduct.name || "Unnamed Product",
            price: typeof foundProduct.price === 'number' ? foundProduct.price : (typeof foundProduct.salePrice === 'number' ? foundProduct.salePrice : 0),
            salePrice: typeof foundProduct.salePrice === 'number' ? foundProduct.salePrice : undefined,
            img: foundProduct.image, // Chemin corrigé dans products.ts
            // Utilisation des données d'exemple ou des valeurs par défaut
            thumbnails: exampleThumbnails,
            ratings: typeof foundProduct.rating === 'number' ? foundProduct.rating : 4.5,
            ratingsCount: typeof foundProduct.rated === 'number' ? foundProduct.rated : 0, // Utiliser 0 si non défini
            categoryBreadcrumbs: ["Shop", "Example Category", foundProduct.name.substring(0, 20) + "..."], // TODO: Vraie logique de catégorie
            badges: exampleBadges,
            stock: exampleStock,
            deliveryEstimate: exampleDelivery,
            specialOfferEndDate: exampleOfferEnd,
            colors: exampleColors,
            sizes: exampleSizes,
            description: exampleDescription,
            specifications: exampleSpecs,
            reviews: exampleReviews,
            boughtTogether: relatedBoughtTogether,
            similarProducts: relatedSimilarProducts,
       };

        console.log("Formatted product data:", formattedProduct);
        return formattedProduct;

    } else {
        console.warn(`Product with ID ${id} not found.`);
        return null; // Important de retourner null si non trouvé
    }
};


// --- DÉFINITION DU COMPOSANT ProductPage ---
const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- États pour les interactions utilisateur ---
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [boughtTogetherChecked, setBoughtTogetherChecked] = useState({});

    const { user } = useContext(AuthContext); // Contexte d'authentification

    // --- Effet pour charger les données du produit ---
    useEffect(() => {
        // Ne rien faire si l'ID n'est pas encore disponible
        if (!id) return;

        const loadProduct = async () => {
            setLoading(true);
            setError(null);
            setProduct(null);
            // Réinitialiser les états d'interaction
            setQuantity(1);
            setSelectedColor(null);
            setSelectedSize(null);
            setSelectedImage(null);
            setBoughtTogetherChecked({});

            try {
                const data = await fetchProductData(id); // Appel de la fonction mise à jour
                if (data) {
                    setProduct(data);
                    // Initialiser les sélections par défaut
                    setSelectedImage(data.img || data.thumbnails?.[0]);
                    if (data.colors?.length > 0) {
                        setSelectedColor(data.colors[0]);
                        // Mettre à jour l'image si la couleur a une image spécifique
                        if (data.colors[0].img) setSelectedImage(data.colors[0].img);
                    }
                    if (data.sizes?.length > 0) {
                        setSelectedSize(data.sizes[0]);
                    }
                    // Initialiser l'état des checkboxes "Bought Together"
                    const initialBoughtTogether = { [data.id]: true }; // L'article principal est coché
                    data.boughtTogether?.forEach((item) => {
                        if(item && item.id) {
                           initialBoughtTogether[item.id] = false; // Les autres non cochés par défaut
                        }
                    });
                    setBoughtTogetherChecked(initialBoughtTogether);

                } else {
                     setError("Product not found."); // Définir l'erreur si aucune donnée n'est retournée
                }
            } catch (err) {
                console.error("Failed to load product:", err);
                setError(err.message || "Failed to load product."); // Gérer les erreurs de fetch
            } finally {
                setLoading(false); // Arrêter le chargement dans tous les cas
            }
        };

        loadProduct();
    }, [id]); // Ré-exécuter l'effet si l'ID change

    // --- Calculs mémorisés pour éviter les re-calculs inutiles ---
    const discount = useMemo(() => {
        if (!product || !product.salePrice || !product.price || product.price <= 0) return 0;
        const priceNum = Number(product.price);
        const salePriceNum = Number(product.salePrice);
        if (isNaN(priceNum) || isNaN(salePriceNum) || priceNum <= 0) return 0;
        return Math.round(((priceNum - salePriceNum) / priceNum) * 100);
    }, [product]);

    const totalBoughtTogetherPrice = useMemo(() => {
        if (!product || !product.id) return '0.00';
        let total = 0;
        const mainPrice = Number(product.salePrice || product.price || 0);
        if (boughtTogetherChecked[product.id] && !isNaN(mainPrice)) {
             total += mainPrice;
        }
        product.boughtTogether?.forEach((item) => {
            if (item && item.id && boughtTogetherChecked[item.id]) {
                 const itemPrice = Number(item.price || 0);
                 if(!isNaN(itemPrice)) {
                     total += itemPrice;
                 }
            }
        });
        return total.toFixed(2);
    }, [product, boughtTogetherChecked]);


    // --- Fonctions de rappel pour les interactions utilisateur ---
    const handleThumbnailSelect = useCallback((url) => {
        setSelectedImage(url);
    }, []);

    const handleColorSelect = useCallback((color) => {
        setSelectedColor(color);
        if (color?.img) {
            setSelectedImage(color.img);
        } else if (product?.img) {
            setSelectedImage(product.img);
        }
    }, [product]); // Dépend de product pour l'image par défaut

    const handleSizeSelect = useCallback((size) => {
        setSelectedSize(size);
    }, []);

    const handleQuantityChange = useCallback((newQuantity) => {
        const maxQty = typeof product?.stock === 'number' ? product.stock : 1;
        const validQuantity = Math.max(1, Math.min(newQuantity, maxQty));
        setQuantity(validQuantity);
    }, [product?.stock]); // Dépend du stock du produit

    const handleToggleBoughtTogether = useCallback((itemId) => {
        if(!itemId) return;
        setBoughtTogetherChecked((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    }, []);

    // --- Fonctions pour Ajouter au Panier / Wishlist (Logique à implémenter) ---
    const handleAddToCart = useCallback(() => {
        if (!product) return;
        // TODO: Remplacer alert par la vraie logique (contexte panier, API, etc.)
        alert(`Ajouté ${quantity} x ${product.name} (Couleur: ${selectedColor?.name || 'N/A'}, Taille: ${selectedSize || 'N/A'}) au panier.`);
        // Exemple: dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, selectedColor, selectedSize } });
    }, [product, quantity, selectedColor, selectedSize]);

    const handleAddToWishlist = useCallback(() => {
        if (!product) return;
         // TODO: Remplacer alert par la vraie logique (contexte wishlist, API, etc.)
        alert(`Ajouté ${product.name} à la wishlist.`);
         // Exemple: addToWishlist(product);
    }, [product]);


    // --- Logique de Rendu ---

    // Affichage pendant le chargement
    if (loading) {
        return (
            <Layout>
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            </Layout>
        );
    }

    // Affichage en cas d'erreur
    if (error) {
        return (
             <Layout>
                <Container className="text-center py-5 mt-5">
                    <p className="text-danger fs-5 mb-4">{error}</p>
                     {/* Lien corrigé avec legacyBehavior */}
                    <Link href="/shop" passHref legacyBehavior>
                        <Button as="a" variant="primary">Retour à la boutique</Button>
                    </Link>
                </Container>
            </Layout>
        );
    }

    // Affichage si le produit n'est pas trouvé (après chargement)
    if (!product || !product.id) {
         return (
            <Layout>
                <Container className="text-center py-5 mt-5">
                    <p className="text-danger fs-5 mb-4">Produit introuvable.</p>
                     {/* Lien corrigé avec legacyBehavior */}
                     <Link href="/shop" passHref legacyBehavior>
                        <Button as="a" variant="primary">Retour à la boutique</Button>
                     </Link>
                 </Container>
            </Layout>
         );
    }

    // --- Rendu Principal de la Page Produit ---
    return (
        <>
            <Head>
                <title>{`${product.name || 'Product'} | Ma Boutique`}</title> {/* Adaptez le titre */}
                <meta name="description" content={product.description?.substring(0, 160) || `Détails pour ${product.name || 'Product'}`} />
            </Head>
            <Container className="product-page-container pt-4 pb-5">
                {/* Fil d'Ariane (Breadcrumbs) */}
                <nav aria-label="breadcrumb" className="mb-3">
                    <ol className="breadcrumb small text-muted mb-0">
                         <li className="breadcrumb-item">
                            <Link href="/" passHref legacyBehavior><a>Accueil</a></Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/shop" passHref legacyBehavior><a>Boutique</a></Link>
                        </li>
                         {/* Utilisation des données formatées */}
                         {product.categoryBreadcrumbs?.map((crumb, index, arr) => (
                            <li key={index} className={`breadcrumb-item ${index === arr.length - 1 ? 'active' : ''}`} aria-current={index === arr.length - 1 ? 'page' : undefined}>
                                {index === arr.length - 1 ? (
                                    crumb
                                ) : (
                                    <Link href={`/category/${String(crumb).toLowerCase().replace(/ /g, '-')}`} passHref legacyBehavior><a>{crumb}</a></Link>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Section Principale Produit (Image + Infos) */}
                <Row className="mb-4 main-product-section">
                    <ProductImageGallery
                        thumbnails={product.thumbnails}
                        selectedImage={selectedImage}
                        onThumbnailSelect={handleThumbnailSelect}
                        productName={product.name}
                        discount={discount}
                        stock={product.stock}
                    />
                    <ProductInfo
                        product={product} // Passe l'objet produit complet formaté
                        selectedColor={selectedColor}
                        onColorSelect={handleColorSelect}
                        selectedSize={selectedSize}
                        onSizeSelect={handleSizeSelect}
                        quantity={quantity}
                        onQuantityChange={handleQuantityChange}
                        discount={discount}
                    />
                </Row>

                {/* Boutons d'Action (Ajout Panier / Wishlist) */}
                 <Row className="mb-5 action-buttons-row"> {/* Marge augmentée */}
                     <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2}} >
                         <div className="d-grid gap-3 d-sm-flex"> {/* Espace augmenté */}
                             <Button
                                 variant="outline-secondary"
                                 size="lg"
                                 className="flex-fill py-2" // Padding vertical ajusté
                                 onClick={handleAddToWishlist}
                                 aria-label="Ajouter à la liste de souhaits"
                             >
                                 <i className="icofont-heart me-2" />
                                 Liste de souhaits
                             </Button>
                             <Button
                                 variant="warning" // Ou "primary" selon votre thème
                                 size="lg"
                                 className="flex-fill py-2 fw-bold" // Texte en gras
                                 onClick={handleAddToCart}
                                 disabled={!product || typeof product.stock !== 'number' || product.stock <= 0}
                                 aria-label="Ajouter au panier"
                             >
                                 <i className="icofont-shopping-cart me-2" />
                                 {!product || typeof product.stock !== 'number' || product.stock <= 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                             </Button>
                         </div>
                     </Col>
                 </Row>


                {/* Section Inférieure (Onglets & Produits Liés/Similaires) */}
                <Row className="mt-4 description-tabs-section">
                    {/* Colonne des Onglets */}
                    <Col lg={8} className="mb-4 mb-lg-0">
                        <ProductTabs
                            description={product.description}
                            specifications={product.specifications}
                            reviews={product.reviews}
                        />
                    </Col>

                    {/* Colonne "Achetés Ensemble" */}
                    <Col lg={4}>
                         {product.boughtTogether && product.boughtTogether.length > 0 && (
                            <BoughtTogether
                                mainProduct={product}
                                relatedItems={product.boughtTogether}
                                checkedItems={boughtTogetherChecked}
                                onToggleItem={handleToggleBoughtTogether}
                                total={totalBoughtTogetherPrice}
                             />
                        )}
                         {/* Autres éléments potentiels de la sidebar ici */}
                    </Col>
                </Row>

                {/* Section Produits Similaires */}
                <SimilarProducts
                    products={product.similarProducts}
                    categorySlug={product.categoryBreadcrumbs?.[1]?.toLowerCase().replace(/ /g, '-') || 'all'} // Utilise 2e élément du breadcrumb si dispo
                 />

            </Container>
            {/* Styles Globaux pour la page */}
            <style jsx global>{`
                /* --- Styles Généraux --- */
                .pointer { cursor: pointer; }

                /* --- Gallerie Image --- */
                .thumbnail-column .img-thumbnail {
                    width: 60px; height: 60px; object-fit: contain; border-width: 1px; padding: 2px; transition: border-color 0.2s ease;
                }
                 .mobile-thumbnails .img-thumbnail {
                     width: 50px; height: 50px; object-fit: contain; border-width: 1px; padding: 2px; transition: border-color 0.2s ease;
                }
                .active-thumbnail, .thumbnail-column .img-thumbnail:hover, .mobile-thumbnails .img-thumbnail:hover {
                    border-color: var(--bs-primary) !important;
                }
                .main-product-image {
                    max-height: 450px; width: 100%; object-fit: contain; background-color: #f8f9fa; border-radius: var(--bs-border-radius);
                }
                .main-image-card { border: none; }
                .discount-badge { font-size: 0.8rem; padding: 0.3em 0.6em; font-weight: 500; }
                .out-of-stock-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255, 255, 255, 0.7); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--bs-danger); border-radius: var(--bs-border-radius); }

                /* --- Infos Produit --- */
                .color-swatch { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #dee2e6; box-shadow: 0 0 0 1px rgba(0,0,0,0.1); transition: all 0.2s ease-in-out; }
                .color-swatch:hover { transform: scale(1.1); border-color: #aaa; }
                .color-swatch.selected { box-shadow: 0 0 0 3px var(--bs-primary); border-color: #fff; transform: scale(1.1); }
                .product-title { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
                .badge-custom { background-color: var(--bs-success-bg-subtle) !important; color: var(--bs-success-text-emphasis) !important; border: 1px solid var(--bs-success-border-subtle) !important; font-weight: 500; }
                .quantity-input { max-width: 50px; -moz-appearance: textfield; }
                .quantity-input::-webkit-outer-spin-button, .quantity-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .rating-section i { font-size: 1.1em; } /* Etoiles un peu plus grandes */
                .price-section .h3 { font-size: 1.8rem; } /* Prix principal plus grand */

                /* --- Bought Together --- */
                .bought-together-card { background: #f8f9fa; border: none; border-radius: var(--bs-card-border-radius); }
                .object-fit-contain { object-fit: contain; }
                .text-truncate-2-lines { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.3em; max-height: 2.6em; }

                /* --- Onglets (Tabs) --- */
                #product-details-tabs .nav-link { flex: 1 1 auto; text-align: center; color: var(--bs-gray-600); font-weight: 500; }
                #product-details-tabs .nav-link.active { color: var(--bs-primary); border-bottom-color: var(--bs-primary) !important; }
                .tab-content > .tab-pane { padding: 1.5rem 0.5rem; } /* Padding ajusté */

                /* --- Breadcrumbs --- */
                .breadcrumb-item + .breadcrumb-item::before { content: ">"; padding-right: var(--bs-breadcrumb-item-padding-x); padding-left: var(--bs-breadcrumb-item-padding-x); color: var(--bs-gray-500); }
                .breadcrumb a { color: var(--bs-primary); text-decoration: none; }
                .breadcrumb a:hover { text-decoration: underline; }
                .breadcrumb-item.active { color: var(--bs-gray-700); font-weight: 500; }

                /* --- Styles Carousel (déplacés depuis ProductCarousel.js pour centralisation) --- */
                 .product-carousel-container::-webkit-scrollbar { display: none; }
                 .product-carousel-container { scrollbar-width: none; -ms-overflow-style: none; }

                .product-card-similar {
                    border-radius: 0.5rem; /* Bords arrondis */
                    border-color: var(--bs-border-color-translucent);
                    transition: all 0.2s ease-in-out;
                    background-color: var(--bs-body-bg); /* Assure fond blanc/thème */
                     box-shadow: var(--bs-box-shadow-sm); /* Ombre légère par défaut */
                }

                .product-card-similar:hover {
                    transform: translateY(-4px); /* Effet de lévitation */
                    box-shadow: var(--bs-box-shadow); /* Ombre plus prononcée */
                    border-color: var(--bs-border-color);
                }

                .product-card-img-container {
                    height: 160px; /* Hauteur fixe pour l'image */
                    background-color: #f8f9fa; /* Fond léger pour l'image */
                    overflow: hidden; /* Cache ce qui dépasse */
                    position: relative; /* Pour positionner les éléments absolus */
                    border-top-left-radius: 0.5rem; /* Arrondi haut */
                    border-top-right-radius: 0.5rem;
                }
                /* Centrage pour layout fill de next/image */
                .product-card-img-container > span { display: block !important; }

                .similar-product-title {
                    font-size: 0.9rem;
                    font-weight: 500;
                    line-height: 1.3;
                    height: 2.6em; /* Approx 2 lignes */
                    color: var(--bs-body-color); /* Assure couleur texte correcte */
                }
                .fs-xs { font-size: 0.75rem; }

                 /* Actions qui apparaissent au survol */
                 .product-card-actions { position: absolute; bottom: 8px; right: 8px; opacity: 0; transition: opacity 0.2s ease-in-out; }
                 .product-card-similar:hover .product-card-actions { opacity: 1; }
                 .add-to-cart-btn { font-size: 0.8rem; padding: 0.25rem 0.6rem; }

            `}</style>
        </>
    );
};

// --- Assignation du Layout ---
ProductPage.getLayout = (page) => <Layout>{page}</Layout>;

// --- Exportation du Composant Page ---
export default ProductPage;