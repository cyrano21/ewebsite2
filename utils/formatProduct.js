// utilitaire de formatage des produits pour l'API et le front
export function formatProduct(raw) {
  const thumbnails = [
    raw.imageUrl || raw.image || '/assets/images/placeholder.jpg',
    ...((raw.images || []).slice(0, 2)),
  ];
  const formatted = {
    id: raw._id || raw.id,
    name: raw.name || 'Unnamed Product',
    price: raw.price || 0,
    salePrice: raw.discountPrice || raw.salePrice || 0,
    img: raw.imageUrl || raw.image || '/assets/images/placeholder.jpg',
    thumbnails,
    seller: raw.seller || '',
    shipping: raw.shipping || 0,
    quantity: raw.quantity || 0,
    tags: raw.tags || [],
    category: typeof raw.category === 'object' ? raw.category.name : raw.category || '',
    cloudinaryId: raw.cloudinaryId || '',
    ratings: raw.rating || raw.ratings || 0,
    ratingsCount: raw.rated || 0,
    categoryBreadcrumbs: ['Shop', typeof raw.category === 'object' ? raw.category.name : raw.category || 'Products', (raw.name?.substring(0, 20) || '') + '...'],
    badges: raw.badges || [],
    stock: raw.stock || raw.inStock || 0,
    deliveryEstimate: raw.deliveryEstimate || '2-3 days',
    specialOfferEndDate: raw.specialOfferEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    colors: raw.colors || [],
    sizes: raw.sizes || [],
    description: raw.description || `Description détaillée pour ${raw.name}`,
    specifications: raw.specifications || [raw.material, raw.dimensions].filter(Boolean),
    reviews: raw.reviews || [],
    boughtTogether: raw.boughtTogether || [],
    similarProducts: raw.similarProducts || [],
  };
  return formatted;
}
