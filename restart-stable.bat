@echo off
echo ========================================
echo SOLUTION DEFINITIVE - NEXT.JS SANS HMR
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

echo 4. Démarrage du serveur Next.js avec notre script personnalisé sans HMR
echo ========================================
echo Le serveur va démarrer avec le script no-hmr.js
echo Rechargement manuel nécessaire pour voir les modifications
echo ========================================
echo Utilisez Ctrl+C pour arrêter le serveur
echo ========================================

node no-hmr.js