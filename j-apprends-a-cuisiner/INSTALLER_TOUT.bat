@echo off
echo ======================================================
echo INSTALLATION DES DEPENDANCES - J'APPRENDS A CUISINER
echo ======================================================

echo.
echo [1/2] Installation du Frontend...
call npm install

echo.
echo [2/2] Installation du Serveur Backend...
cd server
call npm install
cd ..

echo.
echo ======================================================
echo TOUTES LES INSTALLATIONS SONT TERMINEES !
echo ======================================================
pause
