/**
 * Utilitaires génériques pour l'application e-commerce
 */

// Formater un prix avec le symbole de devise
export const formatPrice = (price, currency = 'EUR', locale = 'fr-FR') => {
  if (price === undefined || price === null) return '';
  return Number(price).toLocaleString(locale, {
    style: 'currency',
    currency: currency
  });
};

// Calculer le prix total avec TVA
export const calculateTotalWithTax = (price, quantity = 1, taxRate = 20) => {
  const totalBeforeTax = price * quantity;
  const taxAmount = (totalBeforeTax * taxRate) / 100;
  return totalBeforeTax + taxAmount;
};

// Calculer le montant de la remise
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0;
  return originalPrice - discountedPrice;
};

// Calculer le pourcentage de remise
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// Vérifier si un objet est vide
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

// Tronquer un texte avec des points de suspension
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Générer une chaîne de caractères aléatoire
export const generateRandomString = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Formater une date
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaultOptions = { 
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric' 
  };
  const dateOptions = { ...defaultOptions, ...options };
  return new Date(date).toLocaleDateString('fr-FR', dateOptions);
};

// Formater un numéro de téléphone français
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Supprimer tous les caractères non numériques
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Vérifier si le numéro est valide (10 chiffres pour la France)
  if (cleaned.length !== 10) return phoneNumber;
  
  // Formater comme XX XX XX XX XX
  return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
};

// Valider une adresse email
export const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Valider un code postal français
export const isValidFrenchZipCode = (zipCode) => {
  const re = /^[0-9]{5}$/;
  return re.test(String(zipCode));
};

// Formater les adresses pour l'affichage
export const formatAddress = (address) => {
  if (!address) return '';
  
  const {
    firstName = '',
    lastName = '',
    street = '',
    zipCode = '',
    city = '',
    country = '',
    phone = ''
  } = address;
  
  let formattedAddress = '';
  
  if (firstName || lastName) {
    formattedAddress += `${firstName} ${lastName}\n`;
  }
  
  if (street) {
    formattedAddress += `${street}\n`;
  }
  
  if (zipCode || city) {
    formattedAddress += `${zipCode} ${city}\n`;
  }
  
  if (country) {
    formattedAddress += `${country}\n`;
  }
  
  if (phone) {
    formattedAddress += `Tél: ${formatPhoneNumber(phone)}`;
  }
  
  return formattedAddress;
};

// Obtenir les noms des jours de la semaine
export const getDaysOfWeek = (locale = 'fr-FR') => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(2021, 10, i + 1).toLocaleDateString(locale, { weekday: 'long' }));
  }
  return days;
};

// Obtenir les noms des mois
export const getMonthsOfYear = (locale = 'fr-FR') => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Date(2021, i, 1).toLocaleDateString(locale, { month: 'long' }));
  }
  return months;
};

// Calculer le total du panier
export const calculateCartTotal = (cartItems = []) => {
  if (!cartItems.length) return 0;
  
  return cartItems.reduce((total, item) => {
    const itemPrice = item.discountPrice !== undefined ? item.discountPrice : item.price;
    return total + (itemPrice * (item.quantity || 1));
  }, 0);
};

// Calculer le nombre total d'articles dans le panier
export const calculateCartItemsCount = (cartItems = []) => {
  if (!cartItems.length) return 0;
  
  return cartItems.reduce((count, item) => {
    return count + (item.quantity || 1);
  }, 0);
};

// Convertir une couleur hexadécimale en RGBa
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return '';
  
  // Supprimer le # si présent
  hex = hex.replace('#', '');
  
  // Convertir en RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Générer une URL de slug à partir d'une chaîne
export const createSlug = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .replace(/[àáâäæãåā]/g, 'a')
    .replace(/[çćč]/g, 'c')
    .replace(/[èéêëēėę]/g, 'e')
    .replace(/[îïíīįì]/g, 'i')
    .replace(/[ôöòóœøōõ]/g, 'o')
    .replace(/[ûüùúū]/g, 'u')
    .replace(/[ÿ]/g, 'y')
    .replace(/[ñń]/g, 'n')
    .replace(/[šś]/g, 's')
    .replace(/[žźż]/g, 'z')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Extraire l'ID d'une vidéo YouTube à partir d'une URL
export const getYoutubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Filtrer et trier des produits
export const filterAndSortProducts = (products, filters = {}, sortOption = '') => {
  if (!products || !products.length) return [];
  
  let filteredProducts = [...products];
  
  // Appliquer les filtres
  if (filters.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === filters.category
    );
  }
  
  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    filteredProducts = filteredProducts.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= min && price <= max;
    });
  }
  
  if (filters.rating) {
    filteredProducts = filteredProducts.filter(product => 
      Math.round(product.rating) >= filters.rating
    );
  }
  
  if (filters.availability) {
    filteredProducts = filteredProducts.filter(product => 
      filters.availability === 'in-stock' ? product.stock > 0 : product.stock === 0
    );
  }
  
  // Appliquer le tri
  if (sortOption) {
    switch (sortOption) {
      case 'price-asc':
        filteredProducts.sort((a, b) => 
          (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => 
          (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      default:
        break;
    }
  }
  
  return filteredProducts;
};

// Fonctions d'export par défaut
export default {
  formatPrice,
  calculateTotalWithTax,
  calculateDiscount,
  calculateDiscountPercentage,
  isEmptyObject,
  truncateText,
  generateRandomString,
  formatDate,
  formatPhoneNumber,
  isValidEmail,
  isValidFrenchZipCode,
  formatAddress,
  getDaysOfWeek,
  getMonthsOfYear,
  calculateCartTotal,
  calculateCartItemsCount,
  hexToRgba,
  createSlug,
  getYoutubeVideoId,
  filterAndSortProducts
};