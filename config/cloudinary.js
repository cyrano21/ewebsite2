// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

// Configuration de Cloudinary
cloudinary.config({
  cloud_name:   process.env.CLOUDINARY_CLOUD_NAME,
  api_key:      process.env.CLOUDINARY_API_KEY,
  api_secret:   process.env.CLOUDINARY_API_SECRET,
  secure:       true,
});

// Fonction pour uploader une image
async function uploadImage(file, options = {}) {
  const defaultOptions = {
    folder: 'ewebsite2-francise/blog',
    resource_type: 'auto',
    ...options,
  };
  const result = await cloudinary.uploader.upload(file, defaultOptions);
  return {
    publicId:      result.public_id,
    url:           result.secure_url,
    format:        result.format,
    width:         result.width,
    height:        result.height,
    resource_type: result.resource_type,
  };
}

// Fonction pour supprimer une image
async function deleteImage(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}

// Fonction pour générer une URL Cloudinary
function getImageUrl(publicId, options = {}) {
  return cloudinary.url(publicId, { secure: true, ...options });
}

// **Une seule** exportation par défaut
module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getImageUrl,
};
