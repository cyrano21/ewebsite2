// pages/Home/AppSection.jsx
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
// Assurez-vous que ces imports pointent vers les images RÉELLES des badges si vous les utilisez,
// sinon utilisez les chemins directs comme dans l'exemple ci-dessous.
// import { app01, app02 } from "../../utils/imageImports";

// --- CORRECTION CI-DESSOUS POUR CORRESPONDRE À L'IMAGE FOURNIE ---
// Importer les images de caméra et chaussure si elles proviennent de là
// Utiliser les imports d'images existants ou des chemins absolus
import cameraImage from '../../public/assets/app-store-badge.png';
import shoeImage from '../../public/assets/google-play-badge.png';


const btnText = "Inscrivez-vous gratuitement";
const title = "Apprenez à tout moment, n'importe où";
const desc =
  "Suivez nos cours sur n'importe quel appareil avec notre application et apprenez quand vous le voulez. Téléchargez, installez et commencez à apprendre";

// Configuration animation (inchangée pour les autres éléments)
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  },
};

export default function AppSection() {
  return (
    <section className="relative app-section py-20 md:py-28 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto text-center px-4 max-w-4xl relative z-10">

        {/* --- CORRECTION DU STYLE DU BOUTON ICI --- */}
        {/* 
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-10 md:mb-12"
        >
            <Link 
              href="/signup" 
              className="inline-block px-5 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 transition-colors duration-200"
            >
                {btnText}
            </Link>
        </motion.div>
        */}
        {/* --- FIN CORRECTION DU STYLE DU BOUTON --- */}


        {/* Titre (Style "professionnel" précédent conservé) */}
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 md:mb-8"
        >
            {title}
        </motion.h2>

        {/* Description (Style "professionnel" précédent conservé) */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-lg md:text-xl text-gray-600 mb-12 md:mb-16 max-w-xl lg:max-w-2xl mx-auto leading-relaxed"
        >
            {desc}
        </motion.p>

        {/* --- CORRECTION DES IMAGES ICI --- */}
        {/* Conteneur pour les IMAGES (caméra/chaussure) */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8"
        >
          {/* Image Caméra */}
          <div className="w-40 h-auto"> {/* Contrôle la taille si nécessaire */}
            <Image
              src={cameraImage} // Utilise l'import de l'image de la caméra
              alt="Appareil photo"
              width={160} // Ajustez la taille d'affichage souhaitée
              height={107} // Ajustez la taille d'affichage souhaitée (maintenir ratio)
              className="object-contain" // Assure que l'image entière est visible
            />
          </div>

          {/* Image Chaussure */}
           <div className="w-40 h-auto"> {/* Contrôle la taille si nécessaire */}
             <Image
               src={shoeImage} // Utilise l'import de l'image de la chaussure
               alt="Chaussure homme"
               width={160} // Ajustez la taille d'affichage souhaitée
               height={200} // Ajustez la taille d'affichage souhaitée (maintenir ratio)
               className="object-contain"
             />
           </div>
        </motion.div>
        {/* --- FIN CORRECTION DES IMAGES --- */}

      </div>

      {/* Éléments décoratifs (conservés) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 opacity-50 pointer-events-none">
         <span className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50 rounded-full blur-3xl animate-pulse animation-delay-1000"></span>
        <span className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-50 rounded-full blur-3xl animate-pulse animation-delay-3000"></span>
      </div>
    </section>
  );
}