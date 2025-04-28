// pages/api/upload/image.js

const { uploadImage } = require('../../../config/cloudinary');
const multer = require('multer');
const nextConnect = require('next-connect');

// Multer en mémoire pour récupérer req.file.buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// Initialise next-connect
const handler = nextConnect({
  onError(error, req, res) {
    console.error('API Upload Error:', error);
    res.status(500).json({ error: 'Erreur API interne' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  },
});

// Middleware multer
handler.use(upload.single('image'));

// Route POST /api/upload/image
handler.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }
  try {
    const result = await uploadImage(req.file.buffer, {
      folder: 'products',
      resource_type: 'auto',
    });
    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });
  } catch (err) {
    console.error('Erreur lors de l’upload Cloudinary:', err);
    return res.status(500).json({ error: 'Échec de l’upload' });
  }
});

// **Un seul** module.exports !
module.exports = handler;

// Désactive le bodyParser natif (Next.js)
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
