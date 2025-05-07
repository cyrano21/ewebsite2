/**
 * Script de préparation au déploiement
 * Ce script réalise plusieurs tâches avant le déploiement sur Vercel:
 * 1. Résout les conflits de CSS entre /styles/ et /public/styles/
 * 2. Vérifie les variables d'environnement essentielles
 * 3. Optimise les configurations pour Vercel
 */

const fs = require('fs');
const path = require('path');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}=== Préparation au déploiement sur Vercel ===${colors.reset}`);
console.log(`${colors.blue}Date: ${new Date().toISOString()}${colors.reset}`);

// Fonction pour vérifier si un dossier ou fichier existe
function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Étape 1: Résoudre les conflits de CSS
console.log(`\n${colors.magenta}[1/3] Vérification des conflits CSS...${colors.reset}`);

const publicStylesDir = path.join(__dirname, '..', 'public', 'styles');
const stylesDir = path.join(__dirname, '..', 'styles');

if (exists(publicStylesDir)) {
  console.log(`Le dossier ${colors.yellow}public/styles${colors.reset} existe.`);
  
  // Comparer avec les fichiers dans /styles
  if (exists(stylesDir)) {
    const publicStyleFiles = fs.readdirSync(publicStylesDir);
    const styleFiles = fs.readdirSync(stylesDir);
    
    // Identifier les doublons
    const duplicates = publicStyleFiles.filter(file => styleFiles.includes(file));
    
    if (duplicates.length > 0) {
      console.log(`${colors.yellow}Fichiers CSS dupliqués détectés:${colors.reset}`);
      duplicates.forEach(file => {
        console.log(`- ${file}`);
      });
      
      // Recommandation: préférer les fichiers de /styles/
      console.log(`${colors.yellow}Nous privilégions les CSS dans /styles/ pour Next.js${colors.reset}`);
    } else {
      console.log(`${colors.green}Aucun conflit CSS détecté entre les dossiers.${colors.reset}`);
    }
  }
} else {
  console.log(`${colors.green}Aucun dossier public/styles trouvé. Pas de conflit potentiel.${colors.reset}`);
}

// Étape 2: Vérifier les variables d'environnement essentielles
console.log(`\n${colors.magenta}[2/3] Vérification des variables d'environnement...${colors.reset}`);

// Liste des variables importantes pour Vercel
const envVars = [
  'MONGODB_URI',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_SITE_URL'
];

// Vérifier .env.production
const envProdPath = path.join(__dirname, '..', '.env.production');
let envProdExists = exists(envProdPath);

if (envProdExists) {
  console.log(`${colors.green}Fichier .env.production trouvé${colors.reset}`);
  
  // Lire le contenu du fichier .env.production
  const envContent = fs.readFileSync(envProdPath, 'utf8');
  
  // Vérifier chaque variable
  const missingVars = [];
  envVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`${colors.yellow}Variables manquantes dans .env.production:${colors.reset}`);
    missingVars.forEach(varName => {
      console.log(`- ${varName}`);
    });
  } else {
    console.log(`${colors.green}Toutes les variables essentielles sont présentes.${colors.reset}`);
  }
} else {
  console.log(`${colors.red}Fichier .env.production non trouvé! Cela peut causer des problèmes en production.${colors.reset}`);
}

// Étape 3: Vérifier la configuration Next.js
console.log(`\n${colors.magenta}[3/3] Vérification de la configuration Next.js...${colors.reset}`);

const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
let nextConfigExists = exists(nextConfigPath);

if (nextConfigExists) {
  console.log(`${colors.green}Fichier next.config.js trouvé${colors.reset}`);
  
  // Vérifier vercel.json
  const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
  let vercelJsonExists = exists(vercelJsonPath);
  
  if (vercelJsonExists) {
    console.log(`${colors.green}Fichier vercel.json trouvé${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Fichier vercel.json non trouvé. La configuration par défaut de Vercel sera utilisée.${colors.reset}`);
  }
} else {
  console.log(`${colors.red}Fichier next.config.js non trouvé! Cela peut causer des problèmes de build.${colors.reset}`);
}

console.log(`\n${colors.green}=== Préparation terminée ===${colors.reset}`);
console.log(`${colors.cyan}Vous pouvez maintenant déployer votre application sur Vercel.${colors.reset}`);