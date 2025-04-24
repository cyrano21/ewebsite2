import { uploadImage } from '../../../src/config/cloudinary';
import multer from 'multer';
import { createRouter } from 'next-connect';

// Configuration de multer pour le stockage temporaire des fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Configuration du gestionnaire d'API avec next-connect
const router = createRouter();

// Middleware pour gérer les erreurs
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Route pour l'upload d'image
router.post(async (req, res) => {
  try {
    // utilser multer pour traiter le fichier
    await runMiddleware(req, res, upload.single('image'));
    
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }
    
    // Uploader l'image vers Cloudinary
    const result = await uploadImage(req.file.buffer);
    
    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload d\'image:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'upload d\'image' });
  }
});

// Configuration pour Next.js API route
export const config = {
  api: {
    bodyParser: false, // Désactiver le parser de corps par défaut de Next.js pour utilser multer
  },
};

export default router.handler();
