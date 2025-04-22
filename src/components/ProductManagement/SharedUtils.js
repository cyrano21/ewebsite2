/**
 * Formate un nombre avec séparateur de milliers
 * @param {number|string} num - Valeur à formater
 * @returns {string} Nombre formaté
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

/**
 * Retourne une couleur spécifique pour une catégorie basée sur son index
 * @param {number} index - Index de la catégorie
 * @returns {string} Code couleur HEX
 */
export const getCategoryColor = (index) => {
  const colors = [
    "#0d6efd",
    "#198754",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#fd7e14",
    "#20c997",
    "#d63384",
  ];
  return colors[index % colors.length];
};

/**
 * Tronque un texte et ajoute des points de suspension si nécessaire
 * @param {string} text - Texte à tronquer
 * @param {number} [maxLength=20] - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncateText = (text, maxLength = 20) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Constante pour l'image placeholder
export const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Aper%C3%A7u";
