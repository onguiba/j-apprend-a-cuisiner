@echo off
echo ======================================================
echo LANCEMENT DE L'APPLICATION - J'APPRENDS A CUISINER
echo ======================================================

echo.
echo Démarrage du Serveur Backend (Port 3001)...
start cmd /k "cd server && npm run dev"

echo.
echo Démarrage du Frontend (Vite)...
start cmd /k "npm run dev"

echo.
echo ======================================================
echo Les serveurs sont en cours de lancement...
echo Frontend : http://localhost:5173
echo Backend  : http://localhost:3001
echo ======================================================
