const cloudinary = require('cloudinary').v2;

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Fonction pour uploader une image sur Cloudinary
 * @param {File|Buffer|String} file - Fichier à uploader (peut être un chemin, un buffer ou un objet File)
 * @param {Object} options - Options supplémentaires pour l'upload
 * @returns {Promise} - Promesse avec les détails du fichier uploadé
 */
const uploadImage = async (file, options = {}) => {
  try {
    // Options par défaut (dossier de destination et gestion des transformations)
    const defaultOptions = {
      folder: 'ewebsite2-francise/blog',
      resource_type: 'auto',
      ...options
    };

    // Upload du fichier
    const result = await cloudinary.uploader.upload(file, defaultOptions);
    return {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('Erreur lors de l\'upload sur Cloudinary:', error);
    throw new Error(`Erreur d'upload: ${error.message}`);
  }
};

/**
 * Fonction pour supprimer une image de Cloudinary
 * @param {String} publicId - ID public de l'image à supprimer
 * @returns {Promise} - Promesse avec le résultat de la suppression
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erreur lors de la suppression sur Cloudinary:', error);
    throw new Error(`Erreur de suppression: ${error.message}`);
  }
};

/**
 * Fonction pour générer une URL de transformation Cloudinary
 * @param {String} publicId - ID public de l'image
 * @param {Object} options - Options de transformation
 * @returns {String} - URL de l'image transformée
 */
const getImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    secure: true,
    ...options
  };
  return cloudinary.url(publicId, defaultOptions);
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getImageUrl
};
