@echo off
REM Mobile Bidding Marketplace - Windows Setup Script
REM This script creates all necessary files for your mobile app

echo.
echo ================================================
echo   Mobile Bidding Marketplace - Setup
echo   Android and iOS Compatible
echo ================================================
echo.

REM Create directory structure
echo Creating folder structure...
if not exist "src\app\components\ui" mkdir src\app\components\ui
if not exist "src\app\components\figma" mkdir src\app\components\figma
if not exist "src\app\data" mkdir src\app\data
if not exist "src\styles" mkdir src\styles
if not exist "public" mkdir public
if not exist ".vscode" mkdir .vscode
if not exist "src\app\lib" mkdir src\app\lib

echo.
echo Files will be created in the current directory.
echo.
echo IMPORTANT: You need to manually copy the following files
echo from the Figma Make project to this directory:
echo.
echo Configuration Files:
echo   - package.json
echo   - vite.config.ts
echo   - tsconfig.json
echo   - postcss.config.mjs
echo   - index.html
echo.
echo Source Files (src/app/):
echo   - App.tsx
echo   - routes.ts
echo.
echo Components (src/app/components/):
echo   - Home.tsx
echo   - ProductDetails.tsx
echo   - CreateProduct.tsx
echo   - ProductPreview.tsx
echo   - ExistingListings.tsx
echo   - SellerDashboard.tsx
echo   - Layout.tsx
echo   - NotFound.tsx
echo.
echo Data (src/app/data/):
echo   - mockData.ts
echo.
echo Styles (src/styles/):
echo   - index.css
echo   - tailwind.css
echo   - theme.css
echo   - mobile.css
echo   - fonts.css
echo.
echo UI Components (copy from src/app/components/ui/):
echo   - All .tsx files from the ui folder
echo.
echo Other:
echo   - public/manifest.json
echo   - .vscode/settings.json
echo   - src/app/components/figma/ImageWithFallback.tsx
echo.
echo ================================================
echo.
echo After copying all files, run:
echo   npm install
echo   npm run dev
echo.
echo ================================================
echo.
pause
