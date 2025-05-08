@echo off
echo ========================================
echo DÉMARRAGE SERVEUR NEXT.JS AVEC FAST REFRESH
echo ========================================

echo 1. Arrêt forcé des processus Node.js existants sur le port 4000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul

echo 2. Nettoyage complet des caches et fichiers temporaires
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul
del /s /q .next\cache\* 2>nul

echo 3. Vérification que toutes les connexions MongoDB sont bien fermées
echo // Pas d'action directe nécessaire

echo 4. Définition de variables d'environnement pour optimiser Fast Refresh
set "NODE_ENV=development"
set "NEXT_DISABLE_HMR=0"
set "FAST_REFRESH=true"
set "NEXT_TELEMETRY_DISABLED=1"
set "CHOKIDAR_USEPOLLING=1"

echo 5. Démarrage du serveur Next.js avec Fast Refresh
echo ========================================
echo Le serveur va démarrer avec Fast Refresh activé
echo Les modifications seront appliquées automatiquement
echo ========================================
echo Utilisez Ctrl+C pour arrêter le serveur
echo ========================================

npm run dev -- -p 4000