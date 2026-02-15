@echo off
REM Mobile Bidding Marketplace - Quick Setup Script (Windows)
REM This script automates the initial setup process

echo.
echo ========================================
echo Mobile Bidding Marketplace - Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo [OK] npm is installed
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    echo This may take a few minutes...
    echo.
    
    REM Check if pnpm is available
    where pnpm >nul 2>nul
    if %errorlevel% equ 0 (
        echo Using pnpm (faster)...
        pnpm install
    ) else (
        echo Using npm...
        npm install
    )
    
    if %errorlevel% equ 0 (
        echo.
        echo [OK] Dependencies installed successfully!
    ) else (
        echo.
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Start development server:
echo    npm run dev
echo.
echo 2. Open in browser:
echo    http://localhost:5173
echo.
echo 3. For mobile testing:
echo    npm run dev -- --host
echo    Then access via your device's browser
echo.
echo Documentation:
echo    - README.md - Project overview
echo    - VSCODE_SETUP.md - VS Code setup guide
echo    - MOBILE_COMPATIBILITY.md - Mobile testing guide
echo    - DEPLOYMENT_GUIDE.md - Deployment instructions
echo.
echo Happy coding!
echo.
pause
